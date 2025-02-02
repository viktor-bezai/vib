"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const fetchVideos = async (word: string) => {
  const response = await axios.get(`http://127.0.0.1:8000/api/v1/search/?word=${word}`);
  return response.data;
};

export default function VideoPage() {
  const [searchWord, setSearchWord] = useState<string>("");
  const [word, setWord] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current video index

  const { data, isLoading, isError } = useQuery({
    queryKey: ["videos", word],
    queryFn: () => fetchVideos(word),
    enabled: !!word, // Fetch only when `word` is not empty
  });

  const handleSearch = () => {
    setWord(searchWord);
    setCurrentIndex(0); // Reset to the first video when searching
  };

  const handleNext = () => {
    if (data && currentIndex < data.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <Container sx={{ marginTop: "2rem" }}>
      {/* Search Bar */}
      <Typography variant="h4" gutterBottom>
        Search for Videos
      </Typography>
      <Grid container spacing={2} alignItems="center" sx={{ marginBottom: "2rem" }}>
        <Grid item xs={9}>
          <TextField
            fullWidth
            label="Enter a word"
            variant="outlined"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSearch}
            disabled={!searchWord}
          >
            Search
          </Button>
        </Grid>
      </Grid>

      {/* Loading/Error State */}
      {isLoading && <Typography>Loading...</Typography>}
      {isError && <Typography color="error">Failed to fetch videos.</Typography>}

      {/* Show Selected Video */}
      {data && data.length > 0 && (
        <Card sx={{ marginBottom: "2rem", padding: "1rem", textAlign: "center" }}>
          <Typography variant="h5" sx={{ marginBottom: "1rem" }}>
            Now Playing: {data[currentIndex]?.word}
          </Typography>
          <CardMedia
            component="iframe"
            src={data[currentIndex]?.timestamped_url.replace("watch?v=", "embed/")}
            title={`Video ${data[currentIndex]?.id}`}
            sx={{ height: 400, borderRadius: "8px" }}
          />
          <CardContent>
            <Typography variant="h6">Language: {data[currentIndex]?.language}</Typography>
            <Grid container justifyContent="space-between" alignItems="center" sx={{ marginTop: "1rem" }}>
              <IconButton onClick={handlePrevious} disabled={currentIndex === 0}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="body2">
                {currentIndex + 1} / {data.length}
              </Typography>
              <IconButton onClick={handleNext} disabled={currentIndex === data.length - 1}>
                <ArrowForwardIcon />
              </IconButton>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Video Results in Grid */}
      <Grid container spacing={3}>
        {data?.map((video: any, index: number) => (
          <Grid item xs={12} sm={6} md={4} key={video.id}>
            <Card onClick={() => setCurrentIndex(index)} sx={{ cursor: "pointer", transition: "0.3s", "&:hover": { transform: "scale(1.05)" } }}>
              <CardMedia
                component="iframe"
                src={video.timestamped_url.replace("watch?v=", "embed/")}
                title={`Video ${video.id}`}
                sx={{ height: 200 }}
              />
              <CardContent>
                <Typography variant="h6">Language: {video.language}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Word: {video.word}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
