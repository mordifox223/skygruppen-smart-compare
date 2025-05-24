
# GitHub Pages Deployment Guide

This project is configured to deploy to GitHub Pages as a project page.

## Deployment URL
Your site will be available at: `https://mordifox223.github.io/skygruppen-smart-compare/`

## Quick Deployment

### Option 1: Using npm script
```bash
npm run deploy
```

### Option 2: Using the deployment script
```bash
node deploy.js
```

### Option 3: Using shell script (Unix/Linux/Mac)
```bash
chmod +x deploy.sh
./deploy.sh
```

## Manual Deployment Steps

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to gh-pages branch:**
   ```bash
   npx gh-pages -d dist
   ```

## Enable GitHub Pages

After your first deployment, you need to enable GitHub Pages in your repository:

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **Deploy from a branch**
5. Choose **gh-pages** branch and **/ (root)** folder
6. Click **Save**

## Configuration Details

- **Base Path**: `/skygruppen-smart-compare/` (automatically set for production)
- **Build Output**: `dist/` folder
- **Deployment Branch**: `gh-pages`
- **Build Tool**: Vite with React

## Troubleshooting

### Common Issues:

1. **404 errors**: Make sure the base path in `vite.config.ts` matches your repository name
2. **Blank page**: Check browser console for errors related to asset loading
3. **Build fails**: Ensure all dependencies are installed with `npm install`

### Verify Deployment:
- Check the `gh-pages` branch exists in your repository
- Verify GitHub Pages is enabled in repository settings
- Wait 5-10 minutes for changes to propagate

## Development vs Production

- **Development**: Base path is `/` for local development
- **Production**: Base path is `/skygruppen-smart-compare/` for GitHub Pages

The configuration automatically detects the environment and uses the correct base path.
