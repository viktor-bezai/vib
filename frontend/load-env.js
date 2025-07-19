const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Load parent .env file
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
  console.log('✅ Loaded environment from:', envPath);
  console.log('NEXT_PUBLIC_API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
}

// Run the build with environment variables
execSync('npm run build', { stdio: 'inherit' });