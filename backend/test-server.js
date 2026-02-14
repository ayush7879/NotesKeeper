// Simple test to verify backend routes are working
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    if (res.statusCode === 200) {
      console.log('✅ Backend server is running!');
    } else {
      console.log('❌ Backend server returned error');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error connecting to backend:', error.message);
  console.log('Make sure the backend server is running: cd backend && node index.js');
});

req.end();
