import express from "express";
import contactsControllers from "../controllers/contactsControllers.js";
import validateBody from "../decorators/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import isValidId from "../middleware/isValidId.js";

const createContactValidation = validateBody(createContactSchema);
const updateContactValidation = validateBody(updateContactSchema);

const contactsRouter = express.Router();

contactsRouter.get("/", contactsControllers.getAllContacts);

contactsRouter.get("/:id", isValidId, contactsControllers.getOneContact);

contactsRouter.post(
  "/",
  createContactValidation,
  contactsControllers.createContact
);

contactsRouter.put("/:id", isValidId, contactsControllers.updateContact);
// contactsRouter.put(
//   "/:id",
//   isValidId,
//   updateContactValidation,
//   contactsControllers.updateContact
// );

contactsRouter.delete("/:id", isValidId, contactsControllers.deleteContact);

export default contactsRouter;
