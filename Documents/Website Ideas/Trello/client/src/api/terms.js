
import http from './http';

/* Actions */

const getTerms = (type, language, headers) =>
  http.get(`/terms/${type}${language ? `?language=${language}` : ''}`, undefined, headers);

export default {
  getTerms,
};
