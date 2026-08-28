import { Tag } from '@shared/core/supabase';
import { PostListRow } from './post-list.model';

const ANGULAR: Tag = { id: 1, name: 'Angular', color: '#DD0031', icon: 'angular.svg' };
const TYPESCRIPT: Tag = { id: 2, name: 'TypeScript', color: '#007ACC', icon: 'typescript.svg' };
const JAVASCRIPT: Tag = { id: 3, name: 'JavaScript', color: '#F7DF1E', icon: 'javascript.svg' };
const NODEJS: Tag = { id: 6, name: 'Node.js', color: '#339933', icon: 'nodejs.svg' };
const SSR: Tag = { id: 8, name: 'SSG/SSR', color: '#9E9E9E', icon: 'ssg.svg' };
const TESTING: Tag = { id: 14, name: 'Testing', color: '#4285F4', icon: 'testing.svg' };

const emptyPostFields = {
  content: '',
  cover_image:
    'https://aqdbdmepncxxuanlymwr.supabase.co/storage/v1/object/public/covers/ChatGPT%20Image%2011%20sie%202026,%2020_53_29.png',
  description: '',
  user_id: '',
  post_tags: [],
  comments: [],
  category: null,
  updated: null,
};

export const PLACEHOLDER_POSTS: Partial<PostListRow>[] = [
  {
    ...emptyPostFields,
    id: 'placeholder-1',
    title: 'Strongly Typed Reactive Forms',
    created_at: new Date('2025-05-01').toISOString(),
    is_draft: false,
    tags: [ANGULAR, TYPESCRIPT],
    views: 4200,
  },
  {
    ...emptyPostFields,
    id: 'placeholder-2',
    title: 'Signals: A New Mental Model',
    created_at: new Date('2025-04-06').toISOString(),
    is_draft: false,
    tags: [ANGULAR, JAVASCRIPT],
    views: 6800,
  },
  {
    ...emptyPostFields,
    id: 'placeholder-3',
    title: 'Zoneless Angular Is Here',
    created_at: new Date('2024-07-09').toISOString(),
    is_draft: true,
    tags: [ANGULAR, TESTING],
    views: 0,
  },
  {
    ...emptyPostFields,
    id: 'placeholder-4',
    title: 'SSR & Hydration in Practice',
    created_at: new Date('2024-08-13').toISOString(),
    is_draft: false,
    tags: [ANGULAR, NODEJS, SSR],
    views: 3100,
  },
];
