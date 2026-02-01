// Base model interfaces and types

export interface BaseModel {
  id: number;
  created_at: Date;
  updated_at: Date;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function createPaginatedResult<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number
): PaginatedResult<T> {
  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export function parsePagination(
  page?: string | number,
  pageSize?: string | number
): PaginationParams {
  const p = typeof page === 'string' ? parseInt(page, 10) : page;
  const ps = typeof pageSize === 'string' ? parseInt(pageSize, 10) : pageSize;

  return {
    page: Math.max(1, p || 1),
    pageSize: Math.min(100, Math.max(1, ps || 10)),
  };
}

export function parseSort(
  sortBy?: string,
  sortOrder?: string,
  allowedFields: string[] = ['created_at']
): SortParams {
  const validSortOrder = sortOrder?.toLowerCase() === 'asc' ? 'asc' : 'desc';
  const validSortBy = sortBy && allowedFields.includes(sortBy) ? sortBy : allowedFields[0];

  return {
    sortBy: validSortBy,
    sortOrder: validSortOrder,
  };
}
