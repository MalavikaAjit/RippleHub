import { Profile } from "../models/profile.model.js";

export const createProfile = async (req, res) => {
  try {
    const { bio } = req.body;
    const profile_image = req.file?.filename;
    const userId = req.userId;

    if (!bio || !profile_image || !userId) {
      return res.status(400).json({ error: "Bio and profile image are required" });
    }

    let profile = await Profile.findOne({ userId });

    if (profile) {
      profile.bio = bio;
      profile.profile_image = profile_image;
      await profile.save();
      return res.status(200).json({ message: "Profile updated", profile });
    }

    profile = new Profile({ bio, profile_image, userId });
    await profile.save();

    res.status(201).json({ message: "Profile created successfully", profile });
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({ error: "Server error while creating profile" });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json({ profile });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Server error while fetching profile" });
  }
};
