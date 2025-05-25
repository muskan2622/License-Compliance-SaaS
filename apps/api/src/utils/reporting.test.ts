import { generateBasicReport } from './basic-reporting';
import { generateEnhancedReport } from './enhanced-reporting';
import { ScanResult } from '../types/scan';

describe('Reporting Modules', () => {
  const dummyScanResult: ScanResult = {
    vulnerabilities: [
      { file: 'testFile.js', severity: 'high', description: 'Test vulnerability' }
    ],
    licenseViolations: ['MIT License is not allowed.'],
    dependencies: [
      { name: 'express', version: '^4.17.1' }
    ],
    issues: [],
    packageManagers: ['npm']
  };

  test('generateBasicReport returns valid JSON with expected keys', () => {
    const basicReport = generateBasicReport(dummyScanResult);
    // Parse back to object to check the keys and values
    const reportObject = JSON.parse(basicReport);

    expect(reportObject).toHaveProperty('vulnerabilities');
    expect(reportObject.vulnerabilities).toEqual(dummyScanResult.vulnerabilities);

    expect(reportObject).toHaveProperty('licenseViolations');
    expect(reportObject.licenseViolations).toEqual(dummyScanResult.licenseViolations);

    expect(reportObject).toHaveProperty('dependencies');
    expect(reportObject.dependencies).toEqual(dummyScanResult.dependencies);

    expect(reportObject).toHaveProperty('detectedPackageManagers');
    expect(reportObject.detectedPackageManagers).toEqual(dummyScanResult.packageManagers);

    expect(reportObject).toHaveProperty('issues');
    expect(reportObject.issues).toEqual(dummyScanResult.issues);
  });

  test('generateEnhancedReport includes report header and details', () => {
    const enhancedReport = generateEnhancedReport(dummyScanResult);
    // Check that the output contains expected sections
    expect(enhancedReport).toContain('Enhanced Report - Project Scan');
    expect(enhancedReport).toContain('Vulnerabilities:');
    expect(enhancedReport).toContain('Policy Violations (Licenses):');
    expect(enhancedReport).toContain('Detected Package Managers: npm');
    expect(enhancedReport).toContain('Total Dependencies: 1');
  });
});