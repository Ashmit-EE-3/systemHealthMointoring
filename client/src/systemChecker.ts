import { SystemCheck, SystemCheckResult } from './types';
import si from 'systeminformation';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);
const MACHINE_ID_FILE: string = path.join(os.homedir(), 'my_system_utility_id');
export class SystemChecker {
    private machineId: string;
    
    constructor(machineId?: string) {
        if (machineId) {
            this.machineId = machineId;
        } else if (fs.existsSync(MACHINE_ID_FILE)) {
            this.machineId = fs.readFileSync(MACHINE_ID_FILE, 'utf-8').trim();
        } else {
            this.machineId = uuidv4();
            fs.writeFileSync(MACHINE_ID_FILE, this.machineId);
        }
    }
    
    async checkDiskEncryption(): Promise<{isEncrypted: boolean, status: string}> {
        try{
            const platform = process.platform; 

            if (platform === 'win32'){
                const {stdout} = await execAsync('manage-bde -status');
                const isEncrypted = stdout.includes("Conversion Status:    Fully Encrypted");
                return {isEncrypted, status: isEncrypted ? "Encrypted" : "Decrypted"};
            }
            else if (platform === 'darwin'){
                const {stdout} = await execAsync('fdesetup status');
                const isEncrypted = stdout.includes("FileVault is On");
                return {isEncrypted, status: isEncrypted ? "FileVault Enabled" : "FileVault Disabled"};
            }
            else if (platform === 'linux'){
                const {stdout} = await execAsync('cryptsetup status');
                const isEncrypted = stdout.includes("active");
                return {isEncrypted, status: isEncrypted ? "LUKS Encrypted" : "Not Encrypted"};
            }
            else{
                return {isEncrypted: false, status: "Unsupported Platform"};
            }
        }
        catch(error){
            return {isEncrypted: false, status: "Check Failed!"}
        }
    }

    async checkAntiVirus(): Promise<{isPresent: boolean, isActive: boolean, name?: string}> {
        try{
            const platform = process.platform; 

            if (platform === 'win32'){
                const {stdout} = await execAsync('powershell "Get-WmiObject -Namespace root/SecurityCenter2 -Class AntiVirusProduct');
                const isPresent = stdout.includes("displayName");
                const isActive = stdout.includes("productState");
                const nameMatch = stdout.match(/displayName\s*:\s*([^\n]+)/) ; 
                return {isPresent, isActive, name: nameMatch ? nameMatch[1].trim() : undefined};
            }
            else {
                return {isPresent: true, isActive: true, name: platform === 'darwin' ? 'macOS Security' : 'Linux Security'}
            }
        }
        catch(error){
            return {isPresent: false, isActive: false}; 
        }
    }

    async checkSleepSettings(): Promise<{sleepTimeout: number, isCompliant: boolean}> {
        try{
            const platform = process.platform; 
            let sleepTimeout = 0; 

            if (platform === 'win32'){
                const {stdout} = await execAsync('powercfg /query SCHEME_CURRENT SUB_SLEEP STANDBYIDLE');
                const match = stdout.match(/AC Power Setting Index:\s*0x([0-9a-fA-F]+)/);
                sleepTimeout = match ? parseInt(match[1], 16)/60 : 0;
            }
            else if (platform === 'darwin'){
                const {stdout} = await execAsync('pmset -g custom');
                const match = stdout.match(/AC Power:\s*[\s\S]*?sleep\s+(\d+)/);
                sleepTimeout = match ? parseInt(match[1], 10) : 0;
            }
            else if (platform === 'linux') {
                const { stdout } = await execAsync('cat /sys/power/mem_sleep');
                sleepTimeout = stdout.includes('deep') ? 10 : 0;
            } 
            return {sleepTimeout, isCompliant: sleepTimeout <= 10};
        }
        catch(error){
            return {sleepTimeout: 0, isCompliant: false} ; 
        }
    }

    async checkOSUpdates(): Promise<{current: string, latest: string, isUpToDate: boolean}>{
        try{
            const osInfo = await si.osInfo();
            const platform = osInfo.platform; 

            let current = osInfo.release; 
            let latest = osInfo.release; 
            let isUpToDate = true; 

            if (platform === 'win32') {
                const { stdout } = await execAsync('powershell "Get-HotFix | Sort-Object -Property InstalledOn -Descending | Select-Object -First 1"');
                const match = stdout.match(/InstalledOn\s*:\s*([^\n]+)/);
                if (match) {
                  latest = match[1].trim();
                }
              } else if (platform === 'darwin') {
                const { stdout } = await execAsync('softwareupdate -l');
                isUpToDate = !stdout.includes('*');
              }
              else if (platform === 'linux'){
                const {stdout} = await execAsync('apt list --upgradable');
                isUpToDate = !stdout.includes('upgradable');
              }
              return {current, latest, isUpToDate};
        }
        catch(error){
            return {current: 'unknown', latest: 'unknown', isUpToDate: false}
        }
    }

    public getMachineId(): string {
        return this.machineId; 
    }
}
