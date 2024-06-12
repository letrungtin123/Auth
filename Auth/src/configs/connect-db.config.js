import * as dotenv from "dotenv";

import mongoose from "mongoose";

dotenv.config();

const connectDb = async () => {
  mongoose
    .connect(process.env.MONGOOSE_DB)
    .then(() => {
      console.log("connected to db");
    })
    .catch((error) => {
      console.log("🚀 ~ connectDb ~ error:", error);
    });
};

export default connectDb;
