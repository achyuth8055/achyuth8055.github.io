
import http from './http';

/* Actions */

const createAccessToken = (data, headers) =>
  http.post('/access-tokens?withHttpOnlyToken=true', data, headers);

const exchangeForAccessTokenWithOidc = (data, headers) =>
  http.post('/access-tokens/exchange-with-oidc?withHttpOnlyToken=true', data, headers);

// TODO: rename?
const acceptTerms = (data, headers) => http.post('/access-tokens/accept-terms', data, headers);

const revokePendingToken = (data, headers) =>
  http.post('/access-tokens/revoke-pending-token', data, headers);

const deleteCurrentAccessToken = (headers) => http.delete('/access-tokens/me', undefined, headers);

export default {
  createAccessToken,
  exchangeForAccessTokenWithOidc,
  acceptTerms,
  revokePendingToken,
  deleteCurrentAccessToken,
};
