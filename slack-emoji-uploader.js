#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');

// CLI arguments
const argv = yargs
  .usage('Usage: $0 --workspace <name> --folder <path>')
  .option('workspace', {
    alias: 'w',
    description: 'Your Slack workspace slug (e.g., myworkspace)',
    type: 'string',
    demandOption: true,
  })
  .option('folder', {
    alias: 'f',
    description: 'Path to folder containing emoji images',
    type: 'string',
    demandOption: true,
  })
  .option('delay', {
    alias: 'd',
    description: 'Delay between uploads (ms)',
    type: 'number',
    default: 2000,
  })
  .help()
  .alias('help', 'h').argv;

(async () => {
  const emojiFiles = fs.readdirSync(argv.folder).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.png', '.jpg', '.jpeg', '.gif'].includes(ext);
  });

  if (emojiFiles.length === 0) {
    console.error('❌ No image files found in the folder.');
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--start-maximized',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
    ],
    defaultViewport: null,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    userDataDir: path.join(process.env.HOME, 'Library/Application Support/Google/Chrome/SlackUploader'), // You might need to change "SlackUploader" to your profile name, if it's different!
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
  );

  // Define known suffixes
  const knownSuffixes = ['bufo', 'parrot', 'blob'];

  for (const file of emojiFiles) {
    let emojiName = path.basename(file, path.extname(file));
    const filePath = path.join(argv.folder, file);

    // Insert hyphen before known suffixes
    for (const suffix of knownSuffixes) {
      const regex = new RegExp(`(.*)(${suffix})$`, 'i');
      if (regex.test(emojiName)) {
        emojiName = emojiName.replace(regex, '$1-$2');
        break;
      }
    }

    console.log(`\n🟡 Uploading: ${emojiName}`);

    try {
      await page.goto(`https://${argv.workspace}.slack.com/customize/emoji`, {
        waitUntil: 'networkidle2',
      });

      // Open upload modal
      await page.waitForSelector('button[data-qa="customize_emoji_add_button"]', { timeout: 10000 });
      await page.click('button[data-qa="customize_emoji_add_button"]');

      // Upload image
      await page.waitForSelector('input[type="file"]', { timeout: 10000 });
      const fileInput = await page.$('input[type="file"]');
      await fileInput.uploadFile(filePath);

      // Type emoji name
      const nameInput = await page.$('input[name="name"]');
      await nameInput.click({ clickCount: 3 });
      await nameInput.press('Backspace');
      await nameInput.type(emojiName);

      // Click Save
      await page.waitForSelector('button[data-qa="customize_emoji_add_dialog_go"]', { timeout: 5000 });
      await page.click('button[data-qa="customize_emoji_add_dialog_go"]');

      await new Promise(resolve => setTimeout(resolve, argv.delay));
      console.log(`✅ Uploaded: ${emojiName}`);
    } catch (err) {
      console.error(`❌ Failed to upload ${emojiName}: ${err.message}`);
    }
  }

  console.log('\n🎉 All done!');
  await browser.close();
})();
