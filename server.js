import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";

dotenv.config();

const startServer = () => {
  const app = express();
  const port = Number(process.env.PORT);

  app.use(morgan("tiny"));
  app.use(cors());
  app.use(express.json());
  app.use(express.static("public"));

  app.use("/api/users", authRouter);
  app.use("/api/contacts", contactsRouter);

  app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  app.use((err, req, res, next) => {
    const { status = 500, message = "Server error" } = err;
    res.status(status).json({ message });
  });

  return app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

export default startServer;
