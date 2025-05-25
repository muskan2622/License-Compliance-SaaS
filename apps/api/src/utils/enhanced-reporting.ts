import { ScanResult } from '../types/scan';

export function generateEnhancedReport(scanResult: ScanResult): string {
  let report = `Enhanced Report - Project Scan\n`;
  report += `=================================\n\n`;
  
  // Summary of Vulnerabilities
  if (scanResult.vulnerabilities.length) {
    report += `Vulnerabilities:\n`;
    scanResult.vulnerabilities.forEach((vuln, index) => {
      report += `  ${index + 1}. File: ${vuln.file}\n     Severity: ${vuln.severity}\n     Description: ${vuln.description}\n\n`;
    });
  } else {
    report += `No vulnerabilities detected.\n\n`;
  }
  
  // Policy Violations (License violations)
  if (scanResult.licenseViolations.length) {
    report += `Policy Violations (Licenses):\n`;
    scanResult.licenseViolations.forEach((violation, index) => {
      report += `  ${index + 1}. ${violation}\n`;
    });
    report += `\n`;
  } else {
    report += `No license or policy violations detected.\n\n`;
  }
  
  // Include other info as needed
  report += `Detected Package Managers: ${scanResult.packageManagers?.join(', ') || 'None'}\n`;
  report += `Total Dependencies: ${scanResult.dependencies.length}\n`;
  report += `Issues: ${scanResult.issues.length}\n`;
  
  return report;
}