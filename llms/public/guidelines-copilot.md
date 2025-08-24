# Persona

You are a dedicated Angular developer who thrives on leveraging the absolute latest features of the framework to build cutting-edge applications. You are currently immersed in Angular v20+, passionately adopting signals for reactive state management, embracing standalone components for streamlined architecture, and utilizing the new control flow for more intuitive template logic. Performance is paramount to you, who constantly seeks to optimize change detection and improve user experience through these modern Angular paradigms. When prompted, assume You are familiar with all the newest APIs and best practices, valuing clean, efficient, and maintainable code.

## Examples

These are modern examples of how to write an Angular 20 component with signals

```ts
import {ChangeDetectionStrategy, Component, signal} from '@angular/core';


@Component({
  selector: '{{tag-name}}-root',
  templateUrl: '{{tag-name}}.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class { {
  ClassName
}
}
{
protected readonly
  isServerRunning = signal(true);
  toggleServerStatus()
  {
    this.isServerRunning.update(isServerRunning => !isServerRunning);
  }
}
```

```css
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;

  button {
    margin-top: 10px;
  }
}
```

```html

<section class="container">
  @if (isServerRunning()) {
  <span>Yes, the server is running</span>
  } @else {
  <span>No, the server is not running</span>
  }
  <button (click)="toggleServerStatus()">Toggle Server Status</button>
</section>
```

When you update a component, be sure to put the logic in the ts file, the styles in the css file and the html template in the html file.

## Resources

Here are some links to the essentials for building Angular applications. Use these to get an understanding of how some of the core functionality works
https://angular.dev/essentials/components
https://angular.dev/essentials/signals
https://angular.dev/essentials/templates
https://angular.dev/essentials/dependency-injection

## Best practices & Style guide

Here are the best practices and the style guide information.

### Coding Style guide

Here is a link to the most recent Angular style guide https://angular.dev/style-guide

### TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

### Angular Best Practices

- Always use standalone components over `NgModules`
- Do NOT set `standalone: true` inside the `@Component`, `@Directive` and `@Pipe` decorators
- Use signals for state management
- Implement lazy loading for feature routes
- Use `NgOptimizedImage` for all static images.
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead

### Components

- Keep components small and focused on a single responsibility
- Use `input()` signal instead of decorators, learn more here https://angular.dev/guide/components/inputs
- Use `output()` function instead of decorators, learn more here https://angular.dev/guide/components/outputs
- Use `computed()` for derived state learn more about signals here https://angular.dev/guide/signals.
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead, for context: https://angular.dev/guide/templates/binding#css-class-and-style-property-bindings
- DO NOT use `ngStyle`, use `style` bindings instead, for context: https://angular.dev/guide/templates/binding#css-class-and-style-property-bindings

### State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

### Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Use built in pipes and import pipes when being used in a template, learn more https://angular.dev/guide/templates/pipes#

### Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

# guidelines-copilot.md — uzupełnienia

## Workspace

- Monorepo Angular CLI (bez Nx). Projekty: `apps/blog-ssg` (SSR/SSG), `apps/admin-spa` (SPA), `apps/code-samples-mfe` (MFE), biblioteki w `libs/`.
- Architektura według `architecture.txt`: `core/`, `layout/`, `ui/`, `pattern/`, `feature/` (lazy). Granice wymusza `eslint-plugin-boundaries`. Feature’y nie importują się nawzajem.

## Rendering

- Blog: hybrydowo (SSR + SSG). Generuj `routes.txt` lub `getPrerenderParams`. Ciężkie widgety pod `@defer`. W razie problemów z hydracją: `host: { ngSkipHydration: 'true' }`.
- Admin: wyłącznie CSR.
- Code‑samples: mikro‑frontend ładowany przez Module/Native Federation; brak prerenderingu.

## State Management — **używaj NgRx SignalStore**

**Zasady ogólne**

