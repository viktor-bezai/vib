"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Container, Typography } from "@mui/material";
import VideoSearchBar from "../components/Video/VideoSearchBar";
import VideoPlayer from "../components/Video/VideoPlayer";


export interface Video {
  id: number;
  word: string;
  language: string;
  timestamped_url: string;
  video: number;
}

const fetchVideos = async (word: string): Promise<Video[]> => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/youtube/?word=${word}`);

  // If fewer than 10 videos exist, trigger a post request to add more
  if (response.data.length < 5) {
    await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/youtube/`, { word });

    // Wait a moment for the backend to process new videos (optional)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Fetch videos again after adding new ones
    const newResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/youtube/?word=${word}`);
    return newResponse.data;
  }

  return response.data;
};


export default function VideoPage() {
  const [word, setWord] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data, isLoading, isError } = useQuery<Video[]>({
    queryKey: ["videos", word],
    queryFn: () => fetchVideos(word),
    enabled: !!word,
  });

  const handleSearch = (newWord: string) => {
    setWord(newWord);
    setCurrentIndex(0);
  };

  const handleNext = () => {
    if (data && currentIndex < data.length - 1) setCurrentIndex((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  return (
    <Container sx={{ marginTop: "2rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <VideoSearchBar onSearch={handleSearch} />

      {isLoading && <Typography>Loading...</Typography>}
      {isError && <Typography color="error">Failed to fetch videos.</Typography>}

      {data && data.length > 0 && (
        <VideoPlayer
          video={data[currentIndex]}
          currentIndex={currentIndex}
          total={data.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      )}
    </Container>
  );
}
