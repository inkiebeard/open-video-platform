# Open Video Platform
Use this repository to build your own video sharing site. Simple file upload and processing with FFmpeg and saved in AWS S3. The main difference between this and all other platforms, the listing and retrieval of videos can be done with no backend server and solely provided by static serving such as [AWS S3 Static Website](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html) or CDN. This is achieved by saving the meta data about videos such as title, description, tags, etc. in a JSON file in the same directory as the video file. This allows for the listing of videos and their meta data without the need for a backend server. 

A basic React frontend is also provided. __NOTE: This is a work in progress and is not yet ready for production use__.

# Stack
The Open Video Platform is built using:

### Backend - Video Upload, Processing & Save to AWS S3
* [Express](https://expressjs.com/)
* [Node](https://nodejs.org/en/)
* [AWS S3](https://aws.amazon.com/s3/)

### Frontend
* [React](https://facebook.github.io/react/)
* [MUI Core](http://getbootstrap.com/)

## Licence
The Open Video Platform is licensed under the [MIT License](https://opensource.org/licenses/MIT) and is provided as is with no warranty or guarantee.


## Roadmap
* [x] Basic video upload, processing and save to AWS S3
* [x] Basic React frontend
* [ ] Add schema validation for endpoints
* [ ] Add tests
* [ ] Add user authentication
* [ ] Async Uploads & processing via queue
