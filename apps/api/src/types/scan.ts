export interface Vulnerability {
  file: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  // ... other vulnerability details
}

export interface LicenseViolation {
  file: string;
  license: string;
  // ... other license details
}

export interface Dependency {
  name: string;
  version: string;
  // ... other dependency details
}

export interface ScanIssue {
  file?: string;
  error: string;
}

export interface ScanResult {
  vulnerabilities: Vulnerability[];
  licenseViolations: LicenseViolation[];
  dependencies: Dependency[];
  issues: ScanIssue[];
}