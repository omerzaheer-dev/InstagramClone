import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import sharp from "sharp"
import path from "path";
import { fileURLToPath } from "url";

const addNewPost = asyncHandler(async (req, res) => {
    const { caption } = req.body;
    const authorId = req.user?._id;
    if (!caption || !authorId) {
        throw new ApiError(409, "captions are required")
    }
    const postImageLocalPath = req.file;
    if (!postImageLocalPath) {
        throw new ApiError(400, "postImageLocalPath is required")
    }
    const originalNameWithoutExtension = req.file.originalname.split('.')[0];
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const dirPath = path.join(__dirname, "../public/temp");
    const outputPath = path.join(dirPath, `${originalNameWithoutExtension}.jpeg`);
    await sharp(postImageLocalPath.buffer)
        .resize({ width: 600, height: 600, fit: 'inside' })
        .jpeg({ mozjpeg: true, quality: 80 })
        .toFile(outputPath);
    const postImage = await uploadOnCloudinary(outputPath, "postImages");
    if (!postImage) {
        throw new ApiError(400, "postImage file is required")
    }
    const post = await Post.create({
        caption,
        image: postImage?.secure_url,
        author: authorId,
        comments: [],
        likes: []
    });
    if (!post) {
        throw new ApiError(400, "post is not saved")
    }
    const updateResult = await User.findOneAndUpdate(
        { _id: authorId },
        { $push: { posts: post._id } },
        { new: true }
    );
    if (!updateResult) {
        throw new ApiError(400, "post not saved to user profile")
    }
    await post.populate({ path: "author", select: "-password -bio -role -bookmarks -gender -followers -following -isVerified -refreshTokens -resetPasswordToken -resetPasswordTokenExpiry -createdAt -updatedAt" })
    return res
        .status(200)
        .json(new ApiResponse(200, post, "User registered successfully"));
});
const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 })
        .populate({ path: "author", select: "username profilePicture" })
        .populate({ path: "comments", sort: { createdAt: -1 }, populate: { path: "author", select: "username profilePicture" } })
    if (!posts) {
        return res
            .status(200)
            .json(new ApiResponse(200, { posts: [] }, "no post uploaded"));
    }
    return res
        .status(200)
        .json(new ApiResponse(200, posts, "User registered successfully"));
});
const getUserPosts = asyncHandler(async (req, res) => {
    const { _id } = req?.user;
    if (!_id) {
        throw new ApiError(400, "User not logged in")
    }
    const posts = await Post.find({ author: _id }).sort({ createdAt: -1 })
        .populate({ path: "author", select: "username profilePicture" })
        .populate({ path: "comments", sort: { createdAt: -1 }, populate: { path: "author", select: "username profilePicture" } })
    if (!posts) {
        return res
            .status(200)
            .json(new ApiResponse(200, posts, "user have no post"));
    }
    return res
        .status(200)
        .json(new ApiResponse(200, { posts }, "all posts returned"));
});
const likeDislikePosts = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    if (!_id) {
        throw new ApiError(401, "User not logged in");
    }
    const { postId } = req.params;
    if (!postId) {
        throw new ApiError(401, "no post id");
    }
    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(401, "post not found");
    }
    if (post.likes.includes(_id)) {
        post.likes = post.likes.filter(pid => pid !== _id);
        await post.save();
        return res
            .status(200)
            .json(new ApiResponse(200, { type: "disliked" }, "User registered successfully"));

    } else {
        post.likes.push(_id);
        await post.save();
        return res
            .status(200)
            .json(new ApiResponse(200, { type: "liked" }, "User registered successfully"));
    }
});
const addComment = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    if (!_id) {
        throw new ApiError(401, "User not logged in");
    }
    const { postId } = req.params;
    const { text } = req.body;
    if (!postId || !text) {
        throw new ApiError(402, "no post id found or no comment text");
    }
    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(403, "post not found");
    }
    const comment = await Comment.create({
        text,
        author: _id,
        post: postId
    }).populate({ path: "comments", populate: { path: "author", select: "username profilePicture" } })
    if (!comment) {
        throw new ApiError(404, "comment ot created");
    }
    post.comments.push(comment?._id);
    await post.save();
    return res
        .status(200)
        .json(new ApiResponse(200, post, "User registered successfully"));
});
const getPostComments = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    if (!postId) {
        throw new ApiError(401, "no post id");
    }
    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(402, "post not found");
    }
    const comments = await Comment.find({ post: postId }).populate('author', 'profilePicture username');
    if (!comments) {
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "no comments on post"));
    }
    return res
        .status(200)
        .json(new ApiResponse(200, post, "User registered successfully"));
});
const deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    if (!postId) {
        throw new ApiError(401, "no post id");
    }
    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(402, "post not found");
    }
    const { _id } = req.user;
    if (!_id) {
        throw new ApiError(402, "user not logged in");
    }
    if (post?.author.toString() !== _id) {
        throw new ApiError(402, "only owner can delete this post");
    }
    const user = await User.findById(_id);
    if (!user) {
        throw new ApiError(403, "user not found");
    }
    await Post.findByIdAndDelete(postId);
    user.posts = user.posts.filter(pid => pid.toString() !== postId);
    await user.save();
    await Comment.deleteMany({ post: postId })
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Post deleated successfully"));
});
const bookMarkPost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { _id } = req.user;
    if (!_id) {
        throw new ApiError(402, "user not logged in");
    }
    if (!postId) {
        throw new ApiError(401, "no post id");
    }
    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(402, "post not found");
    }
    const user = await User.findById(_id);
    if (!user) {
        throw new ApiError(403, "user not found");
    }
    if (user.bookmarks.includes(postId)) {
        await user.updateOne({ $pull: { bookmarks: postId } })
        await user.save()
        return res
            .status(200)
            .json(new ApiResponse(200, { type: "unsaved" }, "Post removed from bookmark"));
    } else {
        await user.updateOne({ $addToSet: { bookmarks: postId } })
        return res
            .status(200)
            .json(new ApiResponse(200, { type: "saved" }, "Post bookmarked"));
    }
});
export { addNewPost, getAllPosts, likeDislikePosts, getUserPosts, addComment, bookMarkPost, getPostComments, deletePost, }