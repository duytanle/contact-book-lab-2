import { ObjectId } from "mongodb";

class ContactService {
  constructor(client) {
    this.Contact = client.db().collection("contacts");
  }

  extractContactData(payload) {
    const contact = {
      name: payload.name,
      email: payload.email,
      address: payload.address,
      phone: payload.phone,
      favorite: payload.favorite,
    };

    Object.keys(contact).forEach(
      (key) => contact[key] === undefined && delete contact[key]
    );
    return contact;
  }

  async create(payload) {
    const contact = this.extractContactData(payload);
    const result = await this.Contact.findOneAndUpdate(
      contact,
      { $set: { favorite: contact.favorite === true } },
      { returnDocument: "after", upsert: true }
    );
    return result.value;
  }

  async findByName(name) {
    const resultFind = await this.Contact.find({
      name: new RegExp(name, "i"),
    });
    return resultFind.toArray();
  }

  async find(filter) {
    const resultFind = await this.Contact.find(filter);
    return resultFind.toArray();
  }

  async findById(id) {
    return await this.Contact.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };

    const update = this.extractContactData(payload);
    const resultUpdate = await this.Contact.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return resultUpdate.value;
  }

  async delete(id) {
    const result = await this.Contact.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result.value;
  }

  async findFavorite() {
    return await this.find({ favorite: true });
  }

  async deleteAll() {
    const deleteResult = await this.Contact.deleteMany({});
    return deleteResult.deletedCount;
  }
}

export default ContactService;
