# Color Palette Generator

Extract dominant colors from images using computer vision algorithms.

## Tech Stack
- **Backend**: Go, Gin framework
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Image Processing**: K-means clustering algorithm
- **Deployment**: Railway (backend), Vercel (frontend)

## Features
- Real-time color extraction
- RGB and HEX color codes
- Responsive design
- One-click color copying

## Live Demo
[https://color-palette-generator-go-next.vercel.app/]

## Local Development
Local Development
1. Clone the repository
git clone https://github.com/lykemike/color-palette-generator-go-next.git
cd color-palette-generator-go-next

2. Backend Setup (Go + Gin)
cd color-palette-api-go
go mod tidy
go run main.go

Backend runs at:
http://localhost:8080

3. Frontend Setup (Next.js)
cd color-palette-frontend
npm install
npm run dev

Frontend runs at:
http://localhost:3000

4. Environment Variable
Create a file:
color-palette-frontend/.env.local

Add:
NEXT_PUBLIC_API_URL=http://localhost:8080
Production Deployment
Backend → Railway
Frontend → Vercel

On Vercel, set:
NEXT_PUBLIC_API_URL=https://<your-railway-domain>
