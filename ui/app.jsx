import React, { useState, useEffect } from "react";
import VideoCard from "./VideoCard";
import { Stack } from "@mui/material";

const App = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchMetadata = async (year, month) => {
      const formattedMonth = month.toString().padStart(2, "0");
      const path = `/metadata/${year}/${formattedMonth}.json`;

      try {
        const response = await fetch(path);
        return response.json();
      } catch (error) {
        console.error(`Failed to fetch video metadata for ${year}-${formattedMonth}`, error);
        return [];
      }
    };

    fetchMetadata();
  }, []);

  return (
    <Stack>
      {videos.map((video) => (
        <VideoCard key={video.title} thumbnail={video.thumbnail} title={video.title} duration={video.duration} />
      ))}
    </Stack>
  );
};

export default App;
