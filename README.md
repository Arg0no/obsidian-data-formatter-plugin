# Data Formatter

> Export your Obsidian notes as a single structured JSON file — ready to consume in any web project.

---

## What it does

Data Formatter scans your vault for notes marked with `publish: true` in their frontmatter and bundles them into a single JSON file at a destination of your choice. Every exported note includes its full frontmatter and content, making it easy to power blogs, portfolios, documentation sites, or any custom web app with your Obsidian knowledge base.

---

## Features

- ✅ Selective export via `publish: true` frontmatter property
- ✅ Full frontmatter included in each exported note
- ✅ Full note content exported in Markdown and HTML
- ✅ All publishable notes compiled into a single JSON file
- ✅ Configurable output destination via the plugin settings tab

---

## Usage

### 1. Mark notes for export

Add `publish: true` to any note's frontmatter:

```yaml
---
title: My Article
date: 2024-06-01
tags: [web, obsidian]
publish: true
---

Your note content here.
```

Notes **without** `publish: true` (or with `publish: false`) are ignored entirely.

### 2. Set the output destination

Go to **Settings → Data Formatter** and set the **Output path** — either an absolute path on your system or a path relative to your vault root.

Example:
```
/Users/you/my-website/src/data/notes.json
```

### 3. Run the export

Open the Command Palette (`Ctrl/Cmd + P`) and run:

```
Data Formatter: Export notes to JSON
```

Your `notes.json` file will be created (or overwritten) at the configured destination.

---

## Output format

The plugin generates a single JSON file containing an array of note objects. Each object includes all frontmatter fields plus the raw note content.

```json
{
    "lastUpdated":"AAAA-MM-DD",
    "count":1,
    "notes": [
        {
            "id":"slugified basename",
            "title":"basename",
            "wordCount":568,
            "contentMD": "your content in md",
            "contentHTML": "your content in html",
            "properties": {
				your frontmatter 
            },
            "links": [
                your links
            ],
            "lastUpdated":"AAAA-MM-DD"
        }
    ]
}
```

The `content` field holds the full Markdown body of the note (everything below the frontmatter block).

---

## Settings

| Setting | Description | Default |
|---|---|---|
| **Output path** | Absolute or vault-relative path where `notes.json` will be written | *(empty — must be set)* |

---

## Limitations

This is an initial release. The following are **not yet supported**:

- **Images and attachments** — embedded images or files are not exported or referenced in the JSON output.
- **Callouts** — Obsidian callout blocks (e.g. `> [!note]`) are exported as raw Markdown text, without any special parsing or transformation.
- **Tags** — inline tags (e.g. `#mytag` in the body) are not extracted or normalised; only frontmatter fields are included.
- **Incremental export** — every export is a full rebuild; only changed notes are not selectively updated.

---
