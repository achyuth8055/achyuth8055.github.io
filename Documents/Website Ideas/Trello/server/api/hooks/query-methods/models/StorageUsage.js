
/* Query methods */

const getOneMain = () => StorageUsage.findOne(StorageUsage.MAIN_ID);

module.exports = {
  getOneMain,
};
