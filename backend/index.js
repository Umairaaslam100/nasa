const app = require('./app');
const path = require('path');
const express = require('express');

const PORT = process.env.PORT || 5000;

// Serve frontend static files
console.log('Setting up static file serving');
app.use(express.static(path.join(__dirname, '../frontend/build')));

// For all other routes, send back frontend's index.html
console.log('Setting up catch-all route: *');
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
