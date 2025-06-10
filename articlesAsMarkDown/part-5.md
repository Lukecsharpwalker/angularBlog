Hello.

Code on the public repo is available here:

https://github.com/Lukecsharpwalker/angularBlog

Currently working on the scripts that will help to set up the local Supabase instance.

## Creating new Supabase project

It is not my first Supabase project, so we'll skip creating a new account. Also creating a new project is straightforward, so I will not cover it here.

### Create DB and tables

Just in case, Supabase provides a tutorial for migrating from Firestore to Supabase

https://supabase.com/docs/guides/platform/migrating-to-supabase/firestore-data\\n

In our case, we have only two collections; one is for the script that populates articles id's for SSG. So we got one; there is no point in struggling with the migration scripts. They never work on the happy path.

For me SQL is one of the best programming languages; it's mature and intuitive, and there are a lot of good learning materials and examples. So LLMs are fed by good data, so we can rely on them and use AI as leverage.
Here is the SQL code, AI-generated, that will create the tables:

```
-- Enable required extensions\ncreate extension if not exists \"uuid-ossp\";\n\n\ncreate table profiles (\n  id uuid primary key references auth.users(id) on delete cascade,\n  username text unique not null,\n  avatar_url text,\n  created_at timestamp with time zone default now()\n);\n\n\ncreate table tags (\n  id serial primary key,\n  name text unique not null,\n  color text not null,\n  icon text not null\n);\n\n\ncreate table posts (\n  id uuid primary key default uuid_generate_v4(),\n  user_id uuid references profiles(id) on delete cascade,\n  title text not null,\n  description text,\n  content text,\n  is_draft boolean default false,\n  created_at timestamp with time zone default now()\n);\n\n\ncreate table comments (\n  id uuid primary key default uuid_generate_v4(),\n  post_id uuid references posts(id) on delete cascade,\n  user_id uuid references profiles(id) on delete cascade,\n  content text,\n  is_deleted boolean default false,\n  is_reported boolean default false,\n  created_at timestamp with time zone default now()\n);\n\n\ncreate table post_tags (\n  post_id uuid references posts(id) on delete cascade,\n  tag_id int references tags(id) on delete cascade,\n  primary key (post_id, tag_id)\n);\n
```

Let's try it.

Success. No rows returned\\nSuccess. No rows returned\\n

Double success!

