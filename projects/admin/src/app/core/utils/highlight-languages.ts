import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
import typescript from 'highlight.js/lib/languages/typescript';
import javascript from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import sql from 'highlight.js/lib/languages/sql';
import yaml from 'highlight.js/lib/languages/yaml';
import plaintext from 'highlight.js/lib/languages/plaintext';

const LANGUAGES = [
  { key: 'xml', label: 'XML', module: xml },
  { key: 'typescript', label: 'TypeScript', module: typescript },
  { key: 'javascript', label: 'JavaScript', module: javascript },
  { key: 'css', label: 'CSS', module: css },
  { key: 'sql', label: 'SQL', module: sql },
  { key: 'yaml', label: 'YAML', module: yaml },
  { key: 'plaintext', label: 'Plain Text', module: plaintext },
] as const;

export const HIGHLIGHT_LANGUAGES = LANGUAGES.map(({ key, label }) => ({ key, label }));

export function registerHighlightLanguages(): void {
  LANGUAGES.forEach(({ key, module }) => hljs.registerLanguage(key, module));
}
