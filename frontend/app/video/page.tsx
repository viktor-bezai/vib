"use client";

import React, {useState} from "react";
import {useQuery} from "@tanstack/react-query";
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

interface Video {
  id: number;
  word: string;
  language: string;
  timestamped_url: string;
  video: number;
}

const fetchVideos = async (word: string): Promise<Video[]> => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/youtube/?word=${word}`);
  return response.data;
};

const convertToEmbedUrl = (url: string) => {
  if (!url) return "";

  const urlObj = new URL(url);
  const videoId = urlObj.searchParams.get("v");
  const timestamp = urlObj.searchParams.get("t");

  if (!videoId) return url;

  return `https://www.youtube.com/embed/${videoId}${timestamp ? `?start=${timestamp}` : ""}`;
};

export default function VideoPage() {
  const [searchWord, setSearchWord] = useState<string>("");
  const [word, setWord] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const {data, isLoading, isError} = useQuery<Video[]>({
    queryKey: ["videos", word],
    queryFn: () => fetchVideos(word),
    enabled: !!word,
  });

  const handleSearch = () => {
    setWord(searchWord);
    setCurrentIndex(0);
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
    <Container sx={{marginTop: "2rem", display: "flex", flexDirection: "column", alignItems: "center"}}>
      {/* Search Bar */}
      <Grid
        container
        justifyContent="center"
        spacing={2}
        sx={{
          marginBottom: "2rem",
          width: "60%",
          backgroundColor: "#f5f5f5",
          padding: "10px",
          borderRadius: "12px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Grid item xs={9}>
          <TextField
            fullWidth
            label="Enter a word"
            variant="outlined"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            sx={{
              backgroundColor: "white",
              borderRadius: "8px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ccc",
                },
                "&:hover fieldset": {
                  borderColor: "#888",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1976d2",
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSearch}
            disabled={!searchWord}
            sx={{
              height: "100%",
              borderRadius: "8px",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                backgroundColor: "#1565c0",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
              },
            }}
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
        <Card sx={{marginBottom: "2rem", padding: "1rem", textAlign: "center", width: "80%"}}>
          <Typography variant="h5" sx={{marginBottom: "1rem"}}>
            Now Playing: {data[currentIndex]?.word}
          </Typography>
          <CardMedia
            component="iframe"
            src={convertToEmbedUrl(data[currentIndex]?.timestamped_url)}
            title={`Video ${data[currentIndex]?.id}`}
            sx={{height: 500, borderRadius: "8px"}} // Increased height
          />
          <CardContent>
            <Typography variant="h6">Language: {data[currentIndex]?.language}</Typography>
            <Grid container justifyContent="space-between" alignItems="center" sx={{marginTop: "1rem"}}>
              <IconButton onClick={handlePrevious} disabled={currentIndex === 0}>
                <ArrowBackIcon/>
              </IconButton>
              <Typography variant="body2">
                {currentIndex + 1} / {data.length}
              </Typography>
              <IconButton onClick={handleNext} disabled={currentIndex === data.length - 1}>
                <ArrowForwardIcon/>
              </IconButton>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
