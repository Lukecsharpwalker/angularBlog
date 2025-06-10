
Hello.  
  
Code on the public repo is available here:  
  
https://github.com/Lukecsharpwalker/angularBlog  
  
I'm currently working on scripts to help set up the local Supabase instance.  
  
## Creating new Supabase project 
  
This isn't my first Supabase project, so we'll skip creating a new account. Also creating a new project is straightforward, so I will not cover it here.  
  
### Create DB and tables  
  
Just in case, Supabase provides a tutorial for migrating from Firestore to Supabase  
  
https://supabase.com/docs/guides/platform/migrating-to-supabase/firestore-data
  
In our case, we have only two collections; one is for the script that populates articles id's for SSG. So we only have one. There's no point in struggling with migration scripts. They never work on the happy path.  
  
To me, SQL is one of the best programming languages; it's mature and intuitive, and there are a lot of good learning materials and examples. So LLMs are fed by good data, so we can rely on them and use AI as a leverage.  
Here is the SQL code, AI-generated, that will create the tables:  

  
```sql
create extension if not exists "uuid-ossp";

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  avatar_url text,
  created_at timestamp with time zone default now()
);

create table tags (
  id serial primary key,
  name text unique not null,
  color text not null,
  icon text not null
);

create table posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  description text,
  content text,
  is_draft boolean default false,
  created_at timestamp with time zone default now()
);

create table comments (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid references posts(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  content text,
  is_deleted boolean default false,
  is_reported boolean default false,
  created_at timestamp with time zone default now()
);

create table post_tags (
  post_id uuid references posts(id) on delete cascade,
  tag_id int references tags(id) on delete cascade,
  primary key (post_id, tag_id)
);
```
  
Let's try it.  
  ```
Success. No rows returned
Success. No rows returned
```
  
Double success!  
  
