export interface SystemCheck {
  lastCheckIn: string;
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
      drive: string;
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

export interface SystemQuery {
  platform?: string;
  version?: string;
  updateStatus?: string;
  diskEncryption?: string;
  antivirus?: string;
  isCompliant?: string;
} 