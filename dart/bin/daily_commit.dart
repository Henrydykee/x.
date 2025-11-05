import 'dart:io';

String _findRepoRoot() {
  Directory current = Directory.current;
  while (current.path != current.parent.path) {
    final gitDir = Directory('${current.path}${Platform.pathSeparator}.git');
    final readmeFile = File('${current.path}${Platform.pathSeparator}README.md');
    if (gitDir.existsSync() || readmeFile.existsSync()) {
      return current.path;
    }
    current = current.parent;
  }
  // Fallback to current directory
  return Directory.current.path;
}

void main() async {
  try {
    // Find repository root
    final repoRoot = _findRepoRoot();
    Directory.current = Directory(repoRoot);
    
    // Update the timestamp file
    final now = DateTime.now();
    final timestamp = now.toIso8601String();
    final dateStr = '${now.year}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}';
    
    final timestampPath = '$repoRoot${Platform.pathSeparator}dart${Platform.pathSeparator}timestamp.txt';
    final file = File(timestampPath);
    await file.writeAsString('Last updated: $timestamp\nDate: $dateStr\n');
    
    print('✅ Updated timestamp.txt: $timestamp');
    
    // Configure git (if not already configured)
    await _runGitCommand(['config', 'user.name', 'GitHub Actions']);
    await _runGitCommand(['config', 'user.email', 'actions@github.com']);
    
    // Stage the file
    await _runGitCommand(['add', 'dart/timestamp.txt']);
    print('✅ Staged dart/timestamp.txt');
    
    // Commit the change
    final commitMessage = 'Daily commit (Dart) - $dateStr';
    await _runGitCommand(['commit', '-m', commitMessage]);
    print('✅ Committed changes: $commitMessage');
    
    // Push to repository
    await _runGitCommand(['push']);
    print('✅ Pushed changes to repository');
    
    print('\n🎉 Daily commit completed successfully!');
  } catch (e) {
    print('❌ Error: $e');
    exit(1);
  }
}

Future<void> _runGitCommand(List<String> args) async {
  final result = await Process.run('git', args);
  final stdout = result.stdout.toString();
  final stderr = result.stderr.toString();
  final output = '$stdout$stderr';
  
  // Check for acceptable "nothing to commit" scenarios
  final isNothingToCommit = output.toLowerCase().contains('nothing to commit') ||
      output.toLowerCase().contains('working tree clean') ||
      output.toLowerCase().contains('nothing added to commit');
  
  if (result.exitCode != 0 && !isNothingToCommit) {
    throw Exception('Git command failed: $stderr');
  }
}

