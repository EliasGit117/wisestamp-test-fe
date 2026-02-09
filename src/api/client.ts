import ky from 'ky';

export interface IApiError {
  error: string;
  message: string;
  statusCode: number;
}

export function isApiError(value: unknown): value is IApiError {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.error === "string" &&
    typeof record.message === "string" &&
    typeof record.statusCode === "number"
  );
}

export function normalizeError(error: unknown | undefined | null) {
  const res = new Error('Something went wrong');
  if (error == null)
    return res;

  if (isApiError(error)) {
    res.name = error.error;
    res.message = error.message;
  }

  return res;
}


export const apiClient =  ky.create({
  prefixUrl: import.meta.env.API_URL ?? "http://localhost:3000",
  credentials: 'include'
});