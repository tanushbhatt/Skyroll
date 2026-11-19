# 🚀 SKYROLL

**Skyroll** is a responsive, cross-device arcade flight game built with **React**, **TypeScript**, **HTML5 Canvas**, and **Tailwind CSS**. Designed for phones, tablets, and laptops, players dodge hazards, collect stars, complete flight missions, and spend earned stars in the Hangar to unlock new aircraft, custom liveries, and dynamic sky worlds.

---

## ✨ Key Features

* **Cross-Device Controls:** Play seamlessly on mobile, tablet, or desktop using **Touch Drag / Tap**, **Device Tilt**, on-screen steering controls, or **`A` / `D` and `◀` / `▶` Arrow Keys**.
* **Pilot Progression & XP System:** Earn Pilot XP across flights to level up your pilot rank, track your all-time high score, and automatically persist progress in `localStorage`.
* **Flight Missions:** Complete dynamic objectives to earn bonus star rewards:
  * *Star Collector* — Collect stars across flights
  * *Sky Ace* — Reach target score milestones in a single run
  * *Tech Savvy* — Activate in-flight power-ups
  * *Evasive Maneuvers* — Survive past incoming hazards
* **Interactive Skyroll Hangar & Store:** Customize your loadout with distinct aircraft stats (**Speed**, **Handling**, and **Magnet**):
  * **5 Unlockable Aircraft:** *Aero Sparrow*, *Strato Viper*, *Nova Interceptor*, *Obsidian Wraith*, and *Solar Phoenix*.
  * **5 Custom Plane Skins (Liveries):** *Arctic Titanium*, *Crimson Ace*, *Neon Overdrive*, *Emerald Valkyrie*, and *Aurum Royal*.
  * **4 Dynamic Sky Worlds:** *Amber Horizon*, *Stratosphere Blue*, *Cyber Metropolis*, and *Deep Nebula*.
* **Procedural Web Audio:** Built-in synthesized sound effects with an instant mute/unmute toggle in the HUD.

---

## 📸 Screenshots

| Home Base & Launch Deck | Skyroll Hangar (Aircraft Store) |
| :---: | :---: |
| ![Home Base](screenshots/home.png) | ![Hangar Aircraft](screenshots/hangar-aircraft.png) |

| Plane Liveries & Skins | Sky Worlds | Flight Missions |
| :---: | :---: | :---: |
| ![Plane Skins](screenshots/hangar-skins.png) | ![Sky Worlds](screenshots/hangar-worlds.png) | ![Flight Missions](screenshots/missions.png) |

---

## 🛠️ Tech Stack

* **Frontend:** React + TypeScript
* **Build Tool:** Vite
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Rendering & Audio:** HTML5 2D Canvas API & Web Audio API

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/skyroll.git
cd skyroll
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser to launch the game.

---

## 🎮 How to Play

1. **Launch:** Click **LAUNCH FLIGHT** from the main deck.
2. **Steer:** Move left or right using touch drag/tap, tilt, or `A`/`D` and Left/Right arrow keys.
3. **Collect & Survive:** Gather stars to build your currency, grab power-ups, and weave through hazards.
4. **Upgrade:** Visit the **Hangar & Store** or **Missions** tab to claim star bonuses and unlock new jets, skins, and worlds.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).