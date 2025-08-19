import { Database } from './database';

type Tables = Database['public']['Tables'];

export type TableName = keyof Tables;

export type RowOf<T extends TableName> = Database['public']['Tables'][T]['Row'];

export type ColumnName<T extends TableName> = keyof RowOf<T>;
