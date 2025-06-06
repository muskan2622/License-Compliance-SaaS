import { scanFile,detectPackageManagers } from '../utils/file-scanning'
import { identifyLicense } from '../utils/license-identification';
import { parseManifest } from '../utils/manifest-parsing';
import { ScanResult } from '../types/scan';
import { PolicyManager } from '../utils/policy-management';
import { IntegrationManager } from '../utils/integration';

export async function performProjectScan(projectPath: any): Promise<ScanResult> {
  const scanResult: ScanResult = {
    vulnerabilities: [],
    licenseViolations: [],
    dependencies: [],
    issues: [],
    packageManagers: [], 
  };

  // 1. Discover project files
  const files = await findProjectFiles(projectPath);

  // 2. Scan each file
  for (const file of files) {
    try {
      const fileScanResult = await scanFile(file);
      if (fileScanResult.vulnerabilities.length > 0) {
        scanResult.vulnerabilities.push(...fileScanResult.vulnerabilities);
      }
    } catch (error) {
      scanResult.issues.push({
        file: file,
        error: `Error scanning file: ${error}`,
      });
    }
  }

    const policyManager = new PolicyManager();
  const detectedLicenses = scanResult.dependencies.map(dep => dep.license).filter(Boolean);
  const policyViolations = await policyManager.checkPolicyViolations(detectedLicenses);
  scanResult.licenseViolations.push(...policyViolations);

  // Generate SBOM
  const integrationManager = new IntegrationManager();
  const sbom = await integrationManager.generateSBOM(scanResult);

  // 3. Identify licenses
  try {
    const licenseInfo = await identifyLicense(projectPath);
    scanResult.licenseViolations = licenseInfo.licenseViolations;
  } catch (error) {
    scanResult.issues.push({ error: `License Identification failed: ${error}` });
  }

  // 4. Parse manifest files
  try {
    const manifestData = await parseManifest(projectPath);
    scanResult.dependencies = manifestData.dependencies;
  } catch (error) {
    scanResult.issues.push({ error: `Manifest parsing failed: ${error}` });
  }

  // ✅ 5. Detect package managers
  try {
    scanResult.packageManagers = await detectPackageManagers(projectPath);
  } catch (error) {
    scanResult.issues.push({ error: `Package manager detection failed: ${error}` });
  }

   return {
    ...scanResult,
    sbom,
  };
}




// (Helper function - adapt as needed)
async function findProjectFiles(projectPath: any): Promise<string[]> {
    const fs = require('fs').promises;
    const path = require('path');

    async function* walk(dir) {
      for await (const d of await fs.opendir(dir)) {
        const entry = path.join(dir, d.name);
        if (d.isDirectory()) yield* walk(entry);
        else if (d.isFile()) yield entry;
      }
    }

    const files: string[] = [];
    for await (const file of walk(projectPath)) {
      files.push(file);
    }
    return files;
}