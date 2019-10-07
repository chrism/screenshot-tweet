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

  const browser = await puppeteer.launch({
    args: ['--lang=en-US,en']
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 800,
    height: 2000,
    deviceScaleFactor: 2
  })
  await page.goto(tweet);

  const aHandle = await page.$(`a[href*="1181232251390042118"]`);
  const tweetEl = await page.evaluate(aHandle => {

    const test = aHandle.parentElement.parentElement.parentElement.parentElement.getProperty("className");

    return test;
  }, aHandle);

  console.log(tweetEl)

  // const tweetDimensions = await tweetEl;
  // console.log(tweetDimensions);




  // // Get the "viewport" of the page, as reported by the page.
  // const dimensions = await page.evaluate(() => {
  //   return document.querySelector('a');
  // });

  // console.log('Dimensions:', dimensions);

  // await page.waitFor(5000);

  // await page.once('load', () => console.log('Page loaded!'));

  // const links = await page.$$(`a[href*="1181232251390042118"]`);

  // const html = await page.evaluate(body => body.innerHTML, bodyHandle);

  // // console.log(links.parent);

  // // const tweetEl = await page.evaluate(() => {
  // //   return document.querySelector(`a[href*="1181232251390042118"]`);
  // // });

  // console.log("say what");
  // console.log(html)

  // // await page.evaluate(() => {
  // //   document.querySelector('div.permalink-tweet').style.borderRadius = 0;
  // //   document.querySelector('div.permalink-tweet-container').style.border = '1px solid #e6ecf0';
  // //   document.querySelector('div.follow-bar').style.display = 'none';
  // // });

  // await page.$eval('article', el => {
  //   console.log("this is resolved")
  //   console.log(el);
  // });



  // const tweetEl = await page.$(`[data-testid="tweet"]`);
  // const tweetDimensions = await tweetEl.boundingBox();

  // console.log(tweetEl);
  // console.log(tweetDimensions);

  // // const tweetEl = await page.$('div.permalink-tweet-container');
  // // const tweetDimensions = await tweetEl.boundingBox();

  // await page.screenshot({
  //   path,
  //   clip: tweetDimensions
  // });

  // const successMsg = chalk.green(`Screenshot successfully saved to ${path}`);
  // console.log(successMsg);

  await browser.close();
})();
