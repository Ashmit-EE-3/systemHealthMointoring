const System = require('../model/system.model');

const createSystem = async(req,res) => {
    const {machineId} = req.body ; 
    const validSystem = await System.findOne({machineId});

    if (validSystem) {
        const updatedSystem = await System.findByIdAndUpdate(
            validSystem._id, {
                $set: req.body
            }, 
            {new: true});
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

module.exports = {createSystem}; 