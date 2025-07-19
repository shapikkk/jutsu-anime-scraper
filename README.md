
# 🎌 Jut.su Anime Bookmark Scraper

A Node.js script that scrapes a user's anime bookmark list from [jut.su](https://jut.su) and saves the data to JSON and TXT files, including ratings and episode info.

---

## 📦 Installation

1. Clone this repo:

   ```bash
   git clone git@github.com:shapikkk/jutsu-anime-scraper.git
   cd jutsu-anime-scraper
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. (Optional) Install `nodemon` globally for auto-restart during development:

   ```bash
   npm install -g nodemon
   ```

---

## 🚀 Usage

To start the scraper, run:

```bash
npm start
```

Or if you're using `nodemon` for development:

```bash
npm run dev
```

You will be prompted to enter your jut.su username:
  
```
Enter your jut.su username: <username>
```

The script will then begin scraping your anime bookmarks page-by-page.

---

## 📂 Output

Once finished, the script will generate two files in the project directory:

1. **`anime_list_<username>.json`** — For programmatic use.
2. **`anime_list_<username>.txt`** — For easy human reading.

### Example TXT output:

```
#1
Title: Naruto Shippuden
Episodes: 500
Rating: ★★★★☆
----------------------------------------

#2
Title: One Piece
Episodes: 1100
Rating: ★★★★☆
----------------------------------------
```

---

## ⚙️ Configuration

You can modify the output filename prefix in the script:

```js
const filenamePrefix = `anime_list_${username}`;
```

You may also customize the delay between page requests here:

```js
await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
```

---

## ⚠️ Disclaimer

This script accesses publicly available pages on **jut.su**, but:

- It may violate the site's [terms of use](https://jut.su).
- It could stop working if the site layout changes.
- Excessive usage might result in a temporary or permanent block.

Use this responsibly and only for personal or educational purposes.

---

## 💡 Tips

- If no anime is found, ensure the username is correct and that their bookmarks are public.
- If you want to add export to CSV or Markdown, feel free to fork and extend this script.
- You can adjust the sorting/filtering logic as needed in the final output.

---

## 🧪 Development

To automatically reload on code changes using `nodemon`, run:

```bash
npm run dev
```

Make sure your `package.json` includes:

```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

---

## 📄 License

MIT License — use freely with attribution.

---

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.
