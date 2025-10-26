# 🖥️ Digital Desktop of Memories

A nostalgic Windows XP-inspired web desktop environment featuring interactive mini-apps and a retro aesthetic. Built with vanilla JavaScript and modular architecture.

![Vanilla JS](https://img.shields.io/badge/Vanilla%20JS-F7DF1E?style=flat&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

**🌐 [Live Demo](https://wauxi.github.io/windows/)** | **📦 [Repository](https://github.com/wauxi/windows)**

---

## ✨ Features

### 🎮 Interactive Desktop Environment
- **Windows XP Style UI**: Nostalgic desktop with draggable windows and classic styling
- **Smart Icon Placement**: Animated icon scattering with intelligent positioning
- **Runaway Icon Easter Egg**: One icon playfully escapes from your cursor
- **Window Management**: Draggable windows with proper z-index stacking
- **Responsive Design**: Adapts to different screen sizes

### 🎯 Embedded Applications

#### 📍 Maps (Cafe Finder)
- Interactive Tinder-style card swiping for finding cafes
- Save your favorite locations
- Geolocation support
- Smooth Hammer.js powered gestures
- [Original Project](https://github.com/wauxi/Cafe-finder)

#### 📺 Media Player (CRT TV Simulator)
- Realistic Sony Trinitron CRT television simulator
- VHS filter mode with authentic effects
- Picture settings control (saturation, contrast, brightness, blur)
- Upload MP4 files or embed YouTube videos
- Aperture-grill and screen flickering effects
- Based on [CRT TV Simulator](https://github.com/the-daniele/televisions)

#### 📸 Photos (Photobooth)
- Interactive photo booth web application
- Camera capture functionality
- Stickers and filters
- Based on [Photobooth Webapp](https://github.com/nasha-wanich/photobooth-webapp)

#### 💣 Minesweeper
- Classic minesweeper game implementation
- Multiple difficulty levels
- Timer and mine counter
- Based on [Minesweeper JS](https://github.com/urluur/minesweeper-js)

#### 🎵 Winamp
- Fully functional Winamp player
- Custom playlist support
- Authentic retro interface
- Powered by [Webamp](https://github.com/captbaritone/webamp)

---

## 🚀 Quick Start

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server to handle ES6 modules

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/wauxi/windows.git
cd windows
```

2. **Start a local server:**

Using Python 3:
```bash
python -m http.server 8000
```

Using Node.js:
```bash
npx http-server -p 8000
```

Using PHP:
```bash
php -S localhost:8000
```

3. **Open in your browser:**
```
http://localhost:8000
```

---

## 📁 Project Structure

```
windows/
├── index.html                 # Main desktop HTML
├── style.css                  # Desktop styling (Windows XP theme)
│
├── apps/                      # Embedded applications
│   ├── cards/                 # Cafe finder app
│   │   ├── index.html
│   │   ├── styles.css
│   │   ├── data/
│   │   │   └── mock-places.json
│   │   └── src/
│   │       ├── main.js        # App initialization
│   │       ├── ui.js          # Card rendering
│   │       ├── hammer.js      # Swipe gestures
│   │       ├── storage.js     # localStorage handling
│   │       └── ...
│   │
│   ├── memories_player/       # CRT TV simulator
│   │   ├── index.html
│   │   ├── css/
│   │   │   └── sony_standard_crt_tv.css
│   │   ├── javascript/
│   │   │   └── standard_crt_tv.js
│   │   └── images/
│   │
│   ├── photobooth/            # Photo booth app
│   │   ├── index.html
│   │   ├── camera.html
│   │   ├── Javascripts/
│   │   └── StyleSheets/
│   │
│   └── minesweeper/           # Minesweeper game
│       ├── index.html
│       ├── style.css
│       └── js/
│           ├── game.js
│           ├── display.js
│           └── timer.js
│
├── modules/                   # Core desktop modules
│   ├── app.js                 # Main initialization
│   ├── app-launcher.js        # App window management
│   ├── desktop-icon-manager.js # Icon click handling
│   ├── icon-scatterer.js      # Icon positioning
│   ├── runaway-icon.js        # Easter egg icon
│   ├── window-dragger.js      # Drag functionality
│   ├── window-closer.js       # Close button handler
│   ├── window-state.js        # Window state management
│   ├── webamp-manager.js      # Winamp integration
│   ├── iframe-creator.js      # App iframe creation
│   ├── memories-preloader.js  # CRT TV preloading
│   ├── error-dialog.js        # Error handling UI
│   └── constants.js           # Configuration constants
│
└── assets/                    # Static resources
    ├── images/
    │   ├── back/              # Desktop backgrounds
    │   └── icons/             # Application icons
    ├── fonts/
    └── audio/
        └── playlist/
            └── playlist.json  # Winamp playlist
```

---

## 🛠️ Technologies Used

### Core Technologies
- **Vanilla JavaScript (ES6 Modules)** - Modular architecture with no framework dependencies
- **HTML5 & CSS3** - Modern web standards
- **XP.css** - Windows XP styling framework

### Key Features & APIs
- ES6 Module System
- CSS Grid & Flexbox layouts
- localStorage for data persistence
- Canvas API for visual effects
- Geolocation API
- MediaDevices API (photobooth)
- Custom event handling
- Dynamic iframe management
- Window dragging system
- Z-index management
- Hammer.js for touch gestures
- Webamp music player integration

---

## 🎨 Design Highlights

### Modular Architecture
Each application runs in its own sandboxed iframe with smart sizing and positioning. The window management system handles:
- Dynamic window resizing based on content
- Proper z-index stacking
- Centered positioning with transform
- Overflow prevention
- Memory-efficient iframe preloading

### Smart Icon System
- Icons animate into view with staggered fade-in
- Intelligent scatter algorithm prevents overlap
- One "runaway" icon as an Easter egg
- Hover scale effects
- Custom cursors on interaction

### Window Management
- Draggable windows with smooth movement
- Click-to-focus with automatic z-index elevation
- Modal-style presentation for media apps
- Game-optimized sizing for Minesweeper
- Full-screen TV simulation mode

---

## ⚙️ Configuration

### Winamp Playlist
Edit `assets/audio/playlist/playlist.json` to customize your music playlist:

```json
[
  {
    "metaData": {
      "artist": "Artist Name",
      "title": "Song Title"
    },
    "url": "path/to/audio.mp3"
  }
]
```

### App Constants
Modify `modules/constants.js` to customize:
- Window sizes and dimensions
- Animation timing
- TV scaling ratios
- Icon scatter settings
- Z-index starting values

### Desktop Background
Replace the image in `assets/images/back/windows.jpg` with your own background, or modify `style.css`:

```css
body {
  background: url('assets/images/back/your-image.jpg') no-repeat center center / cover fixed;
}
```

---

## 🎯 App-Specific Notes

### Maps (Cafe Finder)
- Includes mock data mode by default
- Configure Google Places API in `apps/cards/src/config.js` for live data
- Swipe right to save, left to skip

### Media Player
- Supports YouTube embeds and MP4 uploads
- Realistic CRT effects with customizable settings
- VHS filter mode for authentic retro feel
- Preloaded for instant startup

### Photobooth
- Requires camera permissions
- Multiple page navigation system
- Sticker and filter effects

### Minesweeper
- Classic gameplay mechanics
- Timer and flag counter

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/wauxi/windows/issues).

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

Special thanks to the creators and contributors of the integrated open-source projects:
- [Cafe Finder](https://github.com/wauxi/Cafe-finder) by @wauxi
- [Webamp](https://github.com/captbaritone/webamp) by @captbaritone
- [Photobooth Webapp](https://github.com/nasha-wanich/photobooth-webapp) by @nasha-wanich
- [Minesweeper JS](https://github.com/urluur/minesweeper-js) by @urluur
- [CRT TV Simulator](https://github.com/the-daniele/televisions) by @the-daniele

---
