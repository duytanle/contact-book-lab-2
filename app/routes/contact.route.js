import express from "express";
import contacts from "../controllers/contact.controller.js";
const router = express.Router();

router.post("/", contacts.createContact);

router.get("/", contacts.findAllContacts);

router.delete("/", contacts.deleteAllContacts);

router.get("/favorite", contacts.findAllFavorites);

router.get("/:id", contacts.findOneContact);

router.put("/:id", contacts.updateContact);

router.delete("/:id", contacts.deleteContact);

export default router;
