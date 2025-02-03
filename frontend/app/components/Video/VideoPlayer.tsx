"use client";

import React from "react";
import { Card, CardMedia, CardContent, Typography, Grid, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import convertToEmbedUrl from "@/utils/convertToEmbedUrl";
import {Video} from "@/app/video/page";

interface VideoPlayerProps {
  video: Video;
  currentIndex: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, currentIndex, total, onPrevious, onNext }) => {
  return (
    <Card sx={{ marginBottom: "2rem", padding: "1rem", textAlign: "center", width: "80%" }}>
      <Typography variant="h5" sx={{ marginBottom: "1rem" }}>
        Now Playing: {video.word}
      </Typography>
      <CardMedia
        component="iframe"
        src={convertToEmbedUrl(video.timestamped_url)}
        title={`Video ${video.id}`}
        sx={{ height: 500, borderRadius: "8px" }}
      />
      <CardContent>
        <Typography variant="h6">Language: {video.language}</Typography>
        <Grid container justifyContent="space-between" alignItems="center" sx={{ marginTop: "1rem" }}>
          <IconButton onClick={onPrevious} disabled={currentIndex === 0}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="body2">{currentIndex + 1} / {total}</Typography>
          <IconButton onClick={onNext} disabled={currentIndex === total - 1}>
            <ArrowForwardIcon />
          </IconButton>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;
