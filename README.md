# 🧠 VibeCheck CLI

_"Check yourself before you vibe code yourself."_

A real-time checkpoint layer that intercepts every AI agent decision, translates it to plain English, and asks for your approval before anything executes.

## 🎯 The Problem

Hundreds of millions of people are vibe coding in 2026. AI agents make hundreds of decisions per session — restructuring files, adding dependencies, modifying databases, touching secrets — without ever asking. Students and beginners ship applications they don't understand, can't maintain, and can't fix when they break.

No free, simple, open source tool exists to give them visibility and control. **VibeCheck** is that tool.

![VibeCheck Demo](https://via.placeholder.com/600x300.png?text=VibeCheck+Demo+GIF) _(Imagine a GIF showing VibeCheck intercepting a CRITICAL decision to drop a database table)_

## 🚀 Installation

Install globally using npm:

```bash
npm install -g @harshalpatel2868/vibe-check
```

_Zero AI dependencies. No API keys. No internet required. Works offline forever._

## 💻 Quick Start

Navigate to your project folder and start the watcher:

```bash
cd your-project
vibecheck start
```

Now, just leave this terminal open and go write code with your favorite AI agent (Claude Code, Cursor, Copilot, etc.). Every time the AI tries to make a change, VibeCheck intercepts it!

## 🛠️ Commands

| Command                     | Description                                                  |
| --------------------------- | ------------------------------------------------------------ |
| `vibecheck start`           | Starts watching the current directory for AI changes         |
| `vibecheck log`             | Shows a color-coded log of all decisions (approved/rejected) |
| `vibecheck log --today`     | Shows logs only from today's session                         |
| `vibecheck log --rejected`  | Shows only the changes you rejected                          |
| `vibecheck summary`         | Generates a clean session summary of what the AI built       |
| `vibecheck rollback <id>`   | Rolls back a specific decision by ID                         |
| `vibecheck rollback --last` | Undoes the last approved decision                            |

## ⚙️ Configuration

VibeCheck creates a `.vibecheck/config.json` file in your project root. You can customize the behavior here:

```json
{
  "autoApproveThreshold": ["INFO", "LOW"],
  "ignoredPatterns": [],
  "severityOverrides": {}
}
```

You can also create a `.vibecheckignore` file (like `.gitignore`) in your root directory to ignore specific files or folders.

## 🧩 The Pattern Library

VibeCheck works by matching simple and complex changes against a known library of patterns.

**Severities:**

- **INFO** / **LOW**: Auto-approved (like adding comments or simple functions)
- **MEDIUM**: Pauses and prompts (like adding dependencies or using `localStorage`)
- **HIGH**: Pauses and warns (like touching API keys or `md5` hashing)
- **DANGER** / **CRITICAL**: Sirens blaring (like dropping tables or deleting secure data)

### Contributing new patterns

Want to add patterns for a specific framework? It's simple! Check out the `src/patterns/` directory.

Example `src/patterns/general.js` addition:

```javascript
{
  match: /app\.listen\(/,
  severity: 'LOW',
  message: "AI is starting a web server"
}
```

## 📜 License

**Copyright © 2026 Harshal Patel. All Rights Reserved.**

This software is **proprietary** and not open source. Unauthorized copying, modification, or distribution is strictly prohibited. You are granted a license to install and use the CLI tool as provided via npm, but the underlying source code and intellectual property remain exclusively with the author.

For enterprise licensing or permission, please contact the author directly.
