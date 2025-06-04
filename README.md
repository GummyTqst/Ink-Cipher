# 📚 Ink & Cipher — Immersive Puzzle Story Platform

**Ink & Cipher** is an interactive, story-driven puzzle platform where users unlock beautifully illustrated books through engaging cipher and word challenges. The experience blends narrative exploration with gamified progression.


## Figma link: 
https://www.figma.com/design/KBVyFTTdDzrDW4xK4gTR6V/Indie-Projeckt?node-id=4-72&t=HI7kJ2zWgeN2UkMT-0

---

## 🧩 Concept

> **Solve the puzzles, reveal the story.**

- Users browse, buy, and collect interactive books.
- Each book requires solving a themed puzzle before unlocking.
- Progress is tracked and achievements are rewarded as users dive deeper into the mysterious library.

---

## 🌐 Pages Overview

### 1. **Home Page**
- Hero section with branding and mission.
- Warm, candlelit library aesthetic.
- CTA: **"Explore the Journey"** button.

### 2. **Puzzle Page**
- Used to unlock books (after purchasing).
- Puzzle types:
  - **Anagram Puzzle**
  - **Symbol Cipher Puzzle**
- Includes locked/continue buttons depending on completion status.

### 3. **Collection Page**
- Shows all purchased books.
- States:
  - 🔒 Locked (requires solving puzzle)
  - 🔓 Unlocked (full access)
- Features:
  - Book grid layout
  - Book detail modal (with cover, synopsis, difficulty)
  - Puzzle access from locked books
  - Filters (genre, difficulty, status)
  - Progress tracker

### 4. **Shop Page**
- Discover and purchase books.
- Features:
  - Book grid (title, cover, price, “Add to Cart”)
  - Sorting options
  - Bundle builder (create your own bundle: 3 titles)
  - Locked state only removed upon purchase

### 5. **My Progress Page**
- Dashboard-style view of user activity.
- Displays:
  - Books unlocked, in progress, completed
  - Achievements/Badges
  - Recent Activity timeline
  - Progress charts or bars
- Works locally (or with account system)

---

## 🔐 Book Lifecycle

1. **Buy Book** → Shop page (via Add to Cart or Bundle)
2. **Appears Locked** → Collection page (blurred cover)
3. **Solve Puzzle** → Puzzle modal opens on click
4. **Unlock** → Book becomes fully accessible in collection

---

## 🎨 Visual & UX Elements

- **Color Scheme**: Warm amber, golds, dark browns (library/mystery theme)
- **Typography**: Elegant serif headers, clean sans-serif for text
- **Hover Effects**: Glow or tooltip on book hover
- **Transitions**: Unlock animations (magical glyph fade, subtle glow)
- **Navigation**:
  - Top bar with: `Home | Puzzles | Collection | Shop | My Progress`
  - Active page highlighted
  - Hover effects on nav items

---

## 🎨 Style Guide

### 🎨 Colors
- **Background**: Gradient to bottom from `#291909` to `#160E06`
- **UI background**: `#161009`
- **Outline on UI** `#502C07`
- **Text**: 
  - Headings: `#86541C`
  - Body: Light beige `#AD8953`
  - Buttons: Burnt orange `#B87A30`

### 🖋 Fonts
- **Headers**: Cinzel Decorative
- **Body**: Lora
- **UI Elements**: Inter

---

## 🔍 Key Features

### Core:
- Book archive grid with sorting/filtering
- Book detail modal
- Unlock puzzles
- Search functionality
- Locked/unlocked states
- User progress tracking

### Optional Enhancements:
- Puzzle difficulty sorting
- Achievements (e.g. “Unlocked 5 Books”)
- Lore tooltips on symbols
- Animated book unlock
- Bookmark or favorite titles

---

## 🧠 Technical Considerations

- **Frontend only** (can work with local storage)
- Account system optional for:
  - Cloud-based progress saving
  - Cross-device activity sync
- Book content loaded dynamically (unlock triggers)

---

## 🔮 Future Ideas

- Weekly puzzle drops
- “Secret” lore books hidden behind riddles
- User-created puzzle contributions
- Book club or collaborative puzzle-solving mode

---

## 📁 Project Structure (Design/UX)
InkAndCipher/
│
├── /home → Intro screen with CTA
├── /puzzles → Puzzle challenges (modal-based)
├── /collection → Owned books (locked/unlocked)
├── /progress → Achievements, charts, activity
│
├── /components → BookCard, PuzzleModal, ProgressBar
├── /assets → Covers, puzzles, UI icons
└── /styles → Theme, typography, animations

