const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");
const ffmpeg = require("fluent-ffmpeg");
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();

const app = express();
const PORT = process.env.PORT;

const config = {
  aws: {
    bucket: process.env.AWS_BUCKET_NAME,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_S3_REGION,
  },
};
if (!config.aws.bucket || !config.aws.accessKeyId || !config.aws.secretAccessKey || !config.aws.region) {
  console.error("AWS configuration is required");
  process.exit(1);
}

const s3 = new AWS.S3({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  region: config.aws.region,
});

const upload = multer({ dest: "uploads/" });
const getVideoDurationInSeconds = (filePath) => {
  return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
          if (err) {
              reject(err);
              return;
          }
          resolve(metadata.format.duration);
      });
  });
};

app.post("/upload", upload.single("video"), async (req, res) => {
  const { title, tags, thumbnail } = req.body;

  let mp4Output = `processing/${req.file.filename}.mp4`;
  let webmOutput = `processing/${req.file.filename}.webm`;

  const convertToFormat = (input, output, format) => {
    return new Promise((resolve, reject) => {
      ffmpeg(input).output(output).toFormat(format).on("end", resolve).on("error", reject).run();
    });
  };

  const uploadToS3 = (filePath, mimetype) => {
    const fileContent = fs.readFileSync(filePath);
    const params = {
      Bucket: config.aws.bucket,
      Key: filePath,
      Body: fileContent,
      ContentType: mimetype,
    };

    return s3.upload(params).promise();
  };

  try {
    // Convert to MP4
    await convertToFormat(req.file.path, mp4Output, "mp4");
    // Convert to webm
    await convertToFormat(req.file.path, webmOutput, "webm");
    const duration = await getVideoDurationInSeconds(req.file.path);

    const [mp4UploadResult, webmUploadResult] = await Promise.all([uploadToS3(mp4Output, "video/mp4"), uploadToS3(webmOutput, "video/webm")]);

    const mp4Url = mp4UploadResult.Location;
    const webmUrl = webmUploadResult.Location;



    const video = {
      title,
      tags: tags.split(","),
      thumbnail,
      mp4Url,
      webmUrl,
      duration,
      size: req.file.size,
    };

    try {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Convert 1 to 01, 9 to 09, etc.

      const metadataKey = `metadata/${year}/${month}.json`;

      // Attempt to fetch the current month's videos.json from S3
      let metadata;
      try {
        const s3Response = await s3
          .getObject({
            Bucket: config.aws.bucket,
            Key: metadataKey,
          })
          .promise();

        metadata = JSON.parse(s3Response.Body.toString());
      } catch (err) {
        // If the file doesn't exist, initialize a new array
        metadata = [];
      }

      // Add the new video's data
      metadata.push({ ...video, uploadDate: new Date().toISOString() });

      // Save updated metadata back to S3
      await s3
        .putObject({
          Bucket: config.aws.bucket,
          Key: metadataKey,
          Body: JSON.stringify(metadata),
          ContentType: "application/json",
        })
        .promise();

      res.status(200).send({ message: "Video uploaded successfully!" });
    } catch (error) {
      res.status(500).send({ message: "Error processing video", error });
    }
    res.status(200).send(savedVideo);
  } catch (error) {
    res.status(500).send({ message: "Error processing video", error });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
