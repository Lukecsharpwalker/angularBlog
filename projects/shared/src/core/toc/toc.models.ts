// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type TableOfContentsElement = {
  content: string;
  header: number;
  id: string;
};

export type TableOfContents = Record<string, TableOfContentsElement>;
