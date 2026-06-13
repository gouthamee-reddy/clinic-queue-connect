# 🗂️ MiniGit

A lightweight, educational Git-like version control system built in Python. MiniGit replicates core Git concepts — object storage, staging, commits, and checkout — in a simple, readable codebase. It ships with three interfaces: a **CLI**, a **Flask web UI**, and a **Tkinter desktop GUI**.

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-Web%20UI-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## ✨ Features

- `init` — Initialize a new MiniGit repository
- `add` — Stage files for commit (blob object creation)
- `commit` — Save a snapshot of staged files with a message
- `log` — View the full commit history
- `checkout` — Restore files to any previous commit
- `status` — See which files are currently staged
- `diff` — Check whether a staged file has changed on disk
- Object storage with **zlib compression** and **SHA-256 hashing**
- Three interfaces: **CLI**, **Flask web app**, and **Tkinter GUI**

---

## 📁 Project Structure

```
minigit/
├── __init__.py        # Package marker
├── utils.py           # Constants and repo validation helper
├── objects.py         # Core object store (hash, compress, read)
├── index.py           # Staging area (add, status, diff)
├── repository.py      # Repo operations (init, commit, log, checkout)
├── main.py            # CLI entry point
├── app.py             # Flask web interface
└── ui.py              # Tkinter desktop GUI
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Flask (for the web interface)

```bash
pip install flask
```

### Installation

```bash
git clone https://github.com/your-username/minigit.git
cd minigit
```

---

## 💻 Usage

### Command Line Interface

```bash
# Initialize a repository in the current directory
python -m minigit.main init

# Stage a file
python -m minigit.main add hello.txt

# Commit staged files
python -m minigit.main commit "Initial commit"

# View commit history
python -m minigit.main log

# Check staged files
python -m minigit.main status

# Compare staged file with current version on disk
python -m minigit.main diff hello.txt

# Restore files to a previous commit
python -m minigit.main checkout <commit-hash>
```

### Flask Web Interface

```bash
python -m minigit.app
# Then open http://127.0.0.1:5000 in your browser
```

### Tkinter Desktop GUI

```bash
python -m minigit.ui
```

A native desktop window will launch with buttons for all core operations.

---

## 🔍 How It Works

MiniGit mirrors Git's internal architecture at a simplified level:

| Concept | MiniGit Implementation |
|---|---|
| Object store | `.minigit/objects/` — files stored as zlib-compressed, SHA-256-hashed blobs |
| Blob | Binary content of a staged file |
| Tree | JSON mapping of filenames → blob hashes |
| Commit | JSON object with tree hash, parent hash, message, and timestamp |
| Index | `.minigit/index` — JSON staging area |
| HEAD | `.minigit/HEAD` — points to the latest commit hash |

Every `add` creates a **blob** object. Every `commit` creates a **tree** (snapshot of the index) and a **commit** object that references that tree and its parent commit.

---

## ⚠️ Limitations

MiniGit is an **educational project**, not a production VCS. It does not support:

- Branches or merging
- Remote repositories
- `.minigitignore` patterns
- Binary diff / line-level diffing
- Conflict resolution

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or pull requests.

```bash
# 1. Fork and clone the repo, then create your branch
git checkout -b feature/my-feature

# 2. Make your changes and commit
git commit -m "Add my feature"

# 3. Push and open a Pull Request
git push origin feature/my-feature
```

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

> Built to learn how Git works under the hood. Inspired by [Write Yourself a Git](https://wyag.thb.lt/).
