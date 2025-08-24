import { ColumnName, RowOf, TableName } from '../../models/supabase/helpers';

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

  constructor(private readonly table: T) {}

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
