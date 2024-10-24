import dotenv from "dotenv";
import { app } from "./app.js";
dotenv.config({ path: "./.env" });
import connectDB from "./src/db/index.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error(err));
