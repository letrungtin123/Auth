import { handleError } from "./handleError.js";

export const handleAsync = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    handleError(res, "Internal server is error");
  }
};
