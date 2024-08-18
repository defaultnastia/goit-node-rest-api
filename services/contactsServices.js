import Contact from "../models/Contact.js";

export function listContacts() {
  return Contact.find();
}

export function getContactById(contactId) {
  return Contact.findById(contactId);
}

export function removeContact(contactId) {
  return Contact.findByIdAndDelete(contactId);
}

export function addContact(data) {
  return Contact.create(data);
}

export const updateContact = (id, data) => {
  return Contact.findByIdAndUpdate(id, data);
};

export const updateStatusContact = (id, isFavorite) => {
  return Contact.findByIdAndUpdate(id, { favorite: isFavorite });
};
