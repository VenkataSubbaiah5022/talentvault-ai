# TalentVault AI

A talent pool search app for recruiters. Upload resumes (PDF/DOCX), extract skills and experience with AI, and search your candidate vault instantly.

**Live demo:** [https://talentvaultz-ai.vercel.app/](https://talentvaultz-ai.vercel.app/)

**Repository:** [github.com/VenkataSubbaiah5022/talentvault-ai](https://github.com/VenkataSubbaiah5022/talentvault-ai)

---

## What it does

1. **Upload** — Drop PDF or Word resumes; files are stored in Supabase and queued for processing.
2. **Extract** — Contact details are parsed locally with regex. PII is scrubbed before any text is sent to Gemini. Skills, experience, job title, location, and a short summary are saved to Postgres.
3. **Search** — Filter and search completed profiles in card or table view. Export your vault as CSV from Settings.

No login is required — this is a single-workspace demo built for the assignment scope.

---

## Features

| Area                     | Details                                                         |
| ------------------------ | --------------------------------------------------------------- |
| **Upload Resumes** | Drag-and-drop, batch queue, live status, free-tier quota banner |
| **Search Talent**  | Card grid, filters, slide-out profile drawer                    |
| **All Candidates** | Sortable table, inline detail panel, bulk delete                |
| **Dashboard**      | Vault stats, processing pipeline, top skills & locations        |
| **Settings**       | Search defaults, auto-process toggle, CSV export, theme         |

**Privacy:** Emails, phones, LinkedIn, and GitHub are **never** sent to the AI model — only scrubbed resume text is.

**Free API limits:** The demo runs on the [Gemini free tier](https://ai.google.dev/gemini-api/docs/rate-limits). The UI enforces **5 resumes per upload** and **20 AI extractions per day** so reviewers can see this is a capacity-limited demo, not unlimited bulk processing.

---

## Tech stack

| Layer        | Choice                                          |
| ------------ | ----------------------------------------------- |
| Framework    | Next.js 16 (App Router, TypeScript)             |
| UI           | Tailwind CSS, shadcn/ui                         |
| Database     | Supabase Postgres                               |
| File storage | Supabase Storage (`resumes` bucket)           |
| AI           | Google Gemini (`gemini-2.0-flash`, free tier) |
| Deploy       | Vercel                                          |

### Why Gemini?

Free tier via [Google AI Studio](https://aistudio.google.com/apikey), fast JSON extraction for structured resume fields, and a clear upgrade path for production. If the API is rate-limited, the app falls back to local regex-based parsing so uploads still complete.

---

## Run locally

### Prerequisites

- **Node.js 20+**
- **npm**
- A [Supabase](https://supabase.com) project
- A [Gemini API key](https://aistudio.google.com/apikey)

### 1. Clone and install

```bash
git clone https://github.com/VenkataSubbaiah5022/talentvault-ai.git
cd talentvault-ai
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run:

   ```
   supabase/migrations/001_candidates.sql
   ```
3. Create the **Storage** bucket (uploads fail without this):

   - **UI:** Dashboard → **Storage** → **New bucket** → Name: `resumes` → Private → Create
   - **SQL:** Run `supabase/migrations/002_storage_bucket.sql`
4. From **Project Settings → API**, copy:

   - Project URL
   - `anon` public key
   - `service_role` secret key (server-side only — never expose in the browser)

### 3. Environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional — defaults to gemini-2.0-flash
# GEMINI_MODEL=gemini-2.0-flash
```

| Variable                          | Required | Purpose                             |
| --------------------------------- | -------- | ----------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Yes      | Supabase project URL                |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes      | Client-side Supabase access         |
| `SUPABASE_SERVICE_ROLE_KEY`     | Yes      | Server uploads, processing, deletes |
| `GEMINI_API_KEY`                | Yes      | Resume field extraction             |
| `NEXT_PUBLIC_APP_URL`           | Yes      | Base URL for server-side fetches    |
| `GEMINI_MODEL`                  | No       | Override Gemini model ID            |

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Verify setup (optional)

```bash
npm run build    # production build check
curl http://localhost:3000/api/health
```

### 6. Generate test resumes (optional)

```bash
npm run generate:test-data
```

This creates 30 sample PDF/DOCX files in `test-data/resumes/`. Upload them in batches of **up to 5** to stay within the free API limits (e.g. 4 uploads × 5 files = 20/day).

---

## App routes

| Route              | Description                           |
| ------------------ | ------------------------------------- |
| `/`              | Dashboard                             |
| `/upload`        | Upload resumes, processing queue      |
| `/search-talent` | Card search with drawer               |
| `/candidates`    | Table view with inline detail panel   |
| `/settings`      | Preferences, export, vault management |

---

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
Full profile stored in Supabase Postgres + file in Storage
```

Contact details are extracted and stored locally. Only anonymized text reaches the AI.

---

## Deploy to Vercel

The live demo is deployed at [talentvaultz-ai.vercel.app](https://talentvaultz-ai.vercel.app/).

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Add all environment variables from `.env.example`.
4. Set `NEXT_PUBLIC_APP_URL` to your Vercel URL (e.g. `https://talentvaultz-ai.vercel.app`).
5. Deploy.

Supabase and Gemini keys are configured as Vercel environment variables — not committed to the repo.

---

## Project structure

```
src/
├── app/                    # Pages and API routes
│   ├── api/upload/         # File upload + daily limits
│   ├── api/process/[id]/   # Resume processing
│   └── api/candidates/     # CRUD + resume download
├── components/
│   ├── upload/             # Drop zone, queue table, quota banner
│   ├── search-talent/      # Card grid + drawer
│   ├── candidates/         # Table + detail panel
│   └── settings/           # Recruiter preferences
├── lib/
│   ├── ai/                 # Gemini client + quota handling
│   ├── extract/            # PDF/DOCX, PII scrub, contact regex
│   ├── process/            # Processing pipeline + client queue
│   └── upload/             # Free-tier limit enforcement
└── types/
supabase/migrations/        # Database + storage setup
test-data/resumes/          # Generated sample resumes
scripts/                    # Test data generator
```

---

## Scripts

| Command                        | Description                |
| ------------------------------ | -------------------------- |
| `npm run dev`                | Start development server   |
| `npm run build`              | Production build           |
| `npm run start`              | Run production server      |
| `npm run lint`               | ESLint                     |
| `npm run generate:test-data` | Generate 30 sample resumes |

---

## Troubleshooting

| Issue                                | Fix                                                                                           |
| ------------------------------------ | --------------------------------------------------------------------------------------------- |
| Upload fails with "bucket not found" | Create the `resumes` bucket in Supabase Storage (see setup step 2)                          |
| Processing fails immediately         | Check `GEMINI_API_KEY` in `.env.local`; confirm the key is active in AI Studio            |
| "Daily AI limit reached"             | Free tier allows 20 extractions/day (resets UTC midnight). Upload in smaller batches tomorrow |
| `SUPABASE_SERVICE_ROLE_KEY` error  | Add the service role key — required for server-side storage and DB writes                    |

---

## If this were a real product

- Multi-tenant auth and org workspaces
- Duplicate candidate detection (email hash)
- Semantic skill search with embeddings
- ATS integrations and webhook exports
- Dedicated processing queue (Redis / worker) for high volume

---

## License

MIT
