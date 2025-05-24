import { performProjectScan } from './projectScan';
import * as fs from 'fs/promises';
import * as path from 'path';
import { scanFile, detectPackageManagers } from '../utils/file-scanning';
import { identifyLicense } from '../utils/license-identification';
import { parseManifest } from '../utils/manifest-parsing';

// Mock dependencies to isolate the function under test
jest.mock('../utils/file-scanning');
jest.mock('../utils/license-identification');
jest.mock('../utils/manifest-parsing');

describe('performProjectScan', () => {
  const testDir = path.join(__dirname, 'test-folder');

  beforeAll(async () => {
    await fs.mkdir(testDir, { recursive: true });
    await fs.writeFile(path.join(testDir, 'file1.txt'), 'hello');
    await fs.mkdir(path.join(testDir, 'subfolder'), { recursive: true });
    await fs.writeFile(path.join(testDir, 'subfolder', 'file2.txt'), 'world');
    await fs.writeFile(path.join(testDir, 'package.json'), '{"name": "test", "dependencies": {}}'); //add a package.json file
  });

  afterAll(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('should perform a project scan and return a ScanResult', async () => {
    // Mock the dependencies
    (scanFile as jest.Mock).mockResolvedValue({ vulnerabilities: [] });
    (identifyLicense as jest.Mock).mockResolvedValue({ licenseViolations: [] });
    (parseManifest as jest.Mock).mockResolvedValue({ dependencies: [] });
    (detectPackageManagers as jest.Mock).mockResolvedValue(['npm']);

    const result = await performProjectScan(testDir);

    expect(result).toEqual({
      vulnerabilities: [],
      licenseViolations: [],
      dependencies: [],
      issues: [],
      packageManagers: ['npm'],
    });

    // Verify that the mocked functions were called with the correct arguments
    expect(scanFile).toHaveBeenCalledTimes(3);
    expect(scanFile).toHaveBeenCalledWith(path.join(testDir, 'file1.txt'));
    expect(scanFile).toHaveBeenCalledWith(path.join(testDir, 'subfolder', 'file2.txt'));
    expect(scanFile).toHaveBeenCalledWith(path.join(testDir, 'package.json'));
    expect(identifyLicense).toHaveBeenCalledWith(testDir);
    expect(parseManifest).toHaveBeenCalledWith(testDir);
    expect(detectPackageManagers).toHaveBeenCalledWith(testDir);
  });

  it('should handle errors during file scanning', async () => {
    // Mock scanFile to throw an error for one of the files
    (scanFile as jest.Mock).mockRejectedValue(new Error('Scan error'));
    (identifyLicense as jest.Mock).mockResolvedValue({ licenseViolations: [] });
    (parseManifest as jest.Mock).mockResolvedValue({ dependencies: [] });
    (detectPackageManagers as jest.Mock).mockResolvedValue([]);


    const result = await performProjectScan(testDir);

    expect(result.issues.length).toBeGreaterThan(0);
    expect(result.issues[0].error).toContain('Error scanning file');
  });

  it('should handle errors during license identification', async () => {
    (scanFile as jest.Mock).mockResolvedValue({ vulnerabilities: [] });
    (identifyLicense as jest.Mock).mockRejectedValue(new Error('License error'));
    (parseManifest as jest.Mock).mockResolvedValue({ dependencies: [] });
    (detectPackageManagers as jest.Mock).mockResolvedValue([]);

    const result = await performProjectScan(testDir);

    expect(result.issues.length).toBeGreaterThan(0);
    expect(result.issues[0].error).toContain('License Identification failed');
  });

  it('should handle errors during manifest parsing', async () => {
    (scanFile as jest.Mock).mockResolvedValue({ vulnerabilities: [] });
    (identifyLicense as jest.Mock).mockResolvedValue({ licenseViolations: [] });
    (parseManifest as jest.Mock).mockRejectedValue(new Error('Manifest error'));
    (detectPackageManagers as jest.Mock).mockResolvedValue([]);

    const result = await performProjectScan(testDir);

    expect(result.issues.length).toBeGreaterThan(0);
    expect(result.issues[0].error).toContain('Manifest parsing failed');
  });

   it('should handle errors during package manager detection', async () => {
    (scanFile as jest.Mock).mockResolvedValue({ vulnerabilities: [] });
    (identifyLicense as jest.Mock).mockResolvedValue({ licenseViolations: [] });
    (parseManifest as jest.Mock).mockResolvedValue({ dependencies: [] });
    (detectPackageManagers as jest.Mock).mockRejectedValue(new Error('Package manager detection error'));

    const result = await performProjectScan(testDir);

    expect(result.issues.length).toBeGreaterThan(0);
    expect(result.issues[0].error).toContain('Package manager detection failed');
  });
});