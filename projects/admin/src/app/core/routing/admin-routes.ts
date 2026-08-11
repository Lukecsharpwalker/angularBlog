export const ADMIN_PATH = {
  login: 'login',
  post: 'post',
  posts: 'posts',
  newPost: 'new',
} as const;

export const ADMIN_ROUTE = {
  login: `/${ADMIN_PATH.login}`,
  post: `/${ADMIN_PATH.post}`,
  posts: `/${ADMIN_PATH.posts}`,
  newPost: `/${ADMIN_PATH.post}/${ADMIN_PATH.newPost}`,
} as const;
