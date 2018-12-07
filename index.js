const puppeteer = require('puppeteer');
const argv = require('minimist')(process.argv.slice(2));

(async () => {
  const url = argv._[0] || 'https://twitter.com/joshburt76/status/506760039424868352';

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 800,
    height: 600,
    deviceScaleFactor: 2
  })
  await page.goto(url);

  await page.evaluate(() => {
    document.querySelector('div.tweet').style.borderRadius = 0;
    document.querySelector('div.follow-bar').style.display = 'none';
  });

  const tweet = await page.$('div.tweet');
  const tweetDimensions = await tweet.boundingBox();  

  await page.screenshot({
    path: 'example.png',
    clip: tweetDimensions
  });

  await browser.close();
})();