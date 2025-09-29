#!/bin/bash

# Tennis Courts Full Stack Development Startup Script

echo "🏓 Starting Tennis Courts Full Stack Application..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running (for local installations)
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB doesn't appear to be running."
    echo "   Please start MongoDB or use MongoDB Atlas."
    echo ""
fi

echo "📦 Installing backend dependencies..."
cd backend
npm install

echo ""
echo "📦 Installing frontend dependencies..."
cd ..
npm install

echo ""
echo "🗄️  Setting up database..."
cd backend
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tennis-courts
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
EOF
    echo "✅ Created .env file. Please update MONGODB_URI if using MongoDB Atlas."
fi

echo ""
echo "🔄 Migrating sample data..."
npm run migrate

echo ""
echo "🚀 Starting backend server..."
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

echo ""
echo "🌐 Starting frontend server..."
cd ..
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers are starting up!"
echo ""
echo "📍 Backend API: http://localhost:5000"
echo "📍 Frontend App: http://localhost:5173"
echo "📍 API Health Check: http://localhost:5000/api/health"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped."
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait
