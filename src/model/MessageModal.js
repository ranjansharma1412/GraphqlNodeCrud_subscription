const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const MessageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
    },
    user: {
        type: ObjectId,
        ref: 'User',
        default: null
    }

}, { timestamps: true })

const MessageModal = mongoose.model('Message', MessageSchema);
module.exports = MessageModal;
