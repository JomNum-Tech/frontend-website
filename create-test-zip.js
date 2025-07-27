const JSZip = require('jszip');
const fs = require('fs');

async function createTestZip() {
  const zip = new JSZip();
  
  // Create a simple React project structure
  zip.file('package.json', JSON.stringify({
    name: 'test-react-app',
    version: '1.0.0',
    dependencies: {
      react: '^18.0.0',
      'react-dom': '^18.0.0'
    },
    scripts: {
      build: 'react-scripts build',
      start: 'react-scripts start'
    }
  }, null, 2));
  
  zip.file('public/index.html', `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test React App</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>`);
  
  zip.file('src/App.js', `import React from 'react';

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Hello from PaaS Hosting!</h1>
      <p>This is a test React application deployed via ZIP upload.</p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
}

export default App;`);
  
  zip.file('src/index.js', `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`);
  
  zip.file('README.md', `# Test React App

This is a test React application for PaaS hosting.

## Features
- Auto-detected as React project
- Includes package.json with dependencies
- Ready for deployment

## Deployment
Upload this ZIP file to the PaaS hosting platform.`);
  
  // Generate ZIP file
  const content = await zip.generateAsync({ type: 'nodebuffer' });
  fs.writeFileSync('test-react-app.zip', content);
  
  console.log('✅ Created test-react-app.zip');
  console.log('📁 Contains:');
  console.log('  - package.json (React dependencies)');
  console.log('  - public/index.html');
  console.log('  - src/App.js');
  console.log('  - src/index.js');
  console.log('  - README.md');
  console.log('');
  console.log('🚀 You can now upload this ZIP file to test the PaaS hosting feature!');
}

// Create static HTML test ZIP
async function createStaticTestZip() {
  const zip = new JSZip();
  
  zip.file('index.html', `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Static Test Site</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Welcome to PaaS Hosting!</h1>
        <p>This is a static HTML site deployed via ZIP upload.</p>
        <button onclick="showTime()">Show Current Time</button>
        <div id="time-display"></div>
    </div>
    <script src="script.js"></script>
</body>
</html>`);
  
  zip.file('styles.css', `body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    text-align: center;
    max-width: 500px;
}

h1 {
    color: #333;
    margin-bottom: 1rem;
}

button {
    background: #667eea;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 1rem;
}

button:hover {
    background: #5a6fd8;
}

#time-display {
    margin-top: 1rem;
    font-weight: bold;
    color: #667eea;
}`);
  
  zip.file('script.js', `function showTime() {
    const timeDisplay = document.getElementById('time-display');
    const now = new Date();
    timeDisplay.innerHTML = 'Current time: ' + now.toLocaleString();
}

// Show welcome message on load
window.addEventListener('load', function() {
    console.log('Static site loaded successfully via PaaS hosting!');
});`);
  
  const content = await zip.generateAsync({ type: 'nodebuffer' });
  fs.writeFileSync('test-static-site.zip', content);
  
  console.log('✅ Created test-static-site.zip');
  console.log('📁 Contains:');
  console.log('  - index.html');
  console.log('  - styles.css');
  console.log('  - script.js');
}

async function main() {
  console.log('🔧 Creating test ZIP files for PaaS hosting...\n');
  
  await createTestZip();
  console.log('');
  await createStaticTestZip();
  
  console.log('\n🎉 Test ZIP files created successfully!');
  console.log('📦 Files created:');
  console.log('  - test-react-app.zip (React project)');
  console.log('  - test-static-site.zip (Static HTML)');
}

main().catch(console.error);