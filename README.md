# TalentVault AI

A talent pool search app for recruiters. Upload resumes (PDF/DOCX), extract skills and experience with AI, and search your candidate vault instantly.

**Live URL:** _(add after Vercel deploy)_

## Features

- **Multi-file upload** — PDF and Word resumes, batch processing with live progress
- **PII-safe AI extraction** — contact details extracted via regex; emails, phones, LinkedIn, and GitHub scrubbed before Gemini sees any text
- **Structured profiles** — skills, years of experience, job title, location, resume summary
- **Search & filter** — global search, skill/location/experience filters, card/table views
- **Candidate drawer** — full profile with contact chips and skill tags
- **Dashboard analytics** — total candidates, avg experience, top skill, top location

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router, TypeScript) |
| UI | Tailwind CSS, shadcn/ui |
| Database | Supabase Postgres |
| File storage | Supabase Storage |
| AI | Gemini 2.5 Flash |
| Deploy | Vercel |

### Why Gemini 2.5 Flash?

Free tier via Google AI Studio, fast response times for batch resume parsing, and native JSON output for reliable structured extraction. PII is scrubbed locally before any API call.

## Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd talentvault-ai
npm install
```

### 2. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/migrations/001_candidates.sql` in the SQL Editor
3. Create a Storage bucket named **`resumes`** (private is fine; service role accesses it)
4. Copy project URL and keys

### 3. Gemini API key

Get a key from [Google AI Studio](https://aistudio.google.com/apikey)

### 4. Environment variables

```bash
cp .env.example .env.local
```

Fill in:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Generate test resumes (optional)

```bash
npm run generate:test-data
```

Upload files from `test-data/resumes/` — 30 varied resumes across engineers, designers, PMs, sales, and operations.

## PII handling

```
Raw resume text
    ↓
Regex extracts: name, email, phone, LinkedIn, GitHub
    ↓
PII scrubbed → [EMAIL], [PHONE], [LINKEDIN], [GITHUB]
    ↓
Scrubbed text sent to Gemini (skills, experience, title, location, summary)
    ↓
Everything stored in Supabase
```

Contact details are **never** sent to the AI model.

## Deploy (Vercel)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all env vars from `.env.example`
4. Set `NEXT_PUBLIC_APP_URL` to your production URL
5. Deploy

## Project structure

```
src/
├── app/              # Pages and API routes
├── components/       # UI components
├── lib/
│   ├── ai/           # Gemini client
│   ├── extract/      # PDF/DOCX, PII, contact regex
│   ├── process/      # Resume processing pipeline
│   └── search/       # Candidate filtering
└── types/
test-data/resumes/    # Generated sample resumes
```

## If this were a real product

- Multi-tenant auth and org workspaces
- Duplicate candidate detection (email hash)
- Semantic skill search with embeddings
- Resume preview and original file download
- ATS integrations and export
- Re-parse queue when AI models improve

## License

MIT
