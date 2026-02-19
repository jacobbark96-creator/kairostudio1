# Deployment Guide

This project uses React Router for client-side routing. Follow these steps to deploy:

## 1. Install Dependencies

```bash
npm install
```

## 2. Build the Project

```bash
npm run build
```

## 3. Deploy to Your Platform

### Vercel (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository in Vercel
3. Vercel will automatically detect the `vercel.json` configuration
4. Deploy!

The `vercel.json` file is already configured to handle SPA routing.

### Netlify

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository in Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Netlify will use the `netlify.toml` and `public/_redirects` files automatically

### Other Platforms

For other platforms, ensure that:
- All routes redirect to `/index.html` (for client-side routing)
- Static files are served from the `dist` folder after build
- The server returns `index.html` for any route that doesn't match a file

## Important Notes

- **React Router DOM**: Make sure `react-router-dom` is installed (`npm install`)
- **SPA Routing**: All deployment configs include redirect rules to handle client-side routing
- **Build Output**: The build output goes to the `dist` folder

## Troubleshooting

If deployments fail:
1. Check that `react-router-dom` is installed: `npm install`
2. Verify the build works locally: `npm run build`
3. Check your platform's build logs for specific errors
4. Ensure your deployment platform supports SPA routing (all configs are included)

