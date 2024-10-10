import express from "express";
import * as candidateController from "../controllers/candidateController.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();


router.route("/:id/followcandidate").put(authMiddleware.authenticateToken, candidateController.followCandidate);

export default router;