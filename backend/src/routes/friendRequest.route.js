import express from "express";
import {
  sendFriendRequest,
  getMyRequests,
  cancelRequest,
  respondToFriendRequest,
} from "../controller/friendRequest.controller.js";
import { protectAuth } from "../middleware/protectAuth.js";

const router = express.Router();

router.post("/send", protectAuth, sendFriendRequest);
router.get("/", protectAuth, getMyRequests);
router.delete("/:id", protectAuth, cancelRequest);
router.patch("/respond/:requestId", protectAuth, respondToFriendRequest);

export default router;