![\"supabase-visualizer\"](\"https://aqdbdmepncxxuanlymwr.supabase.co/storage/v1/object/public/post-images//Xnapper-2025-04-21-10.16.39.jpg\")

The table looks nice! Now we have more tables than we had documents. For me, it looks a lot cleaner!

The issue here is that when a new user creates an account, it'll not be bound with the Profiles table. We, of course, can achieve that with some triggers on DB, or in this case, in the code.

I have only a few posts now, so the best option is to just copy data. I hate manual work, but sometimes it is the fastest way.

### Setting up admin

As you may remember, at Firestore we need to set the admin role. It was quite a struggle because we needed to create a function for that. Supabase is better because we can manipulate the DB directly from the GUI.

![](\"https://aqdbdmepncxxuanlymwr.supabase.co/storage/v1/object/public/post-images//addUser.jpg\")

In the raw information about the user, we can see roles, etc. Now the user has only the authenticated role.

![\"user](\"https://aqdbdmepncxxuanlymwr.supabase.co/storage/v1/object/public/post-images//Xnapper-2025-04-22-10.20.26.jpg\")

Now let run SQL command

```
update auth.users\nset raw_app_meta_data = jsonb_set(raw_app_meta_data, '{role}', '\"Admin\"', true),\n    updated_at = now()\nwhere id = 'User Id';\n
```

And here we have the admin role; it should work as a role in the JS SDK, and we will try it later.

![\"admin](\"https://aqdbdmepncxxuanlymwr.supabase.co/storage/v1/object/public/post-images//admin.jpg.jpg\")

Ok, let's set RLS:

```
-- ENABLE RLS ON TABLES\nalter table profiles enable row level security;\nalter table comments enable row level security;\nalter table posts enable row level security;\n\n-- RLS FOR PROFILES\nUPDATE, DELETE: by profile owner or Admin\n\ncreate policy \"Users can edit their own profile or Admin\"\non profiles for update\nusing (auth.uid() = id or auth.jwt()->>'role' = 'Admin');\n\ncreate policy \"Users can delete their own profile or Admin\"\non profiles for delete\nusing (auth.uid() = id or auth.jwt()->>'role' = 'Admin');\n\n-- INSERT: only authenticated users\ncreate policy \"Authenticated users can create profiles\"\non profiles for insert\nwith check (auth.role() = 'authenticated');\n\n-- RLS FOR COMMENTS\n-- SELECT: everyone (no restrictions)\ncreate policy \"Public can read comments\"\non comments for select\nusing (true);\n\n-- INSERT: only authenticated users\ncreate policy \"Authenticated users can add comments\"\non comments for insert\nwith check (auth.role() = 'authenticated');\n\n-- DELETE: Admin only\ncreate policy \"Only Admin can delete comments\"\non comments for delete\nusing (auth.jwt()->>'role' = 'Admin');\n\n-- RLS FOR POSTS\n-- SELECT: everyone\ncreate policy \"Public can read posts\"\non posts for select\nusing (true);\n\n-- INSERT, UPDATE, DELETE: Admin only\ncreate policy \"Only Admin can create posts\"\non posts for insert\nwith check (auth.jwt()->>'role' = 'Admin');\n\ncreate policy \"Only Admin can edit posts\"\non posts for update\nusing (auth.jwt()->>'role' = 'Admin');\n\ncreate policy \"Only Admin can delete posts\"\non posts for delete\nusing (auth.jwt()->>'role' = 'Admin');\n
```

I think we can get rid of the Select Policy for Profile. It's my mistake.

![\"RLS](\"https://aqdbdmepncxxuanlymwr.supabase.co/storage/v1/object/public/post-images//description.jpg\")

Success. No rows returned\\n

Meanwhile, I'll manually copy data and set tags, which are not set yet on the current version, and we'll jump to code!

## Setup and use Supabase

Installing is easy as always:

npm install @supabase/supabase-js\\n

In the env file:

```
export const environment = {\n  production: false,\n  supabaseUrl: 'YOUR_SUPABASE_URL',\n  supabaseKey: 'YOUR_SUPABASE_KEY',\n}\n
```

In the Supabase docs we have a great service example, but we will tweak it a little bit:

```
import { Injectable } from '@angular/core';\nimport {\n  AuthChangeEvent,\n  AuthSession,\n  createClient,\n  Provider,\n  Session,\n  SupabaseClient,\n} from '@supabase/supabase-js';\nimport { environment } from '../../environments/environment';\n\n@Injectable({\n  providedIn: 'root',\n})\nexport class SupabaseService {\n  private readonly supabase: SupabaseClient;\n  public session: AuthSession | null = null;\n\n  constructor() {\n    this.supabase = createClient(\n      environment.supabaseUrl,\n      environment.supabaseKey,\n    );\n  }\n\n  getSession(): AuthSession | null {\n    this.supabase.auth.getSession().then(({ data }) => {\n      this.session = data.session;\n    });\n    return this.session;\n  }\n\n  authChanges(\n    callback: (event: AuthChangeEvent, session: Session | null) => void,\n  ) {\n    return this.supabase.auth.onAuthStateChange(callback);\n  }\n\n  getClient(): SupabaseClient {\n    return this.supabase;\n  }\n\n  signInWithEmail(email: string) {\n    return this.supabase.auth.signInWithOtp({ email });\n  }\n\n  signInWithPassword(email: string, password: string) {\n    return this.supabase.auth.signInWithPassword({ email, password });\n  }\n\n  signUp(email: string, password: string) {\n    return this.supabase.auth.signUp({ email, password });\n  }\n\n  signInWithProvider(provider: Provider) {\n    return this.supabase.auth.signInWithOAuth({\n      provider,\n      options: {\n        redirectTo: window.location.origin,\n      },\n    });\n  }\n\n  signOut() {\n    return this.supabase.auth.signOut();\n  }\n}\n\n
```

Ok, now we can initialize it:

```
{\n  provide: APP_INITIALIZER,\n  useFactory: supabaseInitializer,\n  deps: [SupabaseService],\n  multi: true,\n}\n
```

**APP\_INITIALIZER** is deprecated, but we can still use it!

and the initializer code:

```
import { SupabaseService } from '../services/supabase.service';\nimport { Subscription } from '@supabase/supabase-js';\n\nexport function supabaseInitializer(\n  supabase: SupabaseService,\n): () => { data: { subscription: Subscription } } {\n  return () =>\n    supabase.authChanges((_, session) => (supabase.session = session));\n}\n\n
```

Quick test, and it fails. I had some issues with SSR, so I disabled it on dev for now. Hope that connecting to the DB will help!

### Create (or not) Interfaces

Supabase has another great feature: it creates interfaces for us!

npm install supabase --save-dev\\nnpx supabase gen types typescript --project-id aqdbdmepncxxuanlymwr > src/app/supabase-types.ts\\n

![\"Database](\"https://aqdbdmepncxxuanlymwr.supabase.co/storage/v1/object/public/post-images//wtf.jpg)

WTF?! Yeah, not perfect, but let's bring some magic to life. IntelliJ provides some free credits each month!

![\"AI](\"https://aqdbdmepncxxuanlymwr.supabase.co/storage/v1/object/public/post-images//magic.jpg\")

Much better!

![\"types\"](\"https://aqdbdmepncxxuanlymwr.supabase.co/storage/v1/object/public/post-images//better.jpg\")

Our call will look like this:

async getPosts(): Promise<PostRow\[\] | null> {\\n let { data: posts } = await this.supabaseService.getClient\\n .from('posts')\\n .select('\*')\\n .order('created\_at', { ascending: false });\\n\\n return posts;\\n }\\n

Of course we will need to add a relation later.

## ![](\"\")Install NGRX SignalStore

ng add @ngrx/signals@latest\\n

Lets create a store file **posts.store.ts**

```
import { Post } from '../../../../types/supabase';\nimport {\n  patchState,\n  signalStore,\n  withMethods,\n  withState,\n} from '@ngrx/signals';\nimport { inject } from '@angular/core';\nimport { ReaderApiService } from '../../../_services/reader-api.service';\n\ntype PostsState = {\n  posts: Post[];\n  loading: boolean;\n  error: string | null;\n};\n\nconst initialState: PostsState = {\n  posts: [],\n  loading: false,\n  error: null,\n};\n\nexport const PostsStore = signalStore(\n  { providedIn: 'root' },\n  withState(initialState),\n\n  withMethods((state, postService = inject(ReaderApiService)) => ({\n    async getPosts() {\n      patchState(state, { loading: true, error: null });\n      try {\n        const posts = await postService.getPosts();\n        if (posts) {\n          patchState(state, { posts, loading: false });\n        } else {\n          patchState(state, { error: 'No posts found', loading: false });\n        }\n      } catch (error) {\n        patchState(state, { error: 'Failed to fetch posts', loading: false });\n      }\n    },\n  })),\n  withHooks({\n    onInit(store) {\n      store.getPosts();\n    },\n  }),\n);\n
```

Remember the onInit hook; without this, you need to call it manually on init.

Usage is super simple:

```
postStore = inject(PostsStore);\nposts = this.postStore.posts;\n
```

```
<div class=\"flex justify-center mt-5\">\n  <div class=\"w-full\">\n    <div class=\"grid\">\n      @for (post of posts(); track post.id; let f = $first) {\n        <app-post-card [post]=\"post\"></app-post-card>\n      }\n    </div>\n  </div>\n</div>\n
```

That's all!

![\"post](\"https://aqdbdmepncxxuanlymwr.supabase.co/storage/v1/object/public/post-images//thatall.jpg\")

Ok, now let's tweak query to get all data We need posts with author tags and also only posts that are not in the **draft**.

async getPosts(): Promise<Post\[\] | null> {\\n const { data: posts } = await this.supabaseService.getClient\\n .from('posts')\\n .select(\`\\n \*,\\n author:profiles ( id, username, avatar\_url ),\\n post\_tags (\\n tags ( id, name, color, icon )\\n  )\\n \`,\\n    )\\n .eq('is\_draft', false)\\n .order('created\_at', { ascending: false });\\n\\n return posts;\\n}\\n

There was an issue with the author because **Read** was available for the auth user; this was a mistake.

Nice, it's working. Now I'll adjust all other places, and then we'll check if issues with the SSR are gone!

They are not gone; to be honest, it was very hard to spot where the issue was. I've tried to cut all possibilities; everything and nothing helps, so the issue needs to be in the root.

I have found that Supabase got some glitch at init.

In the **Supabase service,** I changed the client creation:

```
constructor() {\n  this.supabase = this.ngZone.runOutsideAngular(() =>\n    createClient(environment.supabaseUrl, environment.supabaseKey),\n  );\n}\n
```

It helps to build and run an app, but the content didn't prerender. XD WTF, mate, it's supposed to be easy, just one time xD

I'm not sure if it's Supabase issue or SignalStore issue but

setTimeout(() => {}, 0);\\n

helps to prerender content. I will investigate this later because it's a lame approach.

## Setup env on the GitHub Actions

Yeah, I pushed envs, but there are add-ons for Git that revert whole history and remove specific files; it took less than a second, so fair enough for that kind of a mistake.

Keys will be exposed anyway in the bundle; it's just how FE works, but we have a server app for our static file, and maybe it will be used for some password recovery, so admin credentials should be confidential!

I've added this step to jobs

```
- name: Generate environment.ts from secrets\n        shell: bash\n        run: |\n          cat > src/environments/environment.ts <<'EOF'\n          export const environment = {\n            production: true,\n            supabaseUrl: '${{ secrets.SUPABASE_URL }}',\n            supabaseKey: '${{ secrets.SUPABASE_ANON_KEY }}',\n          };\n          EOF\n\n      - run: npm ci\n      - run: npm run test -- --browsers=ChromeHeadless --watch=false --no-progress\n
```

PR action passed! So that's all; thank you! Have a lovely day!

## Errata

So Supabase is not working great for SSG/SSR.

There was an issue with initializing Supabase then; for prerender, I fixed prerender, but then, something went wrong with hydration:

https://aqdbdmepncxxuanlymwr.supabase.co/storage/v1/object/public/post-images//flicking.mov

### Leveraging SSG by Supabase autogenerated Rest API

Supabase has an autogenerated API; I'm quite sure that is handled by **PostgREST.**

```
  getPosts(): Observable<Post[] | null> {\n    const selectQuery = `\n      *,\n      author:profiles(id,username,avatar_url),\n      post_tags(tags(id,name,color,icon))\n    `\n      .replace(/\\s+/g, ' ')\n      .trim();\n\n    const params = new HttpParams()\n      .set('select', selectQuery)\n      .set('is_draft', 'eq.false')\n      .set('order', 'created_at.desc');\n\n    const headers = new HttpHeaders({\n      apikey: this.apiKey,\n      Authorization: `Bearer ${this.apiKey}`,\n      Accept: 'application/json',\n    });\n\n    return this.http.get<Post[]>(`${this.baseUrl}posts`, { headers, params });\n  }\n
```

Looks bad, works great - fair enough!.

It could be refactored and will be! For sure this **Bearer** should be in the interceptor.

Also, SignalStore should be adjusted.

```
withMethods((store, postService = inject(ReaderApiService)) => ({\n  getPost: rxMethod<string>(\n    pipe(\n      tap(() => patchState(store, { loading: true, error: null })),\n      switchMap((id) =>\n        postService.getPost(id).pipe(\n          tapResponse({\n            next: (post: Post) => patchState(store, { post, loading: false }),\n            error: (err: string) =>\n              patchState(store, {\n                error: err ?? 'Failed to fetch post',\n                loading: false,\n              }),\n          }),\n        ),\n      ),\n    ),\n  ),\n})),\n
```

**rxMethod** is provided by NGRX SignalStore and handles subscriptions inside. How cool is that?

Now SSG and SSR work like a charm!

"
