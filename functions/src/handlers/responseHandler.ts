import {Response} from "express";

/**
 * Sends a standardized JSON response with a status code, message, and data.
 *
 * @param res - The Express response object.
 * @param statusCode - The HTTP status code.
 * @param message - A message describing the outcome or error.
 * @param data - The data to be sent in the response (optional).
 */
export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
) => {
  const response = {
    success: statusCode >= 200 && statusCode < 300,
    message,
    data,
  };

  res.status(statusCode).json(response);
};
