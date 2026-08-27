#!/usr/bin/env node

/**
 * Setup Verification Script
 * Checks if all required configurations are in place before starting the server
 */

const fs = require('fs');
const path = require('path');

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

console.log('\n🔍 Smart Tour AI - Setup Verification\n');
console.log('=' .repeat(50));

// Skip checks in production (Render/Heroku/etc)
if (process.env.NODE_ENV === 'production') {
  console.log('\n✅ Production environment detected - skipping local setup checks\n');
  console.log('Using environment variables from hosting platform...\n');
  process.exit(0);
}

let allChecksPass = true;

// Check 1: Node version
console.log('\n1. Checking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion >= 18) {
  console.log(`   ${GREEN}✓${RESET} Node.js ${nodeVersion} (minimum: v18.x)`);
} else {
  console.log(`   ${RED}✗${RESET} Node.js ${nodeVersion} is too old. Please upgrade to v18 or higher.`);
  allChecksPass = false;
}

// Check 2: .env file
console.log('\n2. Checking .env file...');
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  console.log(`   ${GREEN}✓${RESET} .env file exists`);

  // Load and check env variables
  require('dotenv').config({ path: envPath });

  const requiredVars = [
    'GEMINI_API_KEY',
    'OPENWEATHER_API_KEY',
    'FIREBASE_SERVICE_ACCOUNT_PATH'
  ];

  const missingVars = [];
  requiredVars.forEach(varName => {
    if (!process.env[varName] || process.env[varName].includes('your_')) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length === 0) {
    console.log(`   ${GREEN}✓${RESET} All required environment variables are set`);
  } else {
    console.log(`   ${RED}✗${RESET} Missing or incomplete variables: ${missingVars.join(', ')}`);
    console.log(`   ${YELLOW}→${RESET} Please update your .env file with actual API keys`);
    allChecksPass = false;
  }
} else {
  console.log(`   ${RED}✗${RESET} .env file not found`);
  console.log(`   ${YELLOW}→${RESET} Copy .env.example to .env and fill in your API keys`);
  allChecksPass = false;
}

// Check 3: Firebase service account
console.log('\n3. Checking Firebase service account...');
const firebasePath = path.join(__dirname, '../config/serviceAccountKey.json');
if (fs.existsSync(firebasePath)) {
  console.log(`   ${GREEN}✓${RESET} Firebase service account key found`);

  // Verify it's valid JSON
  try {
    const firebaseConfig = JSON.parse(fs.readFileSync(firebasePath, 'utf-8'));
    if (firebaseConfig.project_id && firebaseConfig.private_key) {
      console.log(`   ${GREEN}✓${RESET} Service account key is valid`);
      console.log(`   ${GREEN}→${RESET} Project ID: ${firebaseConfig.project_id}`);
    } else {
      console.log(`   ${RED}✗${RESET} Service account key is missing required fields`);
      allChecksPass = false;
    }
  } catch (error) {
    console.log(`   ${RED}✗${RESET} Service account key is not valid JSON`);
    allChecksPass = false;
  }
} else {
  console.log(`   ${RED}✗${RESET} Firebase service account key not found`);
  console.log(`   ${YELLOW}→${RESET} Download from Firebase Console and place at:`);
  console.log(`      backend/config/serviceAccountKey.json`);
  allChecksPass = false;
}

// Check 4: node_modules
console.log('\n4. Checking dependencies...');
const nodeModulesPath = path.join(__dirname, '../node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log(`   ${GREEN}✓${RESET} node_modules folder exists`);

  // Check key dependencies
  const keyDeps = ['express', 'firebase-admin', '@google/generative-ai', 'axios', 'joi'];
  const missingDeps = keyDeps.filter(dep => !fs.existsSync(path.join(nodeModulesPath, dep)));

  if (missingDeps.length === 0) {
    console.log(`   ${GREEN}✓${RESET} All key dependencies installed`);
  } else {
    console.log(`   ${YELLOW}⚠${RESET} Some dependencies might be missing: ${missingDeps.join(', ')}`);
    console.log(`   ${YELLOW}→${RESET} Run: npm install`);
  }
} else {
  console.log(`   ${RED}✗${RESET} node_modules not found`);
  console.log(`   ${YELLOW}→${RESET} Run: npm install`);
  allChecksPass = false;
}

// Check 5: Port availability
console.log('\n5. Checking port availability...');
const net = require('net');
const port = process.env.PORT || 5000;

const server = net.createServer();
server.once('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`   ${YELLOW}⚠${RESET} Port ${port} is already in use`);
    console.log(`   ${YELLOW}→${RESET} Either stop the other process or change PORT in .env`);
  }
});

server.once('listening', () => {
  console.log(`   ${GREEN}✓${RESET} Port ${port} is available`);
  server.close();
});

server.listen(port);

// Check 6: Mock data
console.log('\n6. Checking mock data files...');
const hazardDataPath = path.join(__dirname, '../data/mock-hazards.json');
if (fs.existsSync(hazardDataPath)) {
  console.log(`   ${GREEN}✓${RESET} Mock hazard data exists`);

  try {
    const hazardData = JSON.parse(fs.readFileSync(hazardDataPath, 'utf-8'));
    const locations = Object.keys(hazardData).filter(k => !k.startsWith('_'));
    console.log(`   ${GREEN}→${RESET} ${locations.length} locations configured`);
  } catch (error) {
    console.log(`   ${RED}✗${RESET} Mock data file is not valid JSON`);
    allChecksPass = false;
  }
} else {
  console.log(`   ${RED}✗${RESET} Mock hazard data not found`);
  allChecksPass = false;
}

// Final summary
console.log('\n' + '='.repeat(50));

setTimeout(() => {
  if (allChecksPass) {
    console.log(`\n${GREEN}✓ All checks passed! You're ready to start the server.${RESET}`);
    console.log(`\nRun: ${GREEN}npm run dev${RESET}\n`);
    process.exit(0);
  } else {
    console.log(`\n${RED}✗ Some checks failed. Please fix the issues above before starting.${RESET}\n`);
    console.log(`${YELLOW}Need help?${RESET} Check SETUP_GUIDE.md for detailed instructions.\n`);
    process.exit(1);
  }
}, 100);
