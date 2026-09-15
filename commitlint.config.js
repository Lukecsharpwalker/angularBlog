module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', ['web', 'admin', 'mfe', 'shared', 'config', 'supabase', 'e2e']],
    'scope-empty': [2, 'never'],
  },
};
