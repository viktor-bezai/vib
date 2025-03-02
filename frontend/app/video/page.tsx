"use client";

import React, {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {Container} from "@mui/material";
import {fetchVideos} from "@/lib/api/youtube";
import VideoSearchBar from "../components/Video/VideoSearchBar";
import VideoPlayer from "../components/Video/VideoPlayer";
import LoadingMessage from "@/app/components/Video/LoadingMessage";
import ErrorMessage from "@/app/components/Video/ErrorMessage";

export interface VideoInterface {
  id: number;
  word: string;
  language: string;
  timestamped_url: string;
  video: number;
}


export default function VideoPage() {
  const [word, setWord] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const {data, isLoading, error, refetch} = useQuery<VideoInterface[]>({
    queryKey: ["videos", word],
    queryFn: () => fetchVideos(word),
    enabled: word.trim().length > 0,
    retry: false,
  });

  const handleSearch = (newWord: string) => {
    if (!newWord.trim()) return;
    setWord(newWord);
    setCurrentIndex(0);
    refetch();
  };

  const handleNext = () => {
    if (data && Array.isArray(data) && currentIndex < data.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (data && Array.isArray(data) && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <Container sx={{marginTop: "2rem", display: "flex", flexDirection: "column", alignItems: "center"}}>
      <VideoSearchBar onSearch={handleSearch} isLoading={isLoading}/>

      {isLoading && <LoadingMessage/>}
      {error && <ErrorMessage message={error.message}/>}

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