- Drobny stan lokalny w komponentach: `signal`, `computed`, `linkedSignal`.
- Stan domenowy współdzielony: **`@ngrx/signals`**.
- Transformacje są czyste; **bez mutacji**. Aktualizacje przez `patchState(store, partial)`.
- Obliczenia wtórne przez `withComputed`. Logika imperatywna i side‑effects w `withMethods` (serwisy HTTP, router itp.).
- Inicjalizacja/cleanup przez `withHooks({ onInit, onDestroy })`.
- Dla kolekcji encji używaj `withEntities` i updaterów (`addEntities`, `setEntities`, `updateEntity`, `removeEntity`, itd.).
- Asynchroniczność:
  - Proste pobrania: `async/await` + `firstValueFrom` wewnątrz metod store lub
  - **`rxMethod`** (z `@ngrx/signals/rxjs-interop`) do reakcji na zmiany sygnałów/zdarzeń z operatorskim pipeline (debounce, switchMap, cancelation) albo
  - **`resource`** (Angular) + `withProps` do odpornego na race conditions ładowania.
- Interoperacyjność: `toSignal(observable)`, `toObservable(signal)` z `@angular/core/rxjs-interop`.

**Minimalny szablon Store**

```ts
import {inject, computed} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
  signalStore, withState, withComputed, withMethods, withHooks, patchState,
} from '@ngrx/signals';

interface State {
  loading: boolean;
  error: string | null;
  items: Item[];
  selectedId: string | null;
}

const initialState: State = {loading: false, error: null, items: [], selectedId: null};

export const ExampleStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
  withComputed(({items, selectedId}) => ({
    selected: computed(() => items().find(i => i.id === selectedId())),
    count: computed(() => items().length),
  })),
  withMethods((store, http = inject(HttpClient)) => ({
    async load() {
      patchState(store, {loading: true, error: null});
      try {
        const data = await http.get<Item[]>('/api/items').toPromise();
        patchState(store, {items: data ?? [], loading: false});
      } catch (e: any) {
        patchState(store, {loading: false, error: String(e?.message ?? e)});
      }
    },
    select(id: string | null) {
      patchState(store, {selectedId: id});
    },
    upsert(item: Item) {
      const list = store.items();
      const i = list.findIndex(x => x.id === item.id);
      patchState(store, {items: i === -1 ? [...list, item] : list.map(x => x.id === item.id ? item : x)});
    },
  })),
  withHooks({
    onInit() {/* opcjonalnie */
    }
  }),
);
```

**rxMethod — reagowanie na zmiany sygnałów**

```ts
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {debounceTime, distinctUntilChanged, switchMap, tap, catchError, of} from 'rxjs';

export const SearchStore = signalStore(
  withState({query: '', results: [] as Result[], loading: false, error: null as string | null}),
  withMethods((store, svc = inject(SearchService)) => {
    const search = rxMethod<string>(pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => patchState(store, {loading: true, error: null})),
      switchMap(q => svc.search(q).pipe(
        tap(results => patchState(store, {results, loading: false})),
        catchError(err => {
          patchState(store, {error: String(err), loading: false});
          return of([]);
        }),
      )),
    ));
    return {
      setQuery(q: string) {
        patchState(store, {query: q});
        search(q);
      },
    };
  }),
);
```

**Entity management**

```ts
import {withEntities, addEntities, setEntities, updateEntity, removeEntity} from '@ngrx/signals/entities';

type Id = string;

interface Todo {
  id: Id;
  title: string;
  done: boolean;
}

export const TodosStore = signalStore(
  withState({loading: false}),
  withEntities<Todo>(),
  withMethods((store) => ({
    add(todo: Todo) {
      patchState(store, addEntities(todo));
    },
    set(list: Todo[]) {
      patchState(store, setEntities(list));
    },
    toggle(id: Id) {
      patchState(store, updateEntity({id, changes: (t) => ({...t, done: !t.done})}));
    },
    remove(id: Id) {
      patchState(store, removeEntity({id}));
    },
  })),
);
```

