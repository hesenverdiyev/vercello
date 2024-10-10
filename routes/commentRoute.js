import express from "express";
import * as commentController from "../controllers/commentController.js";

const router = express.Router();


router.route("/:id").delete(commentController.deleteAComment);


export default router;