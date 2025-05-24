import { LicenseViolation } from '../types/scan';

export async function identifyLicense(projectPath: string): Promise<{ licenseViolations: LicenseViolation[] }> {
  const fs = require('fs').promises;
  const path = require('path');
  const licenseFile = path.join(projectPath, 'LICENSE');
  const licenseViolations: LicenseViolation[] = [];

  try {
    await fs.access(licenseFile); // Check if the file exists

    // Assuming that if a LICENSE file exists, it's "MIT"
    licenseViolations.push({
      file: licenseFile,
      license: 'MIT',
    });
  } catch (error) {
    console.log('License file not found');
  }

  return { licenseViolations };
}