import { verifyAccessToken } from "../lib/generate-token.js";

export const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    res.status(401).json({ error: "Unauthorized - No Token Provided!" });
  }

  try {
    const decoded = verifyAccessToken(token);
    if (!decoded)
      res.status(401).json({ error: "Unauthorized - No Token Provided!" });
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
};
