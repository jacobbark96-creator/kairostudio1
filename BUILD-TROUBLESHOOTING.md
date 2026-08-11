# Build Troubleshooting Guide

If you're getting "unable to submit build job" errors, follow these steps:

## 1. Install Dependencies

First, make sure all dependencies are installed:

```bash
npm install
```

This will install:
- react-router-dom (for routing)
- react & react-dom
- lucide-react (for icons)
- All other dependencies

## 2. Verify Build Locally

Test the build locally before deploying:

```bash
npm run build
```

If this fails, check the error messages and fix any issues.

## 3. Common Issues

### Missing Dependencies
- Error: "Cannot find module 'react-router-dom'"
- Solution: Run `npm install`

### TypeScript Errors
- Most TypeScript errors are warnings and won't prevent building
- The `import.meta.glob` type errors are handled by Vite automatically
- If build fails, check for actual syntax errors, not type warnings

### Image Path Issues
- If client image directories don't exist, the build will still work
- Images will just show placeholders until you add the actual images

## 4. Deployment Platforms

### Vercel
- Make sure `vercel.json` is in the root
- Build command: `npm run build`
- Output directory: `dist`

### Netlify
- Make sure `netlify.toml` and `public/_redirects` exist
- Build command: `npm run build`
- Publish directory: `dist`

## 5. Quick Fix Checklist

- [ ] Run `npm install` to install dependencies
- [ ] Run `npm run build` locally to test
- [ ] Check that all required files exist:
  - `package.json`
  - `vite.config.ts`
  - `tsconfig.json`
  - `src/vite-env.d.ts`
- [ ] Verify deployment config files exist:
  - `vercel.json` (for Vercel)
  - `netlify.toml` (for Netlify)
  - `public/_redirects` (for Netlify)

## 6. Still Having Issues?

Check the build logs from your deployment platform for specific error messages. The most common issue is missing dependencies - make sure `npm install` has been run.

