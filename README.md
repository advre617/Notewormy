# 🪶 Notewormy. Minimalistic Markdown notepad.
[![Node.JS](https://img.shields.io/badge/nodejs->v22.14.0-blue.svg)](https://nodejs.org/en/blog/release/v22.14.0) [![Node.JS](https://img.shields.io/badge/Status-Developing-green.svg)]() 

A modern and as minimalistic as possible web application for keeping records of all kinds, using Markdown to format these records in a convenient format. It is designed for those who appreciate a clean borderless interface and maximum focus on content. The application runs completely client-side and does not require connection to any server. All your notes are stored in your browser's `localStorage`.

![image](https://github.com/user-attachments/assets/28284cf4-d9ac-4432-a4f3-60cbc02d119a)

> Markdown note-taking app built with [React](https://react.dev) and [MDXEditor](https://mdxeditor.dev/).
> Minimalist. Functional. User-friendly.

---

## Main Features

- Rich Markdown editing via **MDXEditor**
- All notes saved to `localStorage`
- Multiple note support with user-created titles and descriptions
- Beautiful dark-themed UI
- Undo/redo, lists, tables, code blocks, images, quotes, and more
- Fully client-side — your notes stay private


## Tech Stack

- **React** + Hooks (`useState`, `useEffect`, `useCallback`)
- **MDXEditor** plugins:  
  `headings`, `lists`, `quote`, `codeBlock`, `toolbar`, `image`, `link`, and more
- **Tailwind CSS**
- **React Icons** (`react-icons/fa`, `react-icons/md`)
- Local storage for persistence


## Installation

1. Clone the repository

```bash
  cd my-project
```

2. Install dependencies

```bash
  npm install
```

or 

```bash
  yarn add
```

## How to run application in _dev_ mode?

1. Start the application in dev mode

```bash
  npm run dev
```

or 

```bash
  yarn dev
```

## How to run application in _preview_ mode?

1. Build the application

```bash
  npm run build
```

or 

```bash
  yarn build
```

2. Start the application in preview mode

```bash
  npm run preview
```

or 

```bash
  yarn preview
```

Done! Go to http://localhost:5173 **(DEV)** or http://localhost:4173 **(PREVIEW)** and you can start using the application locally!

## Author

- [@advre617 (Nikita Rulevics)](https://github.com/advre617)