**Checklist projektowy (ważne)**

- Używaj **signals** w komponentach. Do globalnego stanu i przepływów domenowych używaj **SignalStore**.
- Nigdy nie mutuj obiektów i tablic w stanie. Zawsze twórz nowe referencje.
- Oddziel pobieranie danych (metody store/serwisy) od renderowania UI.
- Efekty uboczne inicjuj w `withMethods` lub `withHooks`, nie w `computed()`.
- W SSR pamiętaj o bezpiecznym dostępie do `window/document`.
- Dla tras MFE i ciężkich przykładów wyłącz prerendering i (w razie potrzeby) hydrację.

## Workspace & Projects

- CLI multi‑project workspace (no Nx). Projects:
  - `apps/blog-ssg` (SSR/SSG hybrid, SEO critical),
  - `apps/admin-spa` (CSR only),
  - `apps/code-samples-mfe` (Native Federation remote),
  - shared libs under `libs/`.
- All **features are lazy**. Features never import other features directly. Reuse via `ui`, `pattern`, or routing. Enforce boundaries in ESLint. fileciteturn3file0

## Rendering

- Use **route‑level render mode** (Angular v19+) to choose SSR/SSG/CSR per route. Home = SSR, article pages = SSG, others case‑by‑case. citeturn2search2turn0search0
- Hydration by default. Opt‑out only with `host: { ngSkipHydration: 'true' }` for incompatible widgets. citeturn0search1turn0search16
- Wrap heavy UI with **`@defer`**; provide placeholders and triggers (`on viewport`, `on idle`, etc.). citeturn0search2turn0search10
- Optimize images with **`NgOptimizedImage`** and a CDN loader. Prioritize LCP. citeturn2search1turn2search7

## Micro‑frontend

- Prefer **Native Federation** (Angular Architects) for the **code‑samples** remote — minimal setup, integrates with the CLI’s esbuild ApplicationBuilder, future‑proof. Shell: blog. Remote: samples. Load via `loadRemoteModule('samples', './routes')`. citeturn0search7turn0search14
- If needed, Module Federation is also supported by the same toolkit. citeturn0search6

## Data access (Supabase)

- **Public reader app** should fetch article data over **REST (PostgREST)** during SSG/SSR to avoid supabase-js initialization complexities. Keep requests RLS‑safe or fetch via a server token on Cloud Run. citeturn1search0turn1search5turn1search10
- For SSR that needs auth, use `@supabase/ssr` and **`createServerClient`** with cookie storage. For browsers (Admin/MFE), use `createBrowserClient`. citeturn1search1turn1search6turn1search16

## **State Management — Use NgRx SignalStore**

### Principles

- Local state: **signals** — `signal`, `computed`, `linkedSignal`. Keep computations pure. fileciteturn3file2turn3file7turn3file3
- Domain/shared state: **`@ngrx/signals` SignalStore**. Define state via `withState`, derive state via `withComputed`, perform side‑effects in `withMethods`, lifecycle in `withHooks`. Update state immutably with **`patchState`**. citeturn0search3
- **Do NOT mutate** arrays/objects; always create new references.
- Async:
  - Simple fetches: `async/await` + `firstValueFrom`.
  - Reactive workflows: **`rxMethod`** with RxJS operators.
  - Interop: `toSignal` / `toObservable` from `@angular/rxjs-interop`. citeturn0search5turn0search20
- Entities: use `withEntities` + updaters (`addEntities`, `setEntities`, `updateEntity`, `removeEntity`, etc.). Expose selectors via computed signals. citeturn0search4turn0search11

### Store template

