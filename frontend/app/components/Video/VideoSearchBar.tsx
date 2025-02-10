"use client";

import React, { useState } from "react";
import { Button, Grid, TextField } from "@mui/material";

interface VideoSearchBarProps {
  onSearch: (word: string) => void;
  isLoading: boolean;
}

const VideoSearchBar = ({ onSearch, isLoading }: VideoSearchBarProps) => {
  const [searchWord, setSearchWord] = useState<string>("");
  const [inputError, setInputError] = useState<string>("");

  const validateInput = (value: string) => {
    const words = value.trim().split(/\s+/);
    const isValidCharacters = /^[A-Za-z\s-]+$/.test(value);

    if (!isValidCharacters) {
      setInputError("Only English letters, spaces, or hyphens are allowed.");
    } else if (words.length > 2) {
      setInputError("Please enter a maximum of two words.");
    } else {
      setInputError("");
    }
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputWord = event.target.value;
    setSearchWord(inputWord);
    validateInput(inputWord);
  };

  return (
    <Grid
      container
      justifyContent="center"
      spacing={2}
      sx={{
        marginBottom: "2rem",
        width: { xs: "100%", md: "60%" },
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
          onChange={handleOnChange}
          error={!!inputError}
          helperText={inputError}
          sx={{
            backgroundColor: "white",
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: inputError ? "red" : "#ccc" },
              "&:hover fieldset": { borderColor: inputError ? "red" : "#888" },
              "&.Mui-focused fieldset": {
                borderColor: inputError ? "red" : "#1976d2",
              },
            },
          }}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => onSearch(searchWord)}
          disabled={!searchWord.trim() || !!inputError || isLoading}
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
