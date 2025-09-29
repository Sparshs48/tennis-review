@echo off
echo 🏓 Starting Tennis Courts Full Stack Application...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo 📦 Installing backend dependencies...
cd backend
call npm install

echo.
echo 📦 Installing frontend dependencies...
cd ..
call npm install

echo.
echo 🗄️  Setting up database...
cd backend
if not exist .env (
    echo Creating .env file...
    (
        echo PORT=5000
        echo MONGODB_URI=mongodb://localhost:27017/tennis-courts
        echo NODE_ENV=development
        echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
    ) > .env
    echo ✅ Created .env file. Please update MONGODB_URI if using MongoDB Atlas.
)

echo.
echo 🔄 Migrating sample data...
call npm run migrate

echo.
echo 🚀 Starting backend server...
start "Backend Server" cmd /k "npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

echo.
echo 🌐 Starting frontend server...
cd ..
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ✅ Both servers are starting up!
echo.
echo 📍 Backend API: http://localhost:5000
echo 📍 Frontend App: http://localhost:5173
echo 📍 API Health Check: http://localhost:5000/api/health
echo.
echo Press any key to exit...
pause >nul
