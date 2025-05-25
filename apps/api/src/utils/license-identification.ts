import * as fs from 'fs/promises';
import * as path from 'path';

export async function identifyLicense(projectPath: string): Promise<{ licenseViolations: string[] }> {
  const licenseFiles = ['LICENSE', 'LICENSE.txt', 'LICENSE.md'];
  const violations: string[] = [];
  let licenseFound = false;

  // Try reading each candidate license file
  for (const filename of licenseFiles) {
    const fullPath = path.join(projectPath, filename);
    try {
      const content = await fs.readFile(fullPath, 'utf8');
      licenseFound = true;
      
      // Example: check for MIT License text (adjust as needed)
      if (content.includes('MIT License')) {
        // For instance, if MIT is disallowed, add a violation.
        violations.push('MIT License is not allowed.');
      }
      // You can add more conditions to check for other license types...
      
      // Return early if you only expect one license per project.
      return { licenseViolations: violations };
    } catch (error) {
      // No license file found; try the next candidate file.
      continue;
    }
  }

  // Optionally, if no license file is found, you might want to add an issue.
  if (!licenseFound) {
    violations.push('No license file found.');
  }
  
  return { licenseViolations: violations };
}