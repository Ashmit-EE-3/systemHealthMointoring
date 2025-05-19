const mongoose = require('mongoose');

const systemSchema = new mongoose.Schema({
    machineId: {
        type: String, 
        required: true,
    },
    lastCheckIn: {
        type: Date,
        default: Date.now,
    },
    os: {
        platform: {
            type: String,
        },
        version: {
            type: String,
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
