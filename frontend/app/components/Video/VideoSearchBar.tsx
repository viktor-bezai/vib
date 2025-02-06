"use client";

import React, { useState } from "react";
import { Button, Grid, TextField } from "@mui/material";

interface VideoSearchBarProps {
  onSearch: (word: string) => void;
}

const VideoSearchBar: React.FC<VideoSearchBarProps> = ({ onSearch }) => {
  const [searchWord, setSearchWord] = useState("");
  const [error, setError] = useState("");

  const validateInput = (value: string) => {
    const words = value.trim().split(/\s+/);
    if (words.length > 2) {
      setError("Please enter a maximum of two words.");
    } else {
      setError("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchWord(value);
    validateInput(value);
  };

  const handleSearch = () => {
    if (!error && searchWord.trim()) {
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
        width: {xs: "100%", md:"60%"},
        backgroundColor: "#f5f5f5",
        padding: "10px",
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Grid item xs={12} sm={9}>
        <TextField
          fullWidth
          label="Enter a word"
          variant="outlined"
          value={searchWord}
          onChange={handleChange}
          error={!!error}
          helperText={error}
          sx={{
            backgroundColor: "white",
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: error ? "red" : "#ccc" },
              "&:hover fieldset": { borderColor: error ? "red" : "#888" },
              "&.Mui-focused fieldset": { borderColor: error ? "red" : "#1976d2" },
            },
          }}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSearch}
          disabled={!searchWord.trim() || !!error}
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
  );
};

export default VideoSearchBar;
