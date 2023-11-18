import type { SerializedComment } from "server";

export interface FetcherError {
  message: string;
}

export async function fetcher<T = void>(
  url: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(url, init);

  if (!response.ok) {
    const message = await response.text();
    let err: Error = new Error(message);

    try {
      const obj = JSON.parse(message) as object;

      if ("message" in obj && typeof obj.message === "string") {
        err = new Error(obj.message);
      }
    } catch (e) {
      /* empty */
    }

    throw err;
  }

  return (await response.json()) as T;
}

export function getCommentsKey(
  thread?: number | null,
  page?: string | null
): [api: string, thread: number | undefined, page: string | undefined] {
  return ["/api/comments", thread ?? undefined, page ?? undefined];
}

export function fetchComments({
  page,
  thread,
  sort,
}: Partial<{
  thread: number;
  page: string;
  sort: "newest" | "oldest";
}>): Promise<SerializedComment[]> {
  const params = new URLSearchParams();
  if (page) params.append("page", page);
  if (thread) params.append("thread", thread.toString());
  if (sort) params.append("sort", sort);

  return fetcher(`/api/comments?${params.toString()}`);
}
