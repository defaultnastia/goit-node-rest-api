import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import controllerWrapper from "../decorators/controllerWrapper.js";

const getAllContacts = async (_, res) => {
  const result = await contactsService.listContacts();
  res.json(result);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.getContactById(id);

  if (!result) throw HttpError(404, "Not found");

  res.json(result);
};

const createContact = async (req, res) => {
  const data = req.body;
  const result = await contactsService.addContact(data);

  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  if (!Object.keys(data).length)
    throw HttpError(400, "Body must have at least one field");

  const result = await contactsService.updateContact(id, data);

  if (!result) throw HttpError(404, "Not found");

  res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  if (!("favorite" in data))
    throw HttpError(400, "Body must contain key: favorite");

  const result = await contactsService.updateStatusContact(id, data.favorite);

  if (!result) throw HttpError(404, "Not found");

  res.json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.removeContact(id);

  if (!result) throw HttpError(404, "Not found");

  res.json({
    message: "Contact was deleted",
    data: result,
  });
};

export default {
  getAllContacts: controllerWrapper(getAllContacts),
  getOneContact: controllerWrapper(getOneContact),
  createContact: controllerWrapper(createContact),
  updateContact: controllerWrapper(updateContact),
  updateStatusContact: controllerWrapper(updateStatusContact),
  deleteContact: controllerWrapper(deleteContact),
};
