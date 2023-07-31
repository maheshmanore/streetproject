const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require("fs");
const Docxtemplater = require("docxtemplater");
const PizZip = require("pizzip");
const Project = require("../models/Checklist");



const archiver = require("archiver");
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/views/dashboard.html'));
});

router.get('/list', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/checklist/list.html'));
  });

  router.get('/downloadfiles', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/checklist/viewlist.html'));
  });


  router.post("/edit-docx", async(req, res) => {
    const formData = req.body;
  
    // Read the DOCX template
    const templatePath = path.join(__dirname, "template.docx");
    const content = fs.readFileSync(templatePath, "binary");
  
    // Load the DOCX content into docxtemplater
    const doc = new Docxtemplater();
    const zip = new PizZip(content);
    doc.loadZip(zip);
  
    // Prepare the data object to replace the placeholders
    const data = {};
  
    // Set the data dynamically based on the input received from the HTML form
    for (const field in formData) {
      // Check if the field value is not null or undefined
      if (formData[field] !== null && formData[field] !== undefined) {
        data[field] = formData[field];
      } else {
        data[field] = "";
      }
    }
  
    // Set the data to replace the placeholders
    doc.setData(data);
  
    try {
      // Perform the substitution
      doc.render();
    } catch (error) {
      console.error("Error while rendering the template:", error);
      return res.status(500).send("Error while rendering the template.");
    }
  
    // ... (existing code)
  
    // Get the edited content after removing unused placeholders
    const editedContent = doc.getZip().generate({ type: "nodebuffer" });
  
    // Save the project name and the edited DOCX file to MongoDB
    const newProject = new Project({
      projectName: formData.projectname,
      docxFile: editedContent,
    });
  
    try {
      await newProject.save();
   
    } catch (error) {
      console.error("Error while saving the project to MongoDB:", error);
      return res.status(500).send("Error while saving the project.");
    }
  
    // Send the edited DOCX as a response (unchanged)
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader("Content-Disposition", `attachment; filename="edited_template.docx"`);
    res.send(editedContent);
  });


// In your server.js or routes file


router.get("/downloadall", async (req, res) => {
  try {
    const projects = await Project.find();
    if (!projects || projects.length === 0) {
      return res.status(404).json({ error: "No projects found" });
    }

    const zip = archiver("zip");
    zip.on("error", (error) => {
      console.error("Error creating zip archive:", error);
      res.status(500).json({ error: "Error creating zip archive" });
    });

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="all_projects.zip"`);

    // Send the zip archive as the response
    zip.pipe(res);

    for (const project of projects) {
      const docxBuffer = Buffer.from(project.docxFile);
      zip.append(docxBuffer, { name: `${project.projectName}.docx` });
    }

    zip.finalize();
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Error fetching projects" });
  }
});

router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find({}, "projectName _id");
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Error fetching projects" });
  }
});


router.get("/projects/:projectName/download", async (req, res) => {
  const projectName = req.params.projectName;

  try {
    const project = await Project.findOne({ projectName });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Convert the buffer to a Node.js Buffer before sending it for download
    const docxBuffer = Buffer.from(project.docxFile);

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.setHeader("Content-Disposition", `attachment; filename="${project.projectName}.docx"`);
    res.send(docxBuffer);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Error fetching project" });
  }
});


// ... (remaining API endpoint code) ...


// ... (remaining API endpoint code) ...






module.exports = router;
