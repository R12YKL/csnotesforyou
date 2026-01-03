# CS Notes For You — Local Dev

Run the local development server (Node) to serve the `public/` folder and API endpoints.

Install dependencies and start:

```powershell
npm install
npm start
```

Open http://localhost:3000 in your browser.

API endpoints:
- `GET /api/posts` — returns `public/data/posts.json`
- `POST /api/upload` — multipart form upload (file field `file`, string fields `title`, `author`, `type`, `excerpt`)

Deploying to Vercel (static site)

1. Create a GitHub repository and push this project.
2. In Vercel, import the GitHub repo and set the project root to the repository root.
3. In Vercel Project Settings -> General, set the "Output Directory" to `public` (or let Vercel use the included `vercel.json`).
4. Deploy — Vercel will serve the files from `public/`.

Notes about uploads and API on Vercel
- Vercel serverless functions have ephemeral filesystem storage — writing files to `public/uploads` at runtime will not persist across deployments or cold-starts.
- Options to enable contributor uploads when hosting on Vercel:
	- Use external storage (recommended): Supabase Storage, Amazon S3, Cloudinary, or Firebase Storage. Serverless functions can upload files to those services.
	- Use a GitHub-based workflow: contributors create PRs to add files and posts to `public/data/posts.json`.
	- Host a separate backend (Heroku, Render, DigitalOcean) that stores uploaded files, and call it from the Vercel frontend.

If you want, I can implement one of these upload flows (Supabase or Cloudinary are quick to wire up). Which option would you like me to implement?
