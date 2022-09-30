import ApiError from "../api-error.js";
import MongoDB from "../utils/mongodb.util.js";
import ContactService from "../services/contact.service.js";

const createContact = async function (req, res, next) {
  if (!req.body?.name) {
    return next(new ApiError(400, "Name can not be empty"));
  }
  try {
    const contactService = new ContactService(MongoDB.client);
    const resultCreate = await contactService.create(req.body);
    return res.send(resultCreate);
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while creating the contact")
    );
  }
};

const deleteAllContacts = async function (req, res, next) {
  try {
    const contactService = new ContactService(MongoDB.client);
    const resultDelete = await contactService.deleteAll();
    return res.send({
      message: `${resultDelete} contacts were deleted successfully!`,
    });
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while  removing all contacts")
    );
  }
};

const deleteContact = async function (req, res, next) {
  try {
    const contactService = new ContactService(MongoDB.client);
    const resultDelete = await contactService.delete(req.params.id);
    if (!resultDelete) return next(new ApiError(400, "Contact not found"));
    else {
      return res.send({
        message: "Contact was deleted successfully!",
      });
    }
  } catch (error) {
    return next(
      new ApiError(500, `Could not delete contact with id: ${req.params.id}`)
    );
  }
};

const findAllContacts = async function (req, res, next) {
  let documents = [];

  try {
    const contactService = new ContactService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await contactService.findByName(name);
    } else {
      documents = await contactService.find({});
    }
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while retrieving contacts")
    );
  }
  return res.send(documents);
};

const findAllFavorites = async function (req, res, next) {
  try {
    const contactService = new ContactService(MongoDB.client);
    const resultFind = await contactService.findFavorite();
    return res.send(resultFind);
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while retrieving favorite contact")
    );
  }
};

const findOneContact = async function (req, res, next) {
  try {
    const contactService = new ContactService(MongoDB.client);
    const resultFind = await contactService.findById(req.params.id);
    if (!resultFind) return next(new ApiError(400, "Contact not found"));
    return res.send(resultFind);
  } catch (error) {
    return next(
      new ApiError(500, `Error  retrieving contact with id=${req.params.id}`)
    );
  }
};

const updateContact = async function (req, res, next) {
  if (Object.keys(req.body).length === 0)
    return next(new ApiError(400, "Data update can not be empty"));
  try {
    const contactService = new ContactService(MongoDB.client);
    const resultUpdate = await contactService.update(req.params.id, req.body);
    if (!resultUpdate) return next(new ApiError(400, "Contact not found"));
    else
      return res.send({
        message: "Contact was update successfully!",
      });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating contact with id ${req.params.id}`)
    );
  }
};

export default {
  createContact,
  deleteAllContacts,
  deleteContact,
  findAllContacts,
  findAllFavorites,
  findOneContact,
  updateContact,
};
