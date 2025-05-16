export interface SystemCheck {
  timestamp: string;
  machineId: string;
  os: {
    platform: string;
    version: string;
    updateStatus: {
      current: string;
      latest: string;
      isUpToDate: boolean;
    };
  };
  security: {
    diskEncryption: {
      isEncrypted: boolean;
      status: string;
    };
    antivirus: {
      isPresent: boolean;
      isActive: boolean;
      name?: string;
    };
  };
  power: {
    sleepTimeout: number; // in minutes
    isCompliant: boolean; // true if sleep timeout <= 10 minutes
  };
}

export interface SystemCheckResult {
  success: boolean;
  data?: SystemCheck;
  error?: string;
}

export interface Config {
  apiEndpoint: string;
  checkInterval: number; // in minutes
  machineId: string;
} 