import { SystemChecker } from './systemChecker';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function main() {
    const checker = new SystemChecker();
    console.log('Machine Id: ', checker.getMachineId());
    console.log('Platform: ', process.platform);
    try {
        const { stdout } = await execAsync('manage-bde -status C:');
        console.log('Disk Encryption Status: ', stdout);
        const isEncrypted = stdout.includes("Conversion Status:    Fully Encrypted");
        console.log('Is Disk Encrypted: ', isEncrypted);

        const {isPresent, isActive, name} = await checker.checkAntiVirus() ;
        console.log('Anti-Virus Protection: ', isPresent ? `${name} - ${isActive ? 'Active' : 'Inactive'}` : 'Not Present');

        const {sleepTimeout, isCompliant} = await checker.checkSleepSettings();
        console.log('Sleep Settings: ', isCompliant ? 'Compliant' : `Timeout: ${sleepTimeout} minutes`);

        const {current, latest, isUpToDate} = await checker.checkOSUpdates();
        console.log('OS Updates: ', isUpToDate ? 'Up to Date' : `Current: ${current}, Latest: ${latest}`);
    }
    catch (error) {
        console.error('Error: ', error);
    }
}

main(); 