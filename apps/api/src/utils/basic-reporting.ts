import { ScanResult } from '../types/scan';

export function generateBasicReport(scanResult: ScanResult): string {
  const report = {
    vulnerabilities: scanResult.vulnerabilities,
    licenseViolations: scanResult.licenseViolations,
    dependencies: scanResult.dependencies,
    detectedPackageManagers: scanResult.packageManagers,
    issues: scanResult.issues,
  };
  // You can return a JSON string or generate HTML/text as needed.
  return JSON.stringify(report, null, 2);
}