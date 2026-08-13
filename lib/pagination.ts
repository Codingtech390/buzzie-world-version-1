import { APP_CONSTANTS } from "@/lib/constants";

interface PaginationInput {
  page?: number | string;
  limit?: number | string;
}

export function getPagination({
  page = APP_CONSTANTS.pagination.defaultPage,
  limit = APP_CONSTANTS.pagination.defaultLimit,
}: PaginationInput = {}) {
  const parsedPage = Math.max(Number(page) || 1, 1);

  const parsedLimit = Math.min(
    Math.max(Number(limit) || APP_CONSTANTS.pagination.defaultLimit, 1),
    APP_CONSTANTS.pagination.maxLimit,
  );

  const skip = (parsedPage - 1) * parsedLimit;

  return {
    page: parsedPage,
    limit: parsedLimit,
    skip,
  };
}

export function getPaginationMeta(page: number, limit: number, total: number) {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}
