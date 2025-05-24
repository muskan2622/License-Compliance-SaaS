import fs from "fs";

export function parsePackageJson(filePath: string): string[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const pkg = JSON.parse(content);
  return Object.keys(pkg.dependencies || {});
}

export function parseRequirementsTxt(filePath: string): string[] {
  const content = fs.readFileSync(filePath, "utf-8");
  return content.split("\n").map(line => line.trim()).filter(Boolean);
}

// Add more parsers as needed (e.g., pom.xml, go.mod)