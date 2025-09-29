# Tennis Courts Full Stack Setup Guide

This guide will help you set up and run both the React frontend and Node.js backend for the Tennis Courts application.

## Prerequisites

Before starting, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas) (cloud)
- **Git** (optional, for version control)

## Project Structure

```
frontend-challenge/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── types/          # TypeScript types
│   │   ├── database/       # Database connection
│   │   └── scripts/        # Utility scripts
│   ├── package.json
│   └── README.md
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── services/          # API service
│   ├── types/             # TypeScript types
│   └── ...
├── package.json
└── README.md
```

## Setup Instructions

### Step 1: Backend Setup

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up MongoDB:**

   **Option A: Local MongoDB**

   - Install MongoDB locally
   - Start MongoDB service
   - Default connection string: `mongodb://localhost:27017/tennis-courts`

   **Option B: MongoDB Atlas (Cloud)**

   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get your connection string
   - Replace the default URI in the config

4. **Create environment file:**
   Create a `.env` file in the backend directory:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/tennis-courts
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

5. **Populate the database:**

   ```bash
   npm run migrate
   ```

   This will create sample tennis court data in your database.

6. **Start the backend server:**
   ```bash
   npm run dev
   ```
   The backend will be running on `http://localhost:5000`

### Step 2: Frontend Setup

1. **Navigate to the frontend directory (root of the project):**

   ```bash
   cd ..  # Go back to the root directory
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the frontend development server:**
   ```bash
   npm run dev
   ```
   The frontend will be running on `http://localhost:5173` (or another port if 5173 is busy)

## Running the Application

### Development Mode

1. **Start the backend** (in one terminal):

   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend** (in another terminal):

   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:5173`

### Production Mode

1. **Build the backend:**

   ```bash
   cd backend
   npm run build
   npm start
   ```

2. **Build the frontend:**
   ```bash
   npm run build
   npm run preview
   ```

## API Endpoints

The backend provides the following API endpoints:

### Courts

- `GET /api/courts` - Get all courts
- `GET /api/courts/:id` - Get court by ID
- `POST /api/courts` - Create new court
- `PUT /api/courts/:id` - Update court
- `DELETE /api/courts/:id` - Delete court

### Reviews

- `POST /api/courts/:courtId/reviews` - Add review to court
- `GET /api/courts/:courtId/reviews` - Get all reviews for a court
- `PUT /api/reviews/:reviewId` - Update review
- `DELETE /api/reviews/:reviewId` - Delete review

### Health Check

- `GET /api/health` - Check API health status

## Testing the Integration

1. **Check backend health:**
   Visit `http://localhost:5000/api/health` in your browser

2. **Test API endpoints:**

   ```bash
   # Get all courts
   curl http://localhost:5000/api/courts

   # Get court by ID
   curl http://localhost:5000/api/courts/1
   ```

3. **Test frontend:**
   - Open `http://localhost:5173`
   - You should see the tennis courts loaded from the backend
   - Try searching and filtering
   - Click on a court to view details
   - Try adding a review

## Troubleshooting

### Common Issues

1. **Backend not starting:**

   - Check if MongoDB is running
   - Verify the MongoDB connection string in `.env`
   - Check if port 5000 is available

2. **Frontend not loading courts:**

   - Ensure the backend is running on port 5000
   - Check browser console for CORS errors
   - Verify the API service URL in `src/services/api.ts`

3. **Database connection issues:**

   - For local MongoDB: ensure the service is running
   - For MongoDB Atlas: check your connection string and network access settings

4. **Port conflicts:**
   - Backend: change `PORT` in `.env` file
   - Frontend: Vite will automatically use the next available port

### Logs and Debugging

- **Backend logs:** Check the terminal where you ran `npm run dev`
- **Frontend logs:** Check browser developer console
- **Database logs:** Check MongoDB logs

## Features

### Frontend Features

- ✅ Responsive design (mobile-friendly)
- ✅ Search functionality
- ✅ Filter by surface type and rating
- ✅ Court detail view
- ✅ Review submission
- ✅ Loading states and error handling
- ✅ Local storage for search/filter persistence

### Backend Features

- ✅ RESTful API design
- ✅ MongoDB database with Mongoose
- ✅ TypeScript for type safety
- ✅ CORS configuration
- ✅ Error handling middleware
- ✅ Data validation
- ✅ Search and filtering
- ✅ Review management with automatic rating calculation

## Next Steps

To extend the application, you could add:

1. **Authentication & Authorization**

   - User registration/login
   - Protected routes
   - User-specific reviews

2. **Advanced Features**

   - Court booking system
   - Payment integration
   - Image uploads
   - Real-time notifications

3. **Performance Improvements**

   - Caching (Redis)
   - Database indexing
   - API rate limiting
   - Image optimization

4. **Deployment**
   - Docker containerization
   - CI/CD pipeline
   - Cloud deployment (AWS, Vercel, etc.)

## Support

If you encounter any issues:

1. Check the console logs for error messages
2. Verify all prerequisites are installed
3. Ensure both frontend and backend are running
4. Check the MongoDB connection
5. Review the API endpoints and responses

For additional help, refer to the individual README files in the `backend/` directory.
