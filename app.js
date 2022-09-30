import express from "express";
import cors from "cors";
import contactsRouter from "./app/routes/contact.route.js";
import ApiError from "./app/api-error.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to contact book application" });
});

app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "OInternal Server Error",
  });
});

export default app;
