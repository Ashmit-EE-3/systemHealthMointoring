import { SystemChecker } from './systemChecker';

const CHECK_INTERVAL_MINUTES: number = 1;

let lastState: Object = {};
async function getSystemState(): Promise<Object> {
    const checker = new SystemChecker();
    const machineId: string = checker.getMachineId();
    const disk: Object = await checker.checkDiskEncryption();
    const antivirus: Object = await checker.checkAntiVirus();
    const sleep: Object = await checker.checkSleepSettings();
    const updates: Object = await checker.checkOSUpdates();

    return { machineId, os:{platform: process.platform, version: process.version, updateStatus: updates}, security: { diskEncryption: disk, antivirus: antivirus }, power: sleep };
}

function hasChanged(newState: Object, oldState: Object) {
    return JSON.stringify(newState) !== JSON.stringify(oldState);
}

async function main() {
    try {
        console.log('Starting system check...');
        const state: Object = await getSystemState();
        console.log("State is : ",state) ; 
        if (!lastState || hasChanged(state, lastState)) {

            const response = await fetch('http://localhost:3000/api/v1/system/newSystem', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(state),
            })

            if (!response.ok) {
                console.log('Failed to send date to the server', response);
                return;
            }

            const data = await response.json();
            console.log('System data sent successfully: ', data);
        }
    }
    catch (error: any) {
        console.error('Error in daemon: ', error.message);
    }

    // const checker = new SystemChecker();
    // console.log('Machine Id: ', checker.getMachineId());
    // console.log('Platform: ', process.platform);
    // try {
    //     const machineId = checker.getMachineId();
    //     const { isEncrypted, status } = await checker.checkDiskEncryption();

    //     const { isPresent, isActive, name } = await checker.checkAntiVirus();
    //     console.log('Anti-Virus Protection: ', isPresent ? `${name} - ${isActive ? 'Active' : 'Inactive'}` : 'Not Present');

    //     const { sleepTimeout, isCompliant } = await checker.checkSleepSettings();
    //     console.log('Sleep Settings: ', isCompliant ? 'Compliant' : `Timeout: ${sleepTimeout} minutes`);

    //     const { current, latest, isUpToDate } = await checker.checkOSUpdates();
    //     console.log('OS Updates: ', isUpToDate ? 'Up to Date' : `Current: ${current}, Latest: ${latest}`);

    //     const result = { machineId, os: { platform: process.platform, version: process.version, updateStatus: { current, latest, isUpToDate } }, security: { diskEncryption: { isEncrypted, status }, antivirus: { isPresent, isActive, name } }, power: { sleepTimeout, isCompliant } };

    //     const response = await fetch('http://localhost:3000/api/v1/system/newSystem', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify(result),
    //     })

    //     if (!response.ok){
    //         console.log('Failed to send date to the server', response); 
    //         return ; 
    //     }

    //     const data = await response.json(); 
    //     console.log('System data sent successfully: ', data); 
    // }
    // catch (error) {
    //     console.error('Error: ', error);
    // }
}

main(); 
setInterval(main, CHECK_INTERVAL_MINUTES * 60 * 1000); 