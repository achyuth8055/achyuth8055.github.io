
module.exports = {
  sync: true,

  inputs: {
    record: {
      type: 'ref',
      required: true,
    },
  },

  fn(inputs) {
    if (sails.config.custom.smtpHost) {
      return _.omit(inputs.record, Config.SMTP_FIELD_NAMES);
    }

    if (inputs.record.smtpPassword) {
      return _.omit(inputs.record, 'smtpPassword');
    }

    return inputs.record;
  },
};
