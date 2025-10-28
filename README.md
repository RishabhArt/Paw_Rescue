
# Project Title

PawRescue – Animal Rescue & Adoption Platform

PawRescue is a full-stack, open-source platform that connects individuals, NGOs, and shelters to report, rescue, and adopt animals in need. It includes real-time reporting with geolocation, adoption listings, chat between rescuers and NGOs, and a dashboard to manage reports and adoptions seamlessly.


## Live Demo

https://paw-rescue-three.vercel.app/

## Features

✅ Real-time animal rescue reporting with map location

✅ Live chat between rescuer and NGOs using Socket.IO

✅ Adoption listings with filters and contact forms

✅ NGO dashboard to manage reports, verify cases, and mark resolved

✅ Cloudinary image uploads for rescued animals

✅ Push/email notifications for new reports and adoptions

✅ Dark/light mode with smooth animations

✅ Secure authentication with JWT

✅ Responsive UI for mobile and desktop


## Installation Steps

1️⃣ Clone Repository
git clone https://github.com/RishabhArt/Paw_Rescue.git
cd Paw_Rescue

2️⃣ Setup Backend
cd server
npm install
cp .env.example .env
npm run dev


Default dev server: http://localhost:5000

3️⃣ Setup Frontend
cd ../client
npm install
npm run dev


Frontend URL: http://localhost:5173

4️⃣ Run with Docker (optional)
docker-compose up --build

## Deployment

https://paw-rescue-three.vercel.app/


## Tech Stack

🌐 Frontend

React + Vite + TypeScript

React Router v6

Zustand (state) + React Query (server state)

Tailwind CSS + shadcn/ui + Framer Motion

React Hook Form + Zod

Mapbox GL JS (or Leaflet + OpenStreetMap)

Axios

⚙️ Backend

Node.js + Express + TypeScript

MongoDB + Mongoose (2dsphere geospatial indexes)

Socket.IO (real-time communication)

Multer → Cloudinary (for uploads)

Nodemailer (email) + Web Push (VAPID)

Winston logging + Zod validation

🧪 DevOps & Testing

Docker (multi-stage build) + docker-compose

ESLint + Prettier + Husky + lint-staged

GitHub Actions (CI/CD)

Jest + React Testing Library (frontend)

Jest + Supertest (backend)



