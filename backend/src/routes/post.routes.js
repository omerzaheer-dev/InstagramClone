import { Router } from "express";
import { addNewPost, getAllPosts, likeDislikePosts, getUserPosts, addComment, bookMarkPost, getPostComments, deletePost, } from "../controllers/post.controller.js";
import { memoryStorageUpload } from "../middlewares/multer.middleware.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";
const router = Router();
router.route("/add-new-post").post(jwtVerify, memoryStorageUpload.single("postImage"), addNewPost);
router.route("/get-user-posts").get(getUserPosts);
router.route("/:postId/like-or-dislike-post").post(jwtVerify, likeDislikePosts);
router.route("/get-all-post").post(getAllPosts);
router.route("/:postId/add-comment").post(jwtVerify, addComment);
router.route("/:postId/get-post-comment").get(getPostComments);
router.route("/:postId/delete-post").delete(jwtVerify, deletePost);
router.route("/:postId/bookmark-post").post(jwtVerify, bookMarkPost);

export default router;
