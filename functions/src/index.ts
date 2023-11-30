import * as express from "express";
import * as functions from "firebase-functions";
import {validateToken} from "./middleware/validateToken";
import createConversationHandler from "./routes/createConversation";
import loginHandler from "./routes/login";
import addMessageHandler from "./routes/addMessage";
import getAllConversationsHandler from "./routes/getAllConversations";

const admin = require("firebase-admin");
const cors = require("cors");

admin.initializeApp();

const app = express();
app.use(cors({origin: true}));
app.use(express.json()); // For parsing application/json

// Login endpoint
app.post("/login", loginHandler);
app.post("/createConversation", validateToken, createConversationHandler);
app.post("/addMessage", validateToken, addMessageHandler);
app.get("/getAllConversations", validateToken, getAllConversationsHandler);

exports.app = functions.https.onRequest(app);
