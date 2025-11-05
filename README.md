# Experiment

A simple project written in both Dart and TypeScript that automatically makes a commit every day to keep your GitHub activity graph active.

## Overview

This project contains two implementations:
- **Dart**: Updates `dart/timestamp.txt` daily
- **TypeScript**: Updates `typescript/timestamp.txt` daily

Both scripts run automatically via GitHub Actions every day at 00:00 UTC.

## Project Structure

```
.
├── dart/
│   ├── bin/
│   │   └── daily_commit.dart
│   ├── pubspec.yaml
│   └── timestamp.txt
├── typescript/
│   ├── src/
│   │   └── daily_commit.ts
│   ├── dist/
│   ├── package.json
│   ├── tsconfig.json
│   └── timestamp.txt
└── .github/
    └── workflows/
        └── daily-commit.yml
```

## Setup

### Prerequisites

- GitHub repository with Actions enabled
- Write permissions for GitHub Actions (enabled by default in most repositories)

### GitHub Actions Setup

1. **Push this repository to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Daily commit automation"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Enable GitHub Actions**
   - Go to your repository settings
   - Navigate to Actions → General
   - Ensure "Allow all actions and reusable workflows" is selected
   - Under "Workflow permissions", select "Read and write permissions"

3. **The workflow will run automatically**
   - Runs daily at 00:00 UTC
   - Can be manually triggered via the Actions tab → "Daily Commit" → "Run workflow"

### Local Testing

#### Dart

```bash
cd dart
dart pub get
dart bin/daily_commit.dart
```

#### TypeScript

```bash
cd typescript
npm install
npm run build
npm start
# Or use ts-node for development:
npm run dev
```

## How It Works

1. **Daily Schedule**: GitHub Actions triggers the workflow every day at 00:00 UTC
2. **Update Files**: Each script updates its respective `timestamp.txt` file with the current date/time
3. **Git Commit**: The changes are staged, committed with a descriptive message
4. **Push**: The commit is pushed to the repository, creating activity on your GitHub graph

## Customization

### Change Schedule

Edit `.github/workflows/daily-commit.yml` and modify the cron expression:

```yaml
schedule:
  - cron: '0 0 * * *'  # Daily at 00:00 UTC
```

Cron format: `minute hour day month day-of-week`

### Change Commit Messages

- **Dart**: Edit `dart/bin/daily_commit.dart`, line with `commitMessage`
- **TypeScript**: Edit `typescript/src/daily_commit.ts`, line with `commitMessage`

### Run Only One Implementation

Comment out the unwanted job in `.github/workflows/daily-commit.yml`:

```yaml
jobs:
  # dart-commit:
  #   ... (comment out this entire job)
  
  typescript-commit:
    ... (keep this one)
```

## Notes

- Both implementations run independently and will create separate commits
- If you want only one commit per day, comment out one of the jobs in the workflow
- The scripts handle the case where there's nothing to commit (e.g., if the workflow runs twice)
- GitHub Actions automatically has write permissions via `GITHUB_TOKEN` when configured correctly

## License

MIT

