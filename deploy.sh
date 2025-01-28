#!/bin/bash

# Check if current branch is "Main"
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "Error: Not on Main branch. Aborting deployment."
  exit 1
fi

# Get custom commit message
COMMIT_MESSAGE="Auto-deploy: Production build"
while getopts ":m:" opt; do
  case $opt in
    m)
      COMMIT_MESSAGE="$OPTARG"
      ;;
    \?)
      echo "Usage: $0 [-m custom_commit_message]"
      exit 1
      ;;
  esac
done

# Build the project
echo "Starting build..."
if bun run build; then
  echo "Build successful!"
  
  # Push to GitHub
  echo "Pushing changes to GitHub..."
  git add .
  git commit -m "$COMMIT_MESSAGE"
  git push origin Main
  
  echo "Deployment complete!"
else
  echo "Build failed. Dumping stack trace:"
  # If build fails, show the error
  bun run build
  exit 1
fi
