# FrostAI

An AI-powered content creation SaaS platform providing tools for article writing, blog title generation, image generation, background removal, object removal, and resume review.

## Features

| Feature | Description | Plan |
|---|---|---|
| **Article Writer** | Generate comprehensive articles with configurable length | Free (10 uses) |
| **Blog Title Generator** | Create SEO-friendly blog titles with category selection | Free (10 uses) |
| **Image Generator** | Generate images from text descriptions with style options | Premium |
| **Background Removal** | Remove backgrounds from uploaded images | Premium |
| **Object Removal** | Remove specified objects from uploaded images | Premium |
| **Resume Review** | Upload a PDF resume for AI-powered analysis | Premium |
| **Community** | Browse and like publicly shared creations | Premium |

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, React Router, Clerk (auth), Axios, React Hot Toast

**Backend:** Node.js, Express, Google Gemini (AI text), ClipDrop API (image generation), Cloudinary (image processing), Neon PostgreSQL, Clerk (auth), Multer (file uploads)

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Accounts: Clerk, Google AI Studio (Gemini), ClipDrop, Cloudinary, Neon

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/FROST-AI.git
cd FROST-AI

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Environment Variables

**Server** (`server/.env`):

```env
DATABASE_URL=your_neon_database_url
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
GEMINI_API_KEY=your_gemini_api_key
CLIPDROP_API_KEY=your_clipdrop_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Client** (`client/.env`):

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BASE_URL=http://localhost:3000
```

### Running Locally

```bash
# Start server (from server/ directory)
npm run server

# Start client (from client/ directory)
npm run dev
```

The client runs on `http://localhost:5173` and proxies API requests to the server on port 3000.

## Project Structure

```
FROST-AI/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route pages
│   │   ├── assets/            # Images, icons, data
│   │   ├── App.jsx            # Route definitions
│   │   └── main.jsx           # Entry point with ClerkProvider
│   └── vite.config.js
│
└── server/                    # Express backend
    ├── configs/               # DB, Cloudinary, Multer config
    ├── controllers/           # AI & user route handlers
    ├── middlewares/            # Auth middleware
    ├── routes/                # API route definitions
    └── server.js              # Express entry point
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/api/ai/generate-article` | Generate article (free: 10 uses) |
| `POST` | `/api/ai/generate-blog-title` | Generate blog titles (free: 10 uses) |
| `POST` | `/api/ai/generate-image` | Generate image (premium) |
| `POST` | `/api/ai/remove-image-background` | Remove image background (premium) |
| `POST` | `/api/ai/remove-image-object` | Remove object from image (premium) |
| `POST` | `/api/ai/resume-review` | Review PDF resume (premium) |
| `GET` | `/api/user/get-user-creations` | Get user's creations |
| `GET` | `/api/user/get-published-creations` | Get public creations |
| `POST` | `/api/user/toggle-like-creation` | Like/unlike a creation |

## Deployment

Both client and server are configured for Vercel deployment via `vercel.json` files in each directory.

## License

ISC
