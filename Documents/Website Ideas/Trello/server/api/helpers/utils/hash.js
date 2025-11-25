
const crypto = require('crypto');

module.exports = {
  sync: true,

  inputs: {
    data: {
      type: 'ref',
      required: true,
    },
  },

  fn(inputs) {
    return crypto.createHash('sha256').update(inputs.data).digest('hex');
  },
};
