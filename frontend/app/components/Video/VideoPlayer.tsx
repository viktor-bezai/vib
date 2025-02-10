"use client";

import React from "react";
import {Box, Card, CardContent, Grid, IconButton, Typography} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import convertToEmbedUrl from "@/utils/convertToEmbedUrl";
import {VideoInterface} from "@/app/video/page";

interface VideoPlayerInterface {
  video: VideoInterface;
  currentIndex: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
}

const VideoPlayer: React.FC<VideoPlayerInterface> = ({video, currentIndex, total, onPrevious, onNext}) => {
  return (
    <Card sx={{
      marginBottom: "2rem",
      padding: {xs: "0", sm: "1rem"},
      textAlign: "center",
      width: {xs: "100%", sm: "90%"},
      maxWidth: "900px"
    }}>
      {/* Responsive Video Container */}
      <Box sx={{position: "relative", width: "100%", paddingTop: "56.25%"}}>
        {/* 16:9 Aspect Ratio (Height = Width * 9 / 16) */}
        <Box
          component="iframe"
          src={convertToEmbedUrl(video.timestamped_url)}
          title={`Video ${video.id}`}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "8px",
            border: "none",
          }}
        />
      </Box>

      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center" sx={{marginTop: "1rem"}}>
          <IconButton onClick={onPrevious} disabled={currentIndex === 0}>
            <ArrowBackIcon/>
          </IconButton>
          <Typography variant="body2">{currentIndex + 1} / {total}</Typography>
          <IconButton onClick={onNext} disabled={currentIndex === total - 1}>
            <ArrowForwardIcon/>
          </IconButton>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;
