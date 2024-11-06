import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    caption: {
        type: String,
        trim: true,
        index: true,
    },
    image: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}, {
    timestamps: true,
}
);

export const Post = mongoose.model("Post", PostSchema);
