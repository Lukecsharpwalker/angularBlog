export interface TableOfContents {
  id?: string;
  title: string;
  level: number;
  children: TableOfContents[];
}
