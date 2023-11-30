import {Request, Response} from "express";
import * as admin from "firebase-admin";
import {sendResponse} from "../handlers/responseHandler";
import {validateToken} from "../middleware/validateToken"; // Import the validateToken middleware

const CONVERSATIONS_COLLECTION = "conversations";

const createConversationHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.body.user.uid; // The UID is now attached to the request object

    // Create a new conversation object
    const newConversation = {
      userId: userId,
      createdAt: admin.firestore.Timestamp.now(),
      messages: [],
    };

    // Add new conversation to Firestore
    const conversationRef = await admin
      .firestore()
      .collection(CONVERSATIONS_COLLECTION)
      .add(newConversation);

    sendResponse(res, 200, "Conversation created", {
      conversationId: conversationRef.id,
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    sendResponse(res, 500, "Internal Server Error");
  }
};

export default createConversationHandler;
