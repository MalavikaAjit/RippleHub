import express from "express";
import {
  sendFriendRequest,
  getMyRequests,
  respondToRequest,
  cancelRequest,
} from "../controller/friendRequest.controller.js";
import { protectAuth } from "../middleware/protectAuth.js";

const router = express.Router();

router.post("/send", protectAuth, sendFriendRequest);
router.get("/", protectAuth, getMyRequests);
router.patch("/:id", protectAuth, respondToRequest);
router.delete("/:id", protectAuth, cancelRequest);
export default router;
