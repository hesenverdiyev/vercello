import express from "express";
import * as pollController from "../controllers/pollController.js";

const router = express.Router();

router.route('/').get(pollController.getAllPolls);
router.route("/:pollname").get(pollController.getAPoll);
router.route("/:pollname/vote").put(pollController.pollVoting);
router.route("/:pollname/comment").post(pollController.pollCommenting);


export default router;