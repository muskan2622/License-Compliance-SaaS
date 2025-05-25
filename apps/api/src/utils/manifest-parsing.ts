import { Dependency } from '../types/scan';

export async function parseManifest(projectPath: string): Promise<{ dependencies: Dependency[] }> {
  const fs = require('fs').promises;
  const path = require('path');
  const dependencies: Dependency[] = [];

  // npm (package.json)
  const packageJsonPath = path.join(projectPath, 'package.json');
  try {
    const packageJsonContent = await fs.readFile(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);
    if (packageJson.dependencies) {
      for (const depName in packageJson.dependencies) {
        dependencies.push({
          name: depName,
          version: packageJson.dependencies[depName],
        });
      }
    }
  } catch (error) {
    // package.json not found or invalid, skip
  }

  // pip (requirements.txt)
  const requirementsPath = path.join(projectPath, 'requirements.txt');
  try {
    const requirementsContent = await fs.readFile(requirementsPath, 'utf8');
    for (const line of requirementsContent.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [name, version] = trimmed.split('==');
        dependencies.push({
          name,
          version: version || 'latest',
        });
      }
    }
  } catch (error) {
    // requirements.txt not found, skip
  }


  return { dependencies };
}