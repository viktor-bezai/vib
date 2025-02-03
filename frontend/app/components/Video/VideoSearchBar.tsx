"use client";

import React, { useState } from "react";
import { Grid, TextField, Button } from "@mui/material";

interface VideoSearchBarProps {
  onSearch: (word: string) => void;
}

const VideoSearchBar: React.FC<VideoSearchBarProps> = ({ onSearch }) => {
  const [searchWord, setSearchWord] = useState("");

  const handleSearch = () => {
    if (searchWord.trim()) {
      onSearch(searchWord);
    }
  };

  return (
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
              "& fieldset": { borderColor: "#ccc" },
              "&:hover fieldset": { borderColor: "#888" },
              "&.Mui-focused fieldset": { borderColor: "#1976d2" },
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
            "&:hover": { backgroundColor: "#1565c0", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)" },
          }}
        >
          Search
        </Button>
      </Grid>
    </Grid>
  );
};

export default VideoSearchBar;
