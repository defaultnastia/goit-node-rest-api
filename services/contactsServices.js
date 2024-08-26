import Contact from "../models/Contact.js";

export function listContacts(filter, skip, limit) {
  return Contact.find(filter)
    .skip(skip)
    .limit(limit)
    .populate("owner", "email");
}

export function getContactById(filter) {
  return Contact.findOne(filter);
}

export function removeContact(filter) {
  return Contact.findOneAndDelete(filter);
}

export function addContact(data) {
  return Contact.create(data);
}

export const updateContact = (filter, data) => {
  return Contact.findOneAndUpdate(filter, data);
};

export const updateStatusContact = (filter, isFavorite) => {
  return Contact.findOneAndUpdate(filter, { favorite: isFavorite });
};