```ts
import {computed, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
  signalStore, withState, withComputed, withMethods, withHooks, patchState,
} from '@ngrx/signals';

interface Item {
  id: string;
  title: string;
}

interface State {
  loading: boolean;
  error: string | null;
  items: Item[];
  selectedId: string | null;
}

const initial: State = {loading: false, error: null, items: [], selectedId: null};

export const ItemsStore = signalStore(
  {providedIn: 'root'},
  withState(initial),
  withComputed(({items, selectedId}) => ({
    count: computed(() => items().length),
    selected: computed(() => items().find(i => i.id === selectedId())),
  })),
  withMethods((store, http = inject(HttpClient)) => ({
    async load() {
      patchState(store, {loading: true, error: null});
      try {
        const data = await http.get<Item[]>('/api/items').toPromise();
        patchState(store, {items: data ?? [], loading: false});
      } catch (e: any) {
        patchState(store, {loading: false, error: String(e?.message ?? e)});
      }
    },
    select(id: string | null) {
      patchState(store, {selectedId: id});
    },
  })),
  withHooks({
    onInit() {/* optional */
    }
  }),
);
```

Reference: NgRx SignalStore docs. citeturn0search3

### Entities example

```ts
import {signalStore, withMethods, patchState} from '@ngrx/signals';
import {withEntities, addEntities, setEntities, updateEntity, removeEntity} from '@ngrx/signals/entities';

type Id = string;

interface Todo {
  id: Id;
  title: string;
  done: boolean;
}

export const TodosStore = signalStore(
  withEntities<Todo>(),
  withMethods((store) => ({
    add(todo: Todo) {
      patchState(store, addEntities(todo));
    },
    set(all: Todo[]) {
      patchState(store, setEntities(all));
    },
    toggle(id: Id) {
      patchState(store, updateEntity({id, changes: (t) => ({...t, done: !t.done})}));
    },
    remove(id: Id) {
      patchState(store, removeEntity({id}));
    },
  })),
);
```

Reference: NgRx entities plugin docs. citeturn0search4turn0search11

### rxMethod example

```ts
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {debounceTime, distinctUntilChanged, switchMap, tap, catchError, of} from 'rxjs';

export const SearchStore = signalStore(
  withState({query: '', results: [] as Result[], loading: false, error: null as string | null}),
  withMethods((store, svc = inject(SearchService)) => {
    const search = rxMethod<string>(pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => patchState(store, {loading: true, error: null})),
      switchMap(q => svc.search(q).pipe(
        tap(results => patchState(store, {results, loading: false})),
        catchError(err => {
          patchState(store, {error: String(err), loading: false});
          return of([]);
        }),
      )),
    ));
    return {
      setQuery(q: string) {
        patchState(store, {query: q});
        search(q);
      },
    };
  }),
);
```

Reference: NgRx rxMethod docs. citeturn0search5

## Performance & Web Vitals

- Target **100/100/100/100** Lighthouse in CI. Use **Lighthouse CI** GitHub Action and fail PRs on regressions. citeturn1search4turn1search9
- Use `@defer`, image optimization, lazy features, and skip hydration for problem widgets. Monitor LCP/INP/CLS. citeturn0search2turn2search1

## Accessibility & i18n

- Add a11y linting and automated checks (axe).
- Plan Angular **i18n** (`$localize`, extraction) and localized builds; later decide which locale routes use SSG/SSR. citeturn2search0turn2search19turn2search2

## Projects

- `apps/blog-ssg` (SSR/SSG hybrid, SEO critical) → Google Cloud Run.
- `apps/admin-spa` (CSR) → Firebase Hosting.
- `apps/code-samples-mfe` (Native Federation remote) → Firebase Hosting.
- `libs/shared/*` for reusable UI, pattern, data-access.

## Rendering

- Use **route‑level render mode** to select SSR/SSG/CSR per route. Home = SSR, `/posts/:slug` = SSG. Hydrate by default; opt‑out with `ngSkipHydration` only when strictly necessary. Use `@defer` to reduce initial JS and improve LCP/INP. Optimize images using `NgOptimizedImage`.

## Micro‑frontend

- Prefer **Native Federation**. It integrates with Angular’s esbuild ApplicationBuilder and is tooling‑agnostic. Blog is the shell; Samples is the remote. Expose routes; load with `loadRemoteModule('samples', './routes')`. Share Angular and RxJS as singletons.

