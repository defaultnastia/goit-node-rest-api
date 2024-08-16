import express from "express";
import contactsControllers from "../controllers/contactsControllers.js";
import validateBody from "../decorators/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

const createContactValidation = validateBody(createContactSchema);
const updateContactValidation = validateBody(updateContactSchema);

const contactsRouter = express.Router();

contactsRouter.get("/", contactsControllers.getAllContacts);

contactsRouter.get("/:id", contactsControllers.getOneContact);

contactsRouter.post(
  "/",
  createContactValidation,
  contactsControllers.createContact
);

contactsRouter.put(
  "/:id",
  updateContactValidation,
  contactsControllers.updateContact
);

contactsRouter.delete("/:id", contactsControllers.deleteContact);

export default contactsRouter;
