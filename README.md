
---

## 📚 Objectives
- 🎯 Design a professional **web front-end** for **NU Bulldogs Exchange**.
- 🎯 Implement **code reusability** using **React components** (Header, Footer, List, etc.).

---

## 🧰 Materials Needed
- 💻 A computer with the following installed:
  - **Node.js** and **npm** → [Download Node.js](https://nodejs.org/)
  - **React.js** project created (via Vite or Create React App)
- 🛠 A code editor like:
  - Visual Studio Code (recommended)
  - CodeSandbox
  - GitHub Codespaces
- 📦 Packages needed:
  - `react-router-dom`
  - `react-icons`
- ⚙️ Additional instruction:
  - **Remove the default contents** inside `index.css`.

---

## 🛠 Project Setup

### Step 1: Create a New React Project

Using **Vite** (recommended):

```bash
npm create vite@latest nu-bulldogs-exchange
cd nu-bulldogs-exchange
npm install
```

OR using **Create React App**:

```bash
npx create-react-app nu-bulldogs-exchange
cd nu-bulldogs-exchange
npm install
```

---

### Step 2: Install Required Packages

```bash
npm install react-router-dom react-icons
```

---

### Step 3: Clean Up Starter Files
- Remove everything inside `index.css` (leave it empty).
- Clean `App.jsx` or `App.js` to a blank functional component.
- Delete default logos and example code from `App.css` if needed.

---

## 🏗 Suggested Folder Structure

```
src/
├── assets/
│   └── (images or icons if needed)
├── components/
│   ├── Header.jsx
│   ├── Footer.jsx
│   └── ExchangeList.jsx
├── pages/
│   ├── Home.jsx
│   └── About.jsx
├── App.jsx
├── App.css
├── index.css
├── main.jsx (or index.js)
```

✅ Components must be **modular and reusable**.

---

## 📋 Instructions

### 1. Initial Code Requirements
- Replicate the given **starter code**.
- Apply the provided **App.css** styles.
- Setup routing properly:
  - `/` → Home
  - `/about` → About
- Create a simple **Navbar** with `Home` and `About` links.
- Use **react-router-dom** for page navigation.
- Use **react-icons** to display simple icons.

---

### 2. Enhancement Instructions (After Initial Run)
- ✅ **Code Reusability:** 
  - Use **components** (`Header`, `Footer`, `ExchangeList`) across different pages.
- ✅ **Routing Enhancement:** 
  - Add extra page routes like `/products`, `/contact` (optional but bonus points).
- ✅ **UI Improvements:**
  - Use icons properly.
  - Add minimal CSS animations if possible.
- ✅ **File Organization:** 
  - Keep components, pages, and assets in separate folders.
- ✅ **Professional Design:** 
  - Clean, organized, and responsive layout.

---

## 🚀 Running the Project

### To run your project locally:

```bash
npm run dev
```
_(for Vite projects)_

or

```bash
npm start
```
_(for Create React App projects)_

Your app will open at:
- `http://localhost:5173` (Vite)
- or `http://localhost:3000` (Create React App)

---

## 🎯 Reminders
- Double-check if:
  - The design matches the instructions.
  - Code is modular (separated into components).
  - The project runs without errors or warnings.
  - `index.css` has no extra default styles.
  - Packages (`react-router-dom`, `react-icons`) are installed.

---
