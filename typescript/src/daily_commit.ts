import { writeFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { join, resolve } from 'path';

function findRepoRoot(): string {
  let current = process.cwd();
  const root = resolve('/');
  
  while (current !== root) {
    if (existsSync(join(current, '.git')) || existsSync(join(current, 'README.md'))) {
      return current;
    }
    current = resolve(current, '..');
  }
  
  // Fallback to current directory
  return process.cwd();
}

function runGitCommand(command: string[], repoRoot: string): void {
  try {
    execSync(`git ${command.join(' ')}`, { 
      stdio: 'inherit',
      cwd: repoRoot
    });
  } catch (error: any) {
    const errorMessage = error.message || error.toString();
    const errorOutput = error.stdout?.toString() || error.stderr?.toString() || errorMessage;
    const errorLower = errorOutput.toLowerCase();
    
    // Check for acceptable "nothing to commit" scenarios
    const isNothingToCommit = errorLower.includes('nothing to commit') ||
      errorLower.includes('working tree clean') ||
      errorLower.includes('nothing added to commit');
    
    if (!isNothingToCommit) {
      throw error;
    }
  }
}

function main(): void {
  try {
    const repoRoot = findRepoRoot();
    
    // Update the timestamp file
    const now = new Date();
    const timestamp = now.toISOString();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    const timestampPath = join(repoRoot, 'typescript', 'timestamp.txt');
    const content = `Last updated: ${timestamp}\nDate: ${dateStr}\n`;
    writeFileSync(timestampPath, content);
    
    console.log(`✅ Updated timestamp.txt: ${timestamp}`);
    
    // Configure git (if not already configured)
    runGitCommand(['config', 'user.name', 'GitHub Actions'], repoRoot);
    runGitCommand(['config', 'user.email', 'actions@github.com'], repoRoot);
    
    // Stage the file
    runGitCommand(['add', 'typescript/timestamp.txt'], repoRoot);
    console.log('✅ Staged typescript/timestamp.txt');
    
    // Commit the change
    const commitMessage = `Daily commit (TypeScript) - ${dateStr}`;
    runGitCommand(['commit', '-m', commitMessage], repoRoot);
    console.log(`✅ Committed changes: ${commitMessage}`);
    
    // Push to repository
    runGitCommand(['push'], repoRoot);
    console.log('✅ Pushed changes to repository');
    
    console.log('\n🎉 Daily commit completed successfully!');
  } catch (error: any) {
    console.error('❌ Error:', error.message || error);
    process.exit(1);
  }
}

main();

