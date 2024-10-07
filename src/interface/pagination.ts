
export interface PaginationResponse<T> {
    search: string;
    page: number;
    pageSize: number;
    total: number;
    data: T[];
}