import React from "react";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import { Box } from "@mui/system";

const VideoCard = ({ thumbnail, title, duration }) => {
  return (
    <Card sx={{ position: "relative", maxWidth: 345 }}>
      <CardMedia component="img" alt={title} height="140" image={thumbnail} />
      <CardContent>
        <Typography
          variant="h6"
          component="div"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bgcolor: "rgba(0,0,0,0.5)",
            color: "white",
            fontSize: "0.8rem",
            p: "0.5rem",
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            bgcolor: "rgba(0,0,0,0.5)",
            color: "white",
            p: "0.5rem",
          }}
        >
          {duration}
        </Box>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
