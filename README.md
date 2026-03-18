# The Folio

A human-curated magazine at the intersection of biology, computer science, and mathematics. No AI-generated content — every piece is written or selected by hand.

---

## Contributing

We welcome contributions from anyone who thinks across disciplines. You can write a new piece, fix a typo, improve the site, or suggest a reading path.

### Writing a new piece

Every piece lives in its own folder under `content/pieces/`:

```
content/pieces/your-piece-slug/
  index.md          # your article (markdown + frontmatter)
  assets/           # images used in the article
    diagram.png
    photo.jpg
```

#### Step 1: Create the folder

Pick a slug (lowercase, hyphens, descriptive):

```bash
mkdir -p content/pieces/your-piece-slug/assets
```

#### Step 2: Write the frontmatter

Every `index.md` starts with YAML frontmatter:

```yaml
---
title: "Your Piece Title"
author: Your Name
lens: foundations
threads:
  - algorithms
  - sequence-analysis
issue: 1
date: "2026-03-18"
difficulty: beginner
time: "12 min read"
description: "A one-sentence summary that appears on cards and in search."
youtube: "https://www.youtube.com/watch?v=..."  # optional
resources:                                       # optional
  - label: "Source Code"
    url: "https://github.com/user/repo"
  - label: "Dataset"
    url: "https://kaggle.com/datasets/example"
  - label: "Companion Video"
    url: "https://www.youtube.com/watch?v=abc"
---
```

**Required fields:**

| Field | Description |
|-------|-------------|
| `title` | The full title of your piece |
| `author` | Your name |
| `lens` | One of the lens types (see below) |
| `threads` | List of topic threads this piece belongs to |
| `issue` | Issue number this piece belongs to |
| `date` | Publication date (YYYY-MM-DD) |
| `difficulty` | `beginner`, `intermediate`, or `advanced` |
| `time` | Estimated reading time (e.g. `"15 min read"`) |
| `description` | Short summary for cards and SEO |

**Optional fields:**

| Field | Description |
|-------|-------------|
| `youtube` | Link to a companion YouTube video |
| `source_url` | Link to the original source if curated |
| `resources` | List of resource links (see below) |

#### Step 3: Write your content

Write standard markdown after the frontmatter. The site supports:

- GitHub Flavored Markdown (tables, strikethrough, etc.)
- LaTeX math via KaTeX (`$inline$` and `$$display$$`)
- Syntax-highlighted code blocks (all major languages)
- Callouts (see below)
- Images (see below)

### Resource links

You can attach external resources to any piece — code repos, datasets, videos, papers, slides, notebooks, or any URL. They render as a horizontal strip of auto-themed chips at the top of the article.

Add a `resources` list to your frontmatter:

```yaml
resources:
  - label: "Source Code"
    url: "https://github.com/user/repo"
  - label: "Dataset on Kaggle"
    url: "https://kaggle.com/datasets/example"
  - label: "Watch on YouTube"
    url: "https://www.youtube.com/watch?v=abc"
  - label: "Original Paper"
    url: "https://arxiv.org/abs/1234.5678"
  - label: "Run in Colab"
    url: "https://colab.research.google.com/..."
  - label: "Slide Deck"
    url: "https://example.com/slides.pdf"
    type: slides
```

Each resource has:

| Field | Required | Description |
|-------|----------|-------------|
| `label` | Yes | Display text for the chip |
| `url` | Yes | Link URL |
| `type` | No | Override auto-detection (see types below) |