![enter image description here](https://aqdbdmepncxxuanlymwr.supabase.co/storage/v1/object/public/post-images//Xnapper-2025-04-21-10.16.39.jpg)
  
The table looks nice! Now we have more tables than we had documents. For me, it looks a lot cleaner!  
  
The issue here is that when a new user creates an account, it'll not be bound with the Profiles table. We, of course, can achieve that with some triggers on DB, or in this case, in the code.  
  
I have only a few posts now, so the best option is to just copy data. I hate manual work, but sometimes it is the fastest way.  
  
### Setting up admin  
  
As you may remember, at Firestore we need to set the admin role. It was quite a struggle because we needed to create a function for that. Supabase is better because we can manipulate the DB directly from the GUI.  
  
![enter image description here](https://aqdbdmepncxxuanlymwr.supabase.co/storage/v1/object/public/post-images//addUser.jpg)
  
In the raw information about the user, we can see roles, etc. Now the user has only the authenticated role.  
  
![enter image description here](https://aqdbdmepncxxuanlymwr.supabase.co/storage/v1/object/public/post-images//Xnapper-2025-04-22-10.20.26.jpg)
  
Now let's run the SQL command:  
  
```sql
update auth.users
set raw_app_meta_data = jsonb_set(raw_app_meta_data, '{role}', '"Admin"', true),
    updated_at = now()
where id = 'User Id';
```
  
And here we have the admin role; it should be recognized as a role by the JS SDK, and we will try it later.  
![enter image description here](https://aqdbdmepncxxuanlymwr.supabase.co/storage/v1/object/public/post-images//admin.jpg.jpg)
  
Now let's configure Row-Level Security (RLS):  
  
```sql
-- ENABLE RLS ON TABLES
alter table profiles enable row level security;
alter table comments enable row level security;
alter table posts enable row level security;

-- RLS FOR PROFILES
-- UPDATE, DELETE: by profile owner or Admin

create policy "Users can edit their own profile or Admin"
on profiles for update
using (auth.uid() = id or auth.jwt()->>'role' = 'Admin');

create policy "Users can delete their own profile or Admin"
on profiles for delete
using (auth.uid() = id or auth.jwt()->>'role' = 'Admin');

-- INSERT: only authenticated users
create policy "Authenticated users can create profiles"
on profiles for insert
with check (auth.role() = 'authenticated');

-- RLS FOR COMMENTS
-- SELECT: everyone (no restrictions)
create policy "Public can read comments"
on comments for select
using (true);

-- INSERT: only authenticated users
create policy "Authenticated users can add comments"
on comments for insert
with check (auth.role() = 'authenticated');

-- DELETE: Admin only
create policy "Only Admin can delete comments"
on comments for delete
using (auth.jwt()->>'role' = 'Admin');

-- RLS FOR POSTS
-- SELECT: everyone
create policy "Public can read posts"
on posts for select
using (true);

-- INSERT, UPDATE, DELETE: Admin only
create policy "Only Admin can create posts"
on posts for insert
with check (auth.jwt()->>'role' = 'Admin');

create policy "Only Admin can edit posts"
on posts for update
using (auth.jwt()->>'role' = 'Admin');

create policy "Only Admin can delete posts"
on posts for delete
using (auth.jwt()->>'role' = 'Admin');
```
  
We can probably remove the SELECT policy for profiles — that was my mistake.  
![enter image description here](https://aqdbdmepncxxuanlymwr.supabase.co/storage/v1/object/public/post-images//description.jpg)
  
  ```
Success. No rows returned
  ```
Meanwhile, I'll manually copy data and set tags, which are not set yet on the current version, and we'll jump to code!  
  
## Setup and use Supabase  
  
Installing is easy as always:  
  
 ```
npm install @supabase/supabase-js\\n  
 ```
In the env file:  
  
```typescript
export const environment = {
  production: false,
  supabaseUrl: 'YOUR_SUPABASE_URL',
  supabaseKey: 'YOUR_SUPABASE_KEY',
}
```
  
The Supabase docs offer a great example the service, but we will tweak it a little bit:  
  
```typescript
import { Injectable } from '@angular/core';
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Provider,
  Session,
  SupabaseClient,
} from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private readonly supabase: SupabaseClient;
  public session: AuthSession | null = null;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
    );
  }

  getSession(): AuthSession | null {
    this.supabase.auth.getSession().then(({ data }) => {
      this.session = data.session;
    });
    return this.session;
  }

  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void,
  ) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  signInWithEmail(email: string) {
    return this.supabase.auth.signInWithOtp({ email });
  }

  signInWithPassword(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  signUp(email: string, password: string) {
    return this.supabase.auth.signUp({ email, password });
  }

  signInWithProvider(provider: Provider) {
    return this.supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });
  }

  signOut() {
    return this.supabase.auth.signOut();
  }
}
```
  
Ok, now we can initialize it:  
  
```typescript
{
  provide: APP_INITIALIZER,
  useFactory: supabaseInitializer,
  deps: [SupabaseService],
  multi: true,
}
```
  
**APP\_INITIALIZER** is deprecated, but we can still use it!  
  
Here's the initializer function:  
  
```typescript
import { SupabaseService } from '../services/supabase.service';
import { Subscription } from '@supabase/supabase-js';

export function supabaseInitializer(
  supabase: SupabaseService,
): () => { data: { subscription: Subscription } } {
  return () =>
    supabase.authChanges((_, session) => (supabase.session = session));
}
```  
  
### Create (or not) Interfaces  
  
Supabase has another great feature: it creates interfaces for us!  
  ```
npm install supabase --save-dev
npx supabase gen types typescript --project-id aqdbdmepncxxuanlymwr > src/app/supabase-types.ts  
```
    ![enter image description here](https://aqdbdmepncxxuanlymwr.supabase.co/storage/v1/object/public/post-images//wtf.jpg)
![\"Database](\"https://aqdbdmepncxxuanlymwr.supabase.co/storage/v1/object/public/post-images//wtf.jpg)  
  
Yeah, it doesn't look like a classic interface, but let's bring some magic to life. IntelliJ provides some free credits each month!  
  
![enter image description here](https://aqdbdmepncxxuanlymwr.supabase.co/storage/v1/object/public/post-images//magic.jpg)
  
Much better!    
![enter image description here](https://aqdbdmepncxxuanlymwr.supabase.co/storage/v1/object/public/post-images//better.jpg)
  
Quick side note: while writing this post, I tried using the Supabase library to make a call to the DB, but it didn't work well with SSG/SSR as expected.  Supabase provide out of a box REST API. 
Our call will look like this:  
  
```typescript
getPosts(): Observable<Post[] | null> {
  const selectQuery = `
    *,
    author:profiles(id,username,avatar_url),
    post_tags(tags(id,name,color,icon))
  `
    .replace(/\s+/g, ' ')
    .trim();

  const params = new HttpParams()
    .set('select', selectQuery)
    .set('is_draft', 'eq.false')
    .set('order', 'created_at.desc');

  return this.http.get<Post[]>(`${this.baseUrl}posts`, { headers, params });
}
```
  
Of course we will need to add a relation later.  
  
## ![](\"\")Install NGRX SignalStore  
  
```ng add @ngrx/signals@latest``` 
  
Let's create a store file **posts.store.ts**  
  
```typescript
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withState,
  withMethods,
  withHooks,
  withComputed,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

import { Post } from '../../../../types/supabase';
import { ReaderApiService } from '../../../_services/reader-api.service';

type PostsState = {
  posts: Post[] | null;
  loading: boolean;
  error: string | null;
};

const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null,
};

export const PostsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, api = inject(ReaderApiService)) => ({
    loadPosts: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          api.getPosts().pipe(
            tapResponse({
              next: (posts) => patchState(store, { posts, loading: false }),
              error: (err) =>
                patchState(store, {
                  error: 'Failed to fetch posts',
                  loading: false,
                }),
            }),
          ),
        ),
      ),
    ),
  })),

  withHooks(({ loadPosts }) => ({
    onInit() {
      loadPosts();
    },
  })),

  withComputed(({ posts }) => ({
    total: computed(() => posts()!.length),
  })),
);
```
  **rxMethod** is provided by NgRx SignalStore and handles subscriptions inside. How cool is that?
Remember the onInit hook; without this, you need to call it manually on init.  
  Usage is super simple:  
  
```typescript
postStore = inject(PostsStore);
posts = this.postStore.posts;
```
  
```html
<div class="flex justify-center mt-5">
  <div class="w-full">
    <div class="grid">
      @for (post of posts(); track post.id; let f = $first) {
        <app-post-card [post]="post"></app-post-card>
      }
    </div>
  </div>
</div>
```
  
That's all!  You can achive all of that in just few minutes!
 ![enter image description here](https://aqdbdmepncxxuanlymwr.supabase.co/storage/v1/object/public/post-images//thatall.jpg)
  
Inside the repo, you’ll find additional API calls, including those with relations, as well as examples for POST and DELETE actions.

  

On my blog, I’ve shared an extended version where I dive into some of the challenges I faced—because I write as I code. Just a reminder: things are rarely as simple as they seem. Everyone goes through ups and downs, and that’s part of the journey.
