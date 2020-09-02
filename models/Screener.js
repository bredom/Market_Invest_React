mongoose = require('mongoose');

const screenerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    columns: [
      {
        name: {
          type: String,
          required: true,
        },
        id: {
          type: String,
          required: true,
        },
        items: [
          {
            name: {
              type: String,
              required: true,
            },
            tag: {
              type: String,
              required: true,
            },
          },
        ],
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Screener = mongoose.model('Screener', screenerSchema);
module.exports = Screener;
