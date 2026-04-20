# YouTube Customizer - Firefox Extension

A Firefox extension that blocks YouTube Shorts and forces the video grid to show 5 videos per row consistently.

## 🎯 Features

1. **Shorts Blocking**: Completely removes all Shorts from YouTube
   - Blocks shorts on the home page
   - Blocks shorts in search results
   - Redirects shorts URLs (`/shorts/`) to the normal video player (`/watch`)
   - Removes navigation chips and tabs for Shorts

2. **Grid & Queue Expansion**: Always shows 5 videos
   - Overrides YouTube's dynamic grid calculation
   - Ensures 5 videos are always visible per row on the home page and subscriptions
   - Expands the recommended videos queue on the watch page

## 📦 Installation

### Method 1: Temporary Installation (for testing)

1. Open Firefox
2. Type `about:debugging` in the address bar
3. Click on "This Firefox"
4. Click on "Load Temporary Add-on..."
5. Navigate to the extension folder and select the `manifest.json` file
6. The extension will be loaded and active until you close Firefox

### Method 2: Permanent Installation (Packaging)

1. Package the extension into a `.zip` or `.xpi` file:
   - Select all files inside the folder (`manifest.json`, `content.js`, `styles.css`, etc.)
   - Right-click and compress them into a ZIP archive. Make sure `manifest.json` is at the root of the ZIP, not inside a subfolder.

2. Go to `about:addons` in Firefox
3. Click the gear icon ⚙️
4. Select "Install Add-on From File..."
5. Choose your packaged `.zip` or `.xpi` file

**Note**: For permanent installation of unsigned extensions, you need Firefox Developer Edition or Firefox Nightly, or you must sign the extension on the Mozilla Developer Hub (Add-ons for Firefox).

## 🔧 How it Works

### Extension Architecture

The extension uses three main components:

1. **manifest.json**: Defines permissions and metadata
2. **content.js**: Script that runs on YouTube pages to clean the DOM dynamically
3. **styles.css**: CSS rules to hide elements and override the grid layout

### Technical Details

#### Shorts Blocking

The script uses multiple strategies:

```javascript
// 1. Detects navigation to shorts URLs
if (window.location.pathname.includes('/shorts/')) {
    // Redirects to normal format
    window.location.href = `https://www.youtube.com/watch?v=${videoId}`;
}

// 2. Removes DOM elements using accurate CSS selectors
const shortsSelectors = [
    'ytd-reel-shelf-renderer',  // Classic Shorts shelf
    'grid-shelf-view-model:has(ytm-shorts-lockup-view-model)', // Modern UI shelf
    'a[href*="/shorts/"]'       // Shorts links
];

// 3. Intercepts clicks on shorts links dynamically
link.addEventListener('click', function(e) {
    e.preventDefault();
    // Converts to normal video and redirects
});
```

#### Home Page Grid (5 Videos)

YouTube artificially limits or changes how many videos it shows per row based on window size using Javascript. The extension overrides this entirely with Modern CSS Grid:

```css
/* 1. Sets the strict 5-column grid layout */
#contents.ytd-rich-grid-renderer {
    display: grid !important;
    grid-template-columns: repeat(5, 1fr) !important;
}

/* 2. Disables YouTube's row wrappers so items flow smoothly */
ytd-rich-grid-row,
ytd-rich-grid-row > #contents {
    display: contents !important;
}
```

#### MutationObserver

Since YouTube is a Single Page Application (SPA), content is loaded dynamically as you scroll or click around. We use a MutationObserver to detect changes and re-apply filters:

```javascript
const observer = new MutationObserver((mutations) => {
    blockShorts();
    expandQueue();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
```

## 📝 File Structure

```
youtube-customizer/
├── manifest.json      # Extension configuration
├── content.js         # Main Javascript logic
├── styles.css         # CSS styles and layout overrides
└── README.md          # This file
```

## 🔐 Permissions

The extension requires only:
- Access to the `youtube.com` domains (to modify the page layout)
- No network or personal data tracking permissions are used. 

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Note**: This extension only modifies the YouTube interface locally in your browser. No data is ever collected or sent to external servers.
