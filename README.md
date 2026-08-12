# 🪪 ID Matrix Studio - Instant ID Card Generator

A modern, high-performance web application to instantly generate custom ID badges with 10 customizable frame templates, unique serial ID generation, interactive photo crop/zoom, high-resolution PNG downloading, and instant X.com (Twitter), WhatsApp, and Instagram sharing.

---

## 🏗️ Project Architecture (MVC Modular Pattern)

The project follows a clean **Model-View-Controller (MVC)** architectural structure:

```
id-card-generator/
├── src/
│   ├── css/                  # Modular Design System & Stylesheets
│   │   ├── variables.css      # Design tokens (colors, typography, shadows)
│   │   ├── layout.css         # Page containers, grid, responsive rules
│   │   └── components.css     # Buttons, cards, form inputs, modals, toasts
│   │
│   ├── models/               # State Management & Data Structures
│   │   ├── idCardModel.js     # User ID data, photo state & offset parameters
│   │   └── frameModel.js      # 10 Frame template slot configurations
│   │
│   ├── views/                # Render Engine & UI Bindings
│   │   ├── canvasView.js      # High-Res HTML5 Canvas graphics renderer
│   │   └── uiView.js          # DOM elements, frame grid & caption builder
│   │
│   ├── controllers/          # Business Logic & Event Handlers
│   │   ├── photoController.js  # Drag-and-drop, zoom & canvas panning
│   │   ├── frameController.js  # Template selection & custom frame uploads
│   │   ├── shareController.js  # Instant X.com/WhatsApp/Instagram share & PNG export
│   │   └── idCardController.js # Main App Controller (Orchestrator)
│   │
│   ├── utils/                # Helper Utilities
│   │   ├── idGenerator.js     # Serial ID alphanumeric generator
│   │   └── toast.js           # Notification toast & modal helpers
│   │
│   └── main.js               # Application Entry Point
│
├── index.html                # Entry HTML Page
└── package.json              # Project Metadata & Scripts
```

---

## ✨ Features

- **10 Customizable Frame Templates**: Choose from 10 distinct frame themes or upload your own custom PNG/SVG frame overlay.
- **Random Frame Trigger**: Automatically picks a random frame template on initial photo upload.
- **Interactive Photo Alignment**: Drag your photo directly on the canvas to reposition, and use the zoom slider to adjust scaling.
- **Unique Serial ID Generator**: Auto-generates unique alphanumeric IDs (`ID-XXXX-2026`) with simulated barcodes and security holograms.
- **Instant X.com (Twitter) Share**: Pre-fills X Web Intent (`https://x.com/intent/tweet`) with badge details and hashtags.
- **High-Resolution PNG Download**: 1-click 1200x750 high-res export.

---

## 🚀 How to Run

1. Open a terminal in the project directory.
2. Start local server:
   ```bash
   npm start
   ```
3. Open `http://localhost:8080` in your web browser.