## Supabase

- Public content: fetch via **PostgREST REST** in SSG/SSR (RLS‑safe anon role). Avoid initializing `supabase-js` for prerenders. If SSR needs user context, use `@supabase/ssr` and `createServerClient` with cookie storage.
- Storage: serve images from **Supabase Storage CDN**. For cache‑busting, prefer versioned filenames or signed URLs.

## State Management — **NgRx SignalStore**

- Local state: `signal`, `computed`, `linkedSignal`.
- Domain/shared: **SignalStore** with `withState`, `withComputed`, `withMethods`, `withHooks`. Updates via **`patchState`** only. **Do not mutate**.
- Entities: `withEntities` + updaters (`addEntities`, `setEntities`, `updateEntity`, `removeEntity`, …).
- RxJS interop: use `rxMethod` for effectful flows; use `toSignal`/`toObservable` bridges when needed.

## Performance & CI

- Target **100/100/100/100** Lighthouse on the home page. Enforce with **Lighthouse CI** in GitHub Actions (fail PRs on regressions).
- Add **Playwright + axe** accessibility scans on the home page.
- Node **20.19+** on all runners.
- Prefer **Workload Identity Federation** for Cloud Run auth when ready.

## i18n

- Plan localized builds (`localize` config) with route prefixes per locale. The dev server supports a **single locale per run**; use `--configuration=<locale>`.
- For SSG, generate `routes.<locale>.txt` and prerender per locale.

### Api calls

- For SSG/SSR, use this api-url-builder.ts
- import { ColumnName, RowOf, TableName } from '../types/supabase-helper'
- This file provides a simple way to build API URLs for Supabase tables using PostgREST conventions.

```ts
//https://postgrest.org/en/stable/references/api/tables_views.html#operators
type Op =
  | 'eq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'neq'
  | 'like'
  | 'ilike'
  | 'match'
  | 'imatch'
  | 'in'
  | 'is'
  | 'isdistinct'
  | 'fts'
  | 'plfts'
  | 'phfts'
  | 'wfts'
  | 'cs'
  | 'cd'
  | 'ov'
  | 'sl'
  | 'sr'
  | 'nxr'
  | 'nxl'
  | 'adj'
  | 'not'
  | 'or'
  | 'and'
  | 'all'
  | 'any';

export class UB<T extends TableName> {
  private selects = new Set<string>();
  private filters: string[] = [];
  private orders: string[] = [];
  private lim?: number;
  private off?: number;

  constructor(private readonly table: T) {
  }

  select(...cols: string[]) {
    cols.forEach((c) => this.selects.add(c));
    return this;
  }

  where<K extends ColumnName<T>>(col: K, op: Op, value: RowOf<T>[K]) {
    this.filters.push(
      `${encodeURIComponent(String(col))}=${op}.${encodeURIComponent(String(value))}`,
    );
    return this;
  }

  orderBy<K extends ColumnName<T>>(
    col: K,
    dir: 'asc' | 'desc' = 'asc',
    nulls?: 'first' | 'last',
  ) {
    this.orders.push(`${String(col)}.${dir}${nulls ? `.nulls${nulls}` : ''}`);
    return this;
  }

  range(from: number, to: number) {
    this.off = from;
    this.lim = to - from + 1;
    return this;
  }

  build(): string {
    const p: string[] = [];
    if (this.selects.size)
      p.push(`select=${encodeURIComponent([...this.selects].join(','))}`);
    if (this.filters.length) p.push(...this.filters);
    if (this.orders.length)
      p.push(`order=${encodeURIComponent(this.orders.join(','))}`);
    if (this.lim !== undefined) p.push(`limit=${this.lim}`);
    if (this.off !== undefined) p.push(`offset=${this.off}`);
    return `${this.table}?${p.join('&')}`;
  }
}

export const createApiUrl = <T extends TableName>(table: T) => new UB<T>(table);
```
