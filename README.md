# Contact Manager - Digital Business Card Platform

A modern web application for creating and managing digital contact cards with phone number verification.

## backend/.env
```
  MONGODB_URI=mongodb://localhost:27017/contact-manager
  PORT=5000
  TWILIO_ACCOUNT_SID=your_account_sid
  TWILIO_AUTH_TOKEN=your_auth_token
  TWILIO_VERIFY_SERVICE_SID=your_verify_service_sid
```

## start server
```
  # Start backend server
  cd backend
  npm start

  # Start frontend development server
  cd frontend
  npm run dev
```