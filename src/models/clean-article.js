const mongoose = require("mongoose");
const { Schema } = mongoose;

const cleanArticlesSchema = new Schema(
  {
    content: {
      type: String,
      required: false,
    },

    idOrigin: {
      type: String,
      required: true,
    },

    media: {
      type: String,
      required: false,
    },

    title: {
      type: String,
      required: true,
    },

    mainCategory: {
      type: String,
      required: true,
    },
    
    date: {
      type: Date,
      required: true,
    },

    entities: {
      type: Array,
      required: false,
    },

    deleted: {
      type: Boolean,
      required: false,
      default: false,
    },

    path: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("cleanArticle", cleanArticlesSchema);
