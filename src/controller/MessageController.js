const Message = require('../model/MessageModal')
const createMessage = async (reqBody) => {
    const message = new Message(reqBody);
    return await message.save();
}

const getMessage = async (messageId) => {
    const message = await Message.findOne({ _id: messageId}).populate("user");
    return message;
}

module.exports = {
    createMessage,
    getMessage
}
