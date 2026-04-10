# Bookfinder

This lab page fetches data from two sources:
- OpenLibrary (book search results)
- A local API on `http://localhost:3000/products` (slow product results)

## Files
- `Bookfinder.html`
- `Bookfinder.js`

## What The Page Does
1. Loads book results from OpenLibrary using your search input.
2. Loads product results from a local server.
3. Shows a loading message while waiting for local product data.

## Run Instructions
1. Open this folder in VS Code.
2. Start a local API at `http://localhost:3000/products`.
3. Open `Bookfinder.html` in your browser.
4. Enter a search term and click Submit.

## Start A Local API (Example with json-server)
If you do not already have a local API running:

```bash
npm install -g json-server
```

Create a `db.json` file in this folder:

```json
{
  "products": [
    { "title": "Notebook", "category": "School" },
    { "title": "Keyboard", "category": "Electronics" }
  ]
}
```

Run:

```bash
json-server --watch db.json --port 3000
```

## Troubleshooting
- No book results: Check internet connection and try a different search term.
- No slow product results: Make sure your local API is running on port `3000`.
- Script not loading: In `Bookfinder.html`, make sure the script tag matches the JS filename in this folder.
  - Example: `<script src="Bookfinder.js" defer></script>`


