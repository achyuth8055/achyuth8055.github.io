
module.exports = {
  sync: true,

  inputs: {
    record: {
      type: 'ref',
      required: true,
    },
  },

  fn(inputs) {
    const fileManager = sails.hooks['file-manager'].getInstance();

    return {
      ..._.omit(inputs.record, ['uploadedFileId', 'extension']),
      url: `${fileManager.buildUrl(`${sails.config.custom.backgroundImagesPathSegment}/${inputs.record.uploadedFileId}/original.${inputs.record.extension}`)}`,
      thumbnailUrls: {
        outside360: `${fileManager.buildUrl(`${sails.config.custom.backgroundImagesPathSegment}/${inputs.record.uploadedFileId}/outside-360.${inputs.record.extension}`)}`,
      },
    };
  },
};
