/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * Shoppe example
 * The shop API description
 * OpenAPI spec version: 1.0
 */
import type { ProductResponse } from './productResponse';
import type { ProductPagingResponsePagination } from './productPagingResponsePagination';

export interface ProductPagingResponse {
  products: ProductResponse[];
  pagination: ProductPagingResponsePagination;
}
