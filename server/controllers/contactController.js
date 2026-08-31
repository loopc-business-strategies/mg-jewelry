const Contact = require('../models/Contact');

const submitContact = async (req, res) => {
  const contact = await Contact.create(req.body);
  res.status(201).json({ message: 'Message sent successfully', contact });
};

const getContacts = async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.json(contacts);
};

module.exports = { submitContact, getContacts };
