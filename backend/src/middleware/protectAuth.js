import jwt from "jsonwebtoken";

export const protectAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Error in protectAuth middleware:", error);

    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({
          success: false,
          message: "Session expired. Please log in again.",
        });
    }

    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
