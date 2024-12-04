#!/bin/bash

# Add Node.js and npm to PATH
export PATH="/opt/homebrew/bin:$PATH"
export PATH="/opt/homebrew/opt/node/bin:$PATH"

# Install create-react-app globally
npm install -g create-react-app

# Create React frontend
create-react-app frontend

# Install backend dependencies
cd backend
npm install express mongoose bcryptjs jsonwebtoken socket.io cors dotenv

# Install frontend dependencies
cd ../frontend
npm install @material-ui/core @material-ui/icons axios socket.io-client react-router-dom

# Return to root directory
cd ..
