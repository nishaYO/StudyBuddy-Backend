const Contact = require("../models/Contact.js");
const { Types } = require("mongoose");

class ContactFormController {
  static async submitContactForm({ userID, name, message, email }) {
    try {
      await Contact.create({
        _id: new Types.ObjectId(),
        userID: userID || "",
        name: name,
        message: message,
        email: email,
        date: Date.now(),
      });
      return {
        success: true,
        message: "Form saved successfully.",
      };
    } catch (error) {
      console.error("Error submitting form:", error.message);
      return {
        success: false,
        message: error.message,
      };
    }
  }
}

module.exports = ContactFormController;
