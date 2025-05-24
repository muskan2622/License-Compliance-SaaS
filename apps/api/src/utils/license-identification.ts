import fs from "fs";
import path from "path";

export function identifyLicense(projectPath: string): string | null {
  const licenseFiles = ["LICENSE", "LICENSE.txt", "LICENSE.md"];
  for (const file of licenseFiles) {
    const filePath = path.join(projectPath, file);
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, "utf-8").slice(0, 100); // Return snippet or parse further
    }
  }
  return null;
}