const System = require('../model/system.model');
const { Parser } = require('json2csv');

const createSystem = async (req, res) => {
    const { machineId } = req.body;
    const validSystem = await System.findOne({ machineId });

    if (validSystem) {
        const updatedSystem = await System.findByIdAndUpdate(
            validSystem._id, {
            $set: req.body
        },
            { new: true });
        return res.status(200).json({
            success: true,
            data: updatedSystem,
        })
    }
    else {
        const newSystem = await System.create(req.body);
        return res.status(201).json({
            success: true,
            data: newSystem,
        })
    }
}

const getSystem = async (req, res) => {
    const { platform, version, updateStatus, diskEncryption, antivirus, isCompliant } = req.query;
    const query = {};
    if (platform) query["os.platform"] = platform;
    if (version) query["os.version"] = version;
    if (updateStatus) query["os.updateStatus.isUpToDate"] = updateStatus;
    if (diskEncryption) query["security.diskEncryption.isEncrypted"] = diskEncryption;
    if (antivirus) query["security.antivirus.isActive"] = antivirus;
    if (isCompliant) query["power.isCompliant"] = isCompliant;
    console.log(query);
    const systems = await System.find(query);
    return res.status(200).json({
        success: true,
        data: systems,
    })
}

const exportData = async (req, res) => {
    const systems = await System.find();
    
    const flatSystems = systems.map(s => {
        const system = s.toObject();
        return {
            'Machine ID': system.machineId,
            'os.platform': system.os?.platform,
            'os.version': system.os?.version,
            'os.updateStatus.isUpToDate': system.os?.updateStatus?.isUpToDate,
            'security.antivirus.isPresent': system.security?.antivirus?.isPresent,
            'security.antivirus.isActive': system.security?.antivirus?.isActive,
            'security.antivirus.name': system.security?.antivirus?.name,
            'security.diskEncryption.isEncrypted': system.security?.diskEncryption?.isEncrypted,
            'power.sleepTimeout': system.power?.sleepTimeout,
            'power.isCompliant': system.power?.isCompliant,
            lastCheckIn: new Date(system.lastCheckIn).toLocaleString(),
        };
    });

    const parser = new Parser();
    const csv = parser.parse(flatSystems);
    res.header('Content-Type', 'text/csv');
    res.attachment('systems.csv');
    return res.send(csv);
}

module.exports = { createSystem, getSystem, exportData }; 