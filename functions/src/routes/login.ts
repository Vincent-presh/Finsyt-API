import {Request, Response} from "express";
import * as admin from "firebase-admin";
import {sendResponse} from "../handlers/responseHandler";

// Define the login route
const loginHandler = async (req: Request, res: Response) => {
  try {
    const idToken = req.body.token as string;

    if (!idToken) {
      sendResponse(res, 400, "Token is required");
      return;
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);

    if (!decodedToken.uid) {
      sendResponse(res, 401, "Invalid token");
      return;
    }

    // Fetch user data from Firestore
    const userRef = admin.firestore().collection("users").doc(decodedToken.uid);
    const userSnapshot = await userRef.get();

    if (!userSnapshot.exists) {
      sendResponse(res, 404, "User not found");
      return;
    }

    // Define the type for user data
    type UserData = {
      // Define the properties of user data based on your Firestore structure
      name: string;
      email: string;
      // other fields...
    };

    const userData = userSnapshot.data() as UserData;

    sendResponse<UserData>(res, 200, "Login successful", userData);
  } catch (error) {
    console.error("Error during login:", error);
    sendResponse(res, 500, "Internal Server Error");
  }
};

export default loginHandler;
