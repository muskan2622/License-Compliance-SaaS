import { LicensePolicy, CustomLicense, PolicyViolation } from '../types/policy';

export class PolicyManager {
  private policies: LicensePolicy[] = [];
  private customLicenses: CustomLicense[] = [];

  // Add a new policy
  async addPolicy(policy: LicensePolicy): Promise<void> {
    this.policies.push(policy);
  }

  // Add a custom license definition
  async addCustomLicense(license: CustomLicense): Promise<void> {
    this.customLicenses.push(license);
  }

  // Check for policy violations
  async checkPolicyViolations(licenses: string[]): Promise<PolicyViolation[]> {
    const violations: PolicyViolation[] = [];

    for (const license of licenses) {
      // Check against blacklist
      const blacklistPolicy = this.policies.find(
        p => p.type === 'blacklist' && p.licenses.includes(license)
      );
      
      if (blacklistPolicy) {
        violations.push({
          license,
          policy: blacklistPolicy.name,
          severity: 'high',
          description: `License ${license} is blacklisted by policy ${blacklistPolicy.name}`
        });
      }

      // Check against whitelist
      const hasWhitelist = this.policies.some(p => p.type === 'whitelist');
      if (hasWhitelist) {
        const whitelisted = this.policies.some(
          p => p.type === 'whitelist' && p.licenses.includes(license)
        );
        if (!whitelisted) {
          violations.push({
            license,
            policy: 'whitelist',
            severity: 'high',
            description: `License ${license} is not in any whitelist`
          });
        }
      }
    }

    return violations;
  }
}