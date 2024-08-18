import express from "express";
import contactsControllers from "../controllers/contactsControllers.js";
import validateBody from "../decorators/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateContactStatusSchema,
} from "../schemas/contactsSchemas.js";
import isValidId from "../middleware/isValidId.js";

const createContactValidation = validateBody(createContactSchema);
const updateContactValidation = validateBody(updateContactSchema);
const updateContactStatusValidation = validateBody(updateContactStatusSchema);

const contactsRouter = express.Router();

contactsRouter.get("/", contactsControllers.getAllContacts);

contactsRouter.get("/:id", isValidId, contactsControllers.getOneContact);

contactsRouter.post(
  "/",
  createContactValidation,
  contactsControllers.createContact
);

contactsRouter.put(
  "/:id",
  isValidId,
  updateContactValidation,
  contactsControllers.updateContact
);

contactsRouter.delete("/:id", isValidId, contactsControllers.deleteContact);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  updateContactStatusValidation,
  contactsControllers.updateStatusContact
);

export default contactsRouter;
