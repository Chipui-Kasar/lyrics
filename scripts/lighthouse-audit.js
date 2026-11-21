const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function runLighthouseAudit() {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance'],
    port: chrome.port,
  };

  const runnerResult = await lighthouse('http://localhost:3000', options);
  
  console.log('Performance Score:', runnerResult.score);
  console.log('Largest Contentful Paint:', runnerResult.audits['largest-contentful-paint'].displayValue);
  console.log('First Contentful Paint:', runnerResult.audits['first-contentful-paint'].displayValue);
  console.log('Speed Index:', runnerResult.audits['speed-index'].displayValue);
  
  await chrome.kill();
}

runLighthouseAudit().catch(console.error);
