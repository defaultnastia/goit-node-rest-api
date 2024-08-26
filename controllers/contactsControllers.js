import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import controllerWrapper from "../decorators/controllerWrapper.js";

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const result = await contactsService.listContacts({ owner }, skip, limit);

  res.json({
    total_contacts: result.length,
    contacts: result,
  });
};

const getOneContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const result = await contactsService.getContactById({ _id: id, owner });

  if (!result) throw HttpError(404, "Not found");

  res.json(result);
};

const createContact = async (req, res) => {
  const { _id: owner } = req.user;
  const data = req.body;
  const result = await contactsService.addContact({ ...data, owner });

  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const data = req.body;

  if (!Object.keys(data).length)
    throw HttpError(400, "Body must have at least one field");

  const result = await contactsService.updateContact({ _id: id, owner }, data);

  if (!result) throw HttpError(404, "Not found");

  res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;

  const data = req.body;
  if (!("favorite" in data))
    throw HttpError(400, "Body must contain key: favorite");

  const result = await contactsService.updateStatusContact(
    { _id: id, owner },
    data.favorite
  );
  if (!result) throw HttpError(404, "Not found");

  res.json(result);
};

const deleteContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;

  const result = await contactsService.removeContact({ _id: id, owner });
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
