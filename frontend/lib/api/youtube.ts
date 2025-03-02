import {VideoInterface} from "@/app/video/page";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * Retrieves the CSRF token from cookies.
 */
const getCSRFToken = (): string | null => {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken="));

  if (!cookie) return null; // Explicitly handle the case where cookie is undefined

  const tokenParts = cookie.split("=");
  return tokenParts.length > 1 ? tokenParts[1] : null;
};


/**
 * Fetches data from the given endpoint.
 */
const fetchData = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(url, {...options, credentials: "include"});

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error(
        "Looks like we've reached the word limit in YouTube for today. " +
        "But don't worry! You can try a different word, and if it's already in the searched videos, " +
        "it'll still work for you. Give it a shot!"
    )
      ;
    }
    throw new Error("We couldn't fetch the videos this time. Please try again in a bit!");
  }

  return response.json();
};


/**
 * Fetches YouTube videos and triggers video generation if needed.
 */
export const fetchVideos = async (word: string): Promise<VideoInterface[]> => {
  if (!word.trim()) return [];

  try {
    console.info("Fetching videos for:", word);

    // Ensure CSRF token is set before making POST requests
    await fetchData<void>(`${BASE_URL}/get-csrf-token/`);

    // Initial fetch request
    let videos = await fetchData<VideoInterface[]>(`${BASE_URL}/youtube/?word=${encodeURIComponent(word)}`);

    // If fewer than 5 videos exist, request backend to generate more
    if (videos.length < 5) {
      const csrftoken = getCSRFToken();

      if (!csrftoken) {
        console.warn("CSRF token is missing. The POST request may fail.");
      }

      await fetchData<void>(`${BASE_URL}/youtube/`, {
        method: "POST",
        headers: {
          "X-CSRFToken": csrftoken || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({word}),
      });

      // Wait for the backend to process new videos
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Fetch videos again after adding new ones
      videos = await fetchData<VideoInterface[]>(`${BASE_URL}/youtube/?word=${encodeURIComponent(word)}`);
    }

    return videos;
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw error;
  }
};