import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const fetchVideos = async (word: string) => {
  if (!word.trim()) return []; // Prevent empty requests

  try {
    console.log("Fetching word:", encodeURIComponent(word));

    const response = await axios.get(`${BASE_URL}/youtube/?word=${encodeURIComponent(word)}`);

    // If fewer than 5 videos exist, trigger a post request to add more
    if (response.data.length < 5) {
      await axios.post(`${BASE_URL}/youtube/`, { word });

      // Wait for the backend to process new videos
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Fetch videos again after adding new ones
      const newResponse = await axios.get(`${BASE_URL}/youtube/?word=${encodeURIComponent(word)}`);
      return newResponse.data;
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        const errorMessage = `Oops! Looks like we've reached the word limit for today.
                But don't worry! You can try a different word,
                and if it's already in the searched videos,
                it'll still work for you. Give it a shot!`
        throw new Error(errorMessage);
      }
    }
    throw new Error("Uh-oh! We couldn't fetch the videos this time. Please try again in a bit!");
  }
};
