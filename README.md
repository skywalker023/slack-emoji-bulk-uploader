# 🧙 Slack Emoji Bulk Uploader

Upload a folder of custom emoji to your Slack workspace — in one go!  
No API keys, no cookies, and no rate limits. Just your real Chrome browser and this handy auto uploader.


## 📸 What It Does

- Opens Chrome with your own logged-in Slack session
- Uploads every image in a folder as a new custom emoji
- Uses the image filename as the emoji name (e.g. `bufo-excited.gif` → `:bufo-excited:`)
- No scraping, no weird workarounds — just real automation



## 🚀 Setup

### 1. Clone and install

```bash
git clone https://github.com/skywalker023/slack-emoji-bulk-uploader.git
cd slack-emoji-uploader
npm install
```

### 2. Create a Chrome Profile for Slack uploads

To keep your main Chrome session safe, we use a dedicated profile:

- Open Chrome
- Click your profile icon (top right) → **Add**
- Name it something like `SlackUploader`
- In that profile, go to your Slack workspace and log in manually
- You only need to log in **once**



## 🛠 Usage

```bash
node slack-emoji-uploader.js --workspace your-workspace --folder ./emojis
```

| Argument      | Description                                                  |
|---------------|--------------------------------------------------------------|
| `--workspace` | Your Slack subdomain (e.g. `myteam` for `myteam.slack.com`) |
| `--folder`    | Path to a folder of image files (`.png`, `.jpg`, `.gif`)     |
| `--delay`     | Optional. Delay (in ms) between uploads. Default: `2000`     |



### 💻 Upload Flow

1. The script launches your dedicated Chrome profile
2. Slack recognizes you're logged in
3. The script uploads each image as an emoji
4. Done! 🎉



### 📸 Example

```bash
node slack-emoji-uploader.js --workspace myteam --folder ./emojis
```


### 🧪 First Time? Manually Log In Once

On first run, you might see the Slack login screen.

1. Quit Chrome completely (`⌘ + Q`)
2. Run this in your terminal to open the right profile:

```bash
open -na "Google Chrome" --args --user-data-dir="$HOME/Library/Application Support/Google/Chrome/SlackUploader"
```

3. Log into your Slack workspace manually in that window
4. You're good to go — the script will use that session next time


## Tips

### 📂 Emoji Name

- The filename becomes the emoji name
- Use `-` or `_` instead of spaces
- Avoid special characters like `+`, `#`, `@`
- All names are lowercased automatically by Slack


### 🧯 Troubleshooting

- Emoji upload button doesn't appear? You're not logged in yet.
- Script fails to find buttons? Slack may have updated the UI. Open an issue or PR!
- Need to upload hundreds? Increase `--delay` to avoid Slack rate limiting.



## 📃 License

MIT — do whatever you want, just give credit.  
Contributions welcome!



Built with 🍦, 🤖, and 🐸