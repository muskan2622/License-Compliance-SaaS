export interface ScanOptions {
  projectPath: string;
}

export interface ScanReport {
  files: string[];
  dependencies?: Record<string, string[]>;
  license?: string | null;
}