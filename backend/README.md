# Tennis Courts Backend API

A Node.js/Express backend API for the Tennis Courts application, built with TypeScript and MongoDB.

## Features

- RESTful API for tennis courts and reviews
- MongoDB database with Mongoose ODM
- TypeScript for type safety
- CORS enabled for frontend integration
- Error handling middleware
- Data validation
- Search and filtering capabilities

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:
   Create a `.env` file in the backend directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tennis-courts
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

3. Start MongoDB:
   Make sure MongoDB is running on your system. If using MongoDB Atlas, update the `MONGODB_URI` in your `.env` file.

## Running the Application

### Development Mode

```bash
npm run dev
```

This will start the server with nodemon for automatic restarts on file changes.

### Production Mode

```bash
npm run build
npm start
```

### Data Migration

To populate the database with sample tennis court data:

```bash
npm run migrate
```

## API Endpoints

### Courts

- `GET /api/courts` - Get all courts (with optional query parameters for search, surface, rating)
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

## Query Parameters

### GET /api/courts

- `search` - Search in name, location, or description
- `surface` - Filter by surface type (Hard, Clay, Grass)
- `rating` - Filter by minimum rating (number)

Example: `GET /api/courts?search=central&surface=Hard&rating=4`

## Database Schema

### TennisCourt

```typescript
{
  id: number;
  name: string;
  location: string;
  address: string;
  surface: 'Hard' | 'Clay' | 'Grass';
  price: string;
  hours: string;
  amenities: string[];
  rating: number;
  reviewCount: number;
  description: string;
  reviews: ObjectId[];
}
```

### Review

```typescript
{
  name: string;
  rating: number; // 1-5
  date: string;
  text: string;
}
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

## CORS Configuration

The API is configured to accept requests from:

- http://localhost:3000
- http://localhost:5173
- http://127.0.0.1:3000
- http://127.0.0.1:5173

## Development

### Project Structure

```
src/
├── controllers/     # Route controllers
├── models/         # Mongoose models
├── routes/         # Express routes
├── middleware/     # Custom middleware
├── types/          # TypeScript type definitions
├── database/       # Database connection
└── scripts/        # Utility scripts
```

### Adding New Features

1. Create/update models in `src/models/`
2. Add controllers in `src/controllers/`
3. Define routes in `src/routes/`
4. Update types in `src/types/`

## Testing

To test the API endpoints, you can use tools like:

- Postman
- curl
- Thunder Client (VS Code extension)

Example curl commands:

```bash
# Get all courts
curl http://localhost:5000/api/courts

# Get court by ID
curl http://localhost:5000/api/courts/1

# Add a review
curl -X POST http://localhost:5000/api/courts/1/reviews \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","rating":5,"text":"Great court!"}'
```

## Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use a secure `JWT_SECRET`
3. Configure MongoDB Atlas or production MongoDB instance
4. Set up proper CORS origins
5. Use a process manager like PM2
6. Set up reverse proxy (nginx)
7. Enable HTTPS

## License

ISC
