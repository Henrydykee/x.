import { execFileSync } from "child_process";

function run(command, args = []) {
  try {
    console.log(`🚀 Running: ${command} ${args.join(" ")}`);
    execFileSync(command, args, { stdio: "inherit" });
  } catch (error) {
    console.error(`❌ Error running ${command}:`, error.message);
    process.exit(1);
  }
}

function getDate() {
  const now = new Date();
  return now.toISOString().split("T")[0]; // e.g. 2025-11-13
}

function main() {
  const date = getDate();
  const commitMessage = `Daily commit (TypeScript) - ${date}`;

  // Ensure git is clean before committing
  run("git", ["config", "--global", "user.name", "GitHub Actions"]);
  run("git", ["config", "--global", "user.email", "actions@github.com"]);

  // Stage all changes
  run("git", ["add", "."]);

  try {
    // Commit with message (safe way — no shell interpolation)
    run("git", ["commit", "-m", commitMessage]);
  } catch (err) {
    console.log("⚠️ No changes to commit or commit failed:", err.message);
    return;
  }

  // Push changes
  run("git", ["push"]);
  console.log(`✅ Successfully committed and pushed changes for ${date}`);
}

main();
