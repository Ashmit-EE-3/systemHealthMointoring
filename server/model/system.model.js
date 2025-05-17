const mongoose = require('mongoose');

const systemSchema = new mongoose.Schema({
    machineId: {
        type: String, 
        required: true,
    },
    os: {
        platform: {
            type: String,
            enum: ['win32', 'darwin', 'linux'],
            required: true,
        },
        version: {
            type: String,
            required: true,
        },
        updateStatus: {
            current: {
                type: String,
            },
            latest: {
                type: String,
            },
            isUpToDate: {
                type: Boolean,
            }
        }
    },
    security: {
        diskEncryption: {
            isEncrypted: {
                type: Boolean,
            },
            status: {
                type: String,
            }
        },
        antivirus: {
            isPresent: {
                type: Boolean,
            },
            isActive: {
                type: Boolean,  
            },
            name: {
                type: String,
            }
        }
    },
    power: {
        sleepTimeout: {
            type: Number,
        },
        isCompliant: {
            type: Boolean,
        }
    }
}, {timestamps: true});

const System = mongoose.model('System', systemSchema);
module.exports = System ; 
