// projectModel.js
const mongoose = require("mongoose");

const checklistschema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
  },
  docxFile: {
    type: Buffer, // Store the DOCX file as binary data (Buffer)
    required: true,
  },
});

const Checklist = mongoose.model("Checklist", checklistschema);

module.exports = Checklist;
