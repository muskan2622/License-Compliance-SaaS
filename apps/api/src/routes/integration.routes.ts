import { ScanResult } from '../types/scan';

export interface SBOMData {
  components: {
    name: string;
    version: string;
    license: string;
  }[];
  metadata: {
    timestamp: string;
    tool: string;
  };
}

export class IntegrationManager {
  // Generate SBOM from scan results
  async generateSBOM(scanResult: ScanResult): Promise<SBOMData> {
    return {
      components: scanResult.dependencies.map(dep => ({
        name: dep.name,
        version: dep.version,
        license: 'Unknown' // You'd want to get this from your license detection
      })),
      metadata: {
        timestamp: new Date().toISOString(),
        tool: 'License-Compliance-SaaS'
      }
    };
  }

  // Monitor for changes (simplified version)
  async monitorChanges(previousScan: ScanResult, currentScan: ScanResult) {
    const changes = {
      newDependencies: currentScan.dependencies.filter(
        curr => !previousScan.dependencies.some(prev => prev.name === curr.name)
      ),
      removedDependencies: previousScan.dependencies.filter(
        prev => !currentScan.dependencies.some(curr => curr.name === prev.name)
      ),
      newViolations: currentScan.licenseViolations.filter(
        curr => !previousScan.licenseViolations.includes(curr)
      )
    };

    return changes;
  }
}