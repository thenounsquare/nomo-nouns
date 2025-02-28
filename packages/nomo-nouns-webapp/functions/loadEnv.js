const fs = require('fs');
const path = require('path');

function loadEnvironment() {
  // Check if we're on Vercel
  if (process.env.VERCEL) {
    // Vercel already has environment variables set
    return;
  }
  
  // For local development, load from .env.sepolia
  const envPath = path.resolve(__dirname, '.env.sepolia');
  
  if (fs.existsSync(envPath)) {
    const envConfig = require('dotenv').parse(fs.readFileSync(envPath));
    
    // Set environment variables
    for (const key in envConfig) {
      process.env[key] = envConfig[key];
    }
  }
}

module.exports = { loadEnvironment };
