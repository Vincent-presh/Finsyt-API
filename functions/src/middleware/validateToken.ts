import {Request, Response, NextFunction} from "express";
import * as admin from "firebase-admin";
import {sendResponse} from "../handlers/responseHandler";

/**
 * Middleware to validate Firebase Auth tokens.
 */
export const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const idToken = req.headers.authorization?.split("Bearer ")[1];

    if (!idToken) {
      sendResponse(res, 401, "Authorization token is required");
      return;
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (!decodedToken.uid) {
      sendResponse(res, 403, "Invalid or expired token");
      return;
    }

    // Add the decoded token to the request object
    req.body.user = decodedToken;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error during token verification:", error);
    sendResponse(res, 500, "Internal Server Error");
  }
};
