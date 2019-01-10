const mongoose = require("mongoose");

const projectSchema = mongoose.Schema(
  {
    project_name: {
      type: String,
      required: true,
      unique: 1,
      maxlength: 100
    },
    description: {
      type: String,
      required: true
    },
    technologies: {
      type: Array,
      required: true,
      default: []
    },
    images: {
      type: Array,
      required: true,
      default: []
    },
    live_url: {
      type: String,
      required: true,
      unique: 1,
      maxlength: 100
    },
    github_url: {
      type: String,
      required: true,
      unique: 1,
      maxlength: 100
    },
    visible: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
module.exports = { Project };
