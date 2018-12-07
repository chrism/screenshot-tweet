const puppeteer = require('puppeteer');
const argv = require('minimist')(process.argv.slice(2));
const url = require('url');
const fs = require('fs');
const chalk = require('chalk');

(async () => {
  const tweet = argv._[0];

  if (!tweet) {
    const errorMsg = chalk.red('Please provide a tweet URL to screenshot.');
    console.log(errorMsg);
    
    process.exit();
  }

  const tweetURL = url.parse(tweet);
  
  const [,username,,tweetId] = tweetURL.pathname.split("/");

  let path = './tweets';

  if (!fs.existsSync(path)){
    fs.mkdirSync(path);
  }

  path += `/${username}`;

  if (!fs.existsSync(path)){
    fs.mkdirSync(path);
  }

  path += `/${tweetId}.png`

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 800,
    height: 600,
    deviceScaleFactor: 2
  })
  await page.goto(tweet);

  await page.evaluate(() => {
    document.querySelector('div.tweet').style.borderRadius = 0;
    document.querySelector('div.follow-bar').style.display = 'none';
  });

  const tweetEl = await page.$('div.tweet');
  const tweetDimensions = await tweetEl.boundingBox();  

  await page.screenshot({
    path,
    clip: tweetDimensions
  });

  const successMsg = chalk.green(`Screenshot successfully saved to ${path}`);
  console.log(successMsg);

  await browser.close();
})();