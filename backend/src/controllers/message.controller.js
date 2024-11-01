import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversation.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const sendMessage = asyncHandler(async (req, res) => {
    const senderId = req.user._id;
    const { recieverId } = req.params;
    const { message } = req.body;
    if (!message) {
        throw new ApiError(409, "message not recieved")
    }
    if (!senderId || !recieverId) {
        throw new ApiError(409, "sender or reciever id not present")
    }
    let conversation = await Conversation.find({
        participents: { $all: [senderId, recieverId] }
    })
    if (!conversation) {
        conversation = await Conversation.create({
            participents: [senderId, recieverId]
        })
    }
    const newMessage = await Message.create({
        senderId,
        recieverId,
        message
    })
    if (newMessage) {
        conversation.messages.push(newMessage);
    }
    await conversation.save();
    return res
        .status(200)
        .json(new ApiResponse(200, newMessage, "message sent successfully"));
})

const recieveMessages = asyncHandler(async (req, res) => {
    const senderId = req.user._id;
    const { recieverId } = req.params;
    if (!senderId || !recieverId) {
        throw new ApiError(409, "sender or reciever id not present")
    }
    const conversation = await Conversation.find({
        participents: { $all: [senderId, recieverId] }
    })
    if (!conversation) {
        return res
            .status(200)
            .json(new ApiResponse(200, { messages: [] }, "message sent successfully"));
    }
    return res
        .status(200)
        .json(new ApiResponse(200, { messages: conversation?.messages }, "message sent successfully"));
})
export { sendMessage , recieveMessages}