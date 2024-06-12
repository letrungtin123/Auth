import { HTTP_STATUS } from "../common/http-status.common.js";

export const handleError = (res, message) => {
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message });
};
