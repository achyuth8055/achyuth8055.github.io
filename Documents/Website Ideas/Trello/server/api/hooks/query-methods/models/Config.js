
/* Query methods */

const getOneMain = () => Config.findOne(Config.MAIN_ID);

const updateOneMain = (values) => Config.updateOne(Config.MAIN_ID).set({ ...values });

module.exports = {
  getOneMain,
  updateOneMain,
};
