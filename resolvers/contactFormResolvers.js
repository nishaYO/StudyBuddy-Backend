const ContactFormController = require("../controllers/contactFormController.js");

const contactFormResolvers = {
  Mutation: {
    submitContactForm: (_, { input }) => ContactFormController.submitContactForm(input),
  },
};

module.exports = contactFormResolvers;
