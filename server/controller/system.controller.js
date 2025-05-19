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

const getAllSystems = async (req, res) => {
    const systems = await System.find();
    return res.status(200).json({
        success: true,
        data: systems,
    })
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
    const parser = new Parser();

    const csv = parser.parse(systems.map(s => s.toObject())); 
    res.header('Content-Type', 'text/csv');
    res.attachment('systems.csv');
    return res.send(csv);
}

module.exports = { createSystem, getAllSystems, getSystem, exportData }; 