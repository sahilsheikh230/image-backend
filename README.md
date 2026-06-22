# PixelForge

A full-stack image processing and PDF conversion platform that allows users to upload, edit, transform, store, and convert files through a simple web interface.

## Features

### Image Management

* Upload images securely to AWS S3
* Store image metadata in MongoDB
* View uploaded images
* Download processed images

### Image Editing

* Crop images
* Resize images
* Rotate images
* Adjust brightness
* Adjust saturation
* Real-time image preview
* Multiple image transformations

### PDF & Document Conversion

* JPG to PDF
* Word to PDF
* PPT to PDF
* HTML to PDF
* PDF to JPG
* PDF to Word
* PDF to PPT

### Authentication

* User registration
* User login
* JWT authentication
* Secure HTTP-only cookies
* Protected routes

## Tech Stack

### Frontend

* React.js
* React Router DOM
* Bootstrap
* Axios

### Backend

* Node.js
* Express.js
* JWT
* Multer

### Database

* MongoDB Atlas
* Mongoose

### Cloud Storage

* AWS S3

### Image Processing

* Sharp
* GraphicsMagick
* Ghostscript

### Document Processing

* PDF-Lib
* Puppeteer
* LibreOffice
* PDF2Pic
* Archiver

### Deployment

* Netlify (Frontend)
* Railway (Backend)

## Project Architecture

User → React Frontend → Express Backend → AWS S3 / MongoDB

The frontend handles user interactions and image editing controls. The backend processes images, manages authentication, performs document conversions, and stores files in AWS S3.

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd pixelforge
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
AWS_BUCKET_NAME=your_bucket_name

CLIENT_URL=http://localhost:5173
```

Start Backend:

```bash
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Deployment

### Frontend

Deploy using Netlify or Vercel.

### Backend

Deploy using Railway with Docker support.

Required system dependencies:

* LibreOffice
* GraphicsMagick
* Ghostscript

## Future Enhancements

* AI-powered image enhancement
* Background removal
* OCR support for scanned documents
* PDF compression
* PDF merging and splitting
* Batch file processing
* Drag and drop uploads
* Image filters and effects
* Conversion job queue system

## Learning Outcomes

This project helped me gain practical experience in:

* Full-Stack Web Development
* Cloud Storage Integration
* Image Processing Pipelines
* Document Conversion Systems
* Authentication & Authorization
* REST API Development
* Deployment & DevOps
* AWS S3 Integration
* MongoDB Database Design

## Author

Sahil Sheikh     project link:http://pixel1045.netlify.app

B.Tech CSE Student | Full Stack Developer
