
#!/bin/bash

echo "🚀 Starting deployment to GitHub Pages..."

# Build the project
echo "📦 Building the project..."
npm run build

# Deploy to gh-pages branch
echo "🌐 Deploying to GitHub Pages..."
npx gh-pages -d dist

echo "✅ Deployment completed successfully!"
echo "🔗 Your site will be available at: https://mordifox223.github.io/skygruppen-smart-compare/"
