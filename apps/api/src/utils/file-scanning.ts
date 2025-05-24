import fs from "fs";
import path from "path";

const MANIFESTS = ["package.json", "requirements.txt", "pom.xml", "go.mod"];

export function scanProject(projectPath: string): string[] {
  let found: string[] = [];
  function scan(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) scan(fullPath);
      else if (MANIFESTS.includes(entry.name)) found.push(fullPath);
    }
  }
  scan(projectPath);
  return found;
}