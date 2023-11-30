import {Request, Response} from "express";
import * as admin from "firebase-admin";
import {sendResponse} from "../handlers/responseHandler";
import {validateToken} from "../middleware/validateToken"; // If user authentication is required

const CONVERSATIONS_COLLECTION = "conversations";

const addMessageHandler = async (req: Request, res: Response) => {
  try {
    const {conversationId, message} = req.body;

    if (!conversationId || !message) {
      sendResponse(res, 400, "Conversation ID and message are required");
      return;
    }

    // Add the new message to the conversation
    const conversationRef = admin
      .firestore()
      .collection(CONVERSATIONS_COLLECTION)
      .doc(conversationId);
    const conversation = await conversationRef.get();

    if (!conversation.exists) {
      sendResponse(res, 404, "Conversation not found");
      return;
    }

    // Assuming messages are stored in an array in the conversation document
    await conversationRef.update({
      messages: admin.firestore.FieldValue.arrayUnion(message),
    });

    sendResponse(res, 200, "Message added to the conversation");
  } catch (error) {
    console.error("Error adding message to conversation:", error);
    sendResponse(res, 500, "Internal Server Error");
  }
};

export default addMessageHandler;