**Auto-detected types** (based on URL — you usually don't need to set `type` manually):

| Type | Detected from |
|------|--------------|
| `youtube` | youtube.com, youtu.be |
| `github` | github.com |
| `drive` | drive.google.com, docs.google.com |
| `kaggle` | kaggle.com |
| `colab` | colab.research.google.com |
| `paper` | arxiv.org, doi.org, pubmed, .pdf files |
| `dataset` | huggingface.co |
| `notebook` | .ipynb files |
| `download` | .zip, .tar.gz, .csv files |
| `website` | everything else |

You can also set `type` manually to: `slides`, `code`, `notebook`, `dataset`, or `download` when auto-detection doesn't match.

### Images

Place images in the `assets/` folder next to your `index.md`. Reference them with relative paths:

```md
![Description of the image](./assets/my-diagram.png)
```

All of these formats work:

```md
![alt](./assets/photo.png)
![alt](assets/photo.png)
![alt](./images/photo.png)
![alt](photo.png)
```

Images are automatically copied to the public directory at build time. You don't need to touch the `public/` folder.

### Callouts

Callouts highlight important information. Use the `<Callout>` tag in your markdown:

```md
<Callout type="key">

This is the important thing you should remember.

</Callout>
```

Leave a blank line after the opening tag and before the closing tag so the markdown inside gets parsed correctly.

**Available callout types:**

| Type | Label | Use for |
|------|-------|---------|
| `key` | Key Insight | The core takeaway |
| `connection` | Cross-Field Connection | When something bridges disciplines |
| `think` | Pause & Think | Invite the reader to reflect |
| `warning` | Watch Out | Common mistakes or gotchas |
| `note` | Note | Supplementary information |
| `definition` | Definition | Formal definitions |
| `success` | Success | Positive outcomes or correct approaches |

You can also use the extended HTML syntax for callouts with custom titles:

```html
<div class="callout callout-definition">
  <div class="callout-icon">📖</div>
  <div class="callout-content">
    <div class="callout-title">Your Custom Title</div>
    <p>Your content here.</p>
  </div>
</div>
```

### Code blocks

Use fenced code blocks with a language identifier. Syntax highlighting is automatic:

````md
```python
def hello():
    print("Hello from The Folio")
```
````

Supported languages include Python, JavaScript, TypeScript, Rust, Go, Java, C, C++, Bash, SQL, R, and many more.

### Math

Inline math: `$E = mc^2$`

Display math:

```md
$$
\sum_{i=1}^{n} x_i = x_1 + x_2 + \cdots + x_n
$$
```

---

## Lenses

Every piece is categorized by a "lens" — the type of content it is:

| Lens | Description |
|------|-------------|
| `foundations` | The building blocks, explained well |
| `deep-dive` | Long-form explorations of a single topic |
| `connections` | Pieces that bridge two or more fields |
| `tools-craft` | Practical walkthroughs, workflows, real usage |
| `papers-classics` | Annotated readings of important papers |
| `visual-explainers` | Diagram-heavy pieces where the visual is the explanation |

## Threads

Threads are topic tags (e.g. `algorithms`, `sequence-analysis`, `probability`). A piece can belong to multiple threads. Threads are defined in `content/threads.yaml`:

```yaml
threads:
  - id: your-thread-id
    name: Your Thread Name
    description: What this thread covers
```

## Issues

Content is published in issues — curated collections defined in `content/issues/`. Each issue is a YAML file:

```yaml
# content/issues/002.yaml
number: 2
title: "Issue Title"
date: "2026-04-01"
editorial: >
  A paragraph introducing this issue and what ties the pieces together.
pieces:
  - piece-slug-one
  - piece-slug-two
  - piece-slug-three
```

## Reading paths

Reading paths are guided sequences through multiple pieces. Defined in `content/paths.yaml`:

```yaml
paths:
  - id: path-slug
    title: "Path Title"
    description: "What this path covers and who it's for."
    pieces:
      - first-piece-slug
      - second-piece-slug
      - third-piece-slug
```

---

## Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
git clone https://github.com/mahmoudxyz/folio.git
cd folio
npm install
npm run dev
```

The site runs at `http://localhost:3000`.

### Project structure

```
content/
  issues/          # Issue YAML files (001.yaml, 002.yaml, ...)
  pieces/          # Article folders (slug/index.md + slug/assets/)
  threads.yaml     # Thread definitions
  paths.yaml       # Reading path definitions
src/
  app/             # Next.js pages and layouts
  components/      # Reusable React components
  lib/
    content.ts     # Content loading and querying
    markdown.ts    # Markdown rendering pipeline
public/            # Static assets (logo, etc.)
```

### Build

```bash
npm run build
```

Piece images are automatically copied from `content/pieces/<slug>/assets/` to `public/content/<slug>/` during build.

### Deploy

Deploy anywhere that supports Next.js static export, or use Vercel:

```bash
npx vercel
```

---

## Content guidelines

- **No AI-generated content.** Every piece must be written or carefully curated by a human.
- Write for someone who is smart but unfamiliar with your specific subfield.
- Explain the "why" before the "how."
- Use callouts to highlight key insights and cross-field connections.
- Include diagrams and visuals when they help — a good diagram beats three paragraphs.
- Cite your sources. Link to papers, books, and original implementations.
- Keep code examples minimal and purposeful — show the concept, not the boilerplate.

## License

MIT
