
const crypto = require('crypto');

module.exports = {
  sync: true,

  inputs: {
    record: {
      type: 'ref',
      required: true,
    },
  },

  fn(inputs) {
    if (!sails.config.custom.gravatarBaseUrl) {
      return null;
    }

    const hash = crypto.createHash('md5').update(inputs.record.email).digest('hex');
    return `${sails.config.custom.gravatarBaseUrl}${hash}?s=180&d=initials`;
  },
};
