export interface LicensePolicy {
  id: string;
  name: string;
  type: 'whitelist' | 'blacklist';
  licenses: string[];
  description?: string;
}

export interface CustomLicense {
  id: string;
  name: string;
  text: string;
  permissions: string[];
  limitations: string[];
  conditions: string[];
}

export interface PolicyViolation {
  license: string;
  policy: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
}