import { Vulnerability } from '../types/scan';

export async function scanFile(filePath: string): Promise<{ vulnerabilities: Vulnerability[] }> {
  const fs = require('fs').promises;
  const content = await fs.readFile(filePath, 'utf8');
  const vulnerabilities: Vulnerability[] = [];

  // Simple example: Check for the use of "eval()"
  if (content.includes('eval(')) {
    vulnerabilities.push({
      file: filePath,
      severity: 'high',
      description: 'Possible use of eval() function',
    });
  }

  return { vulnerabilities };
}