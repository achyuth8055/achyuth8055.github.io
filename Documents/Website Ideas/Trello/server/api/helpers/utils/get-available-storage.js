
module.exports = {
  async fn() {
    const { storageLimit } = sails.config.custom;

    if (storageLimit === null) {
      return null;
    }

    const storageUsage = await StorageUsage.qm.getOneMain();
    return BigInt(storageLimit) - BigInt(storageUsage.total);
  },
};
