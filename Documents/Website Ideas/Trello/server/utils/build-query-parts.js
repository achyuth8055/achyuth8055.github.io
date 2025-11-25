
const QUERY_PARTS_REGEX = /[ ,;]+/;

const buildQueryParts = (query) =>
  query.split(QUERY_PARTS_REGEX).flatMap((queryPart) => {
    if (!queryPart) {
      return [];
    }

    return queryPart.toLowerCase();
  });

module.exports = buildQueryParts;
