import {Request, Response} from "express";
import * as admin from "firebase-admin";
import {sendResponse} from "../handlers/responseHandler";
import {validateToken} from "../middleware/validateToken"; // If user authentication is required

const CONVERSATIONS_COLLECTION = "conversations";

const getAllConversationsHandler = async (req: Request, res: Response) => {
  try {
    // Assuming the user's ID is stored in the request after token validation
    const userId = req.body.user.uid;

    // Query Firestore for conversations associated with the user
    const conversationsRef = admin
      .firestore()
      .collection(CONVERSATIONS_COLLECTION);
    const snapshot = await conversationsRef.where("userId", "==", userId).get();

    if (snapshot.empty) {
      sendResponse(res, 404, "No conversations found for the user");
      return;
    }

    let conversations = [];
    snapshot.forEach((doc) => {
      conversations.push({id: doc.id, ...doc.data()});
    });

    sendResponse(res, 200, "Conversations retrieved successfully", {
      conversations,
    });
  } catch (error) {
    console.error("Error retrieving conversations:", error);
    sendResponse(res, 500, "Internal Server Error");
  }
};

export default getAllConversationsHandler;
