import { Pagination } from "./common";

export interface TableColumn {
  name?: string;
  title?: string;
  type?: "copy" | "image" | "time" | "label" | "dropdown" | "user";
  placeholder?: string;
  metadata?: any;
  className?: string;
  callback?: (item: any) => any;
}

export interface Table {
  title?: string;
  columns: TableColumn[];
  data: any[];
  pagination?: Pagination;
  actions?: Button[];
}
