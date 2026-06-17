const { createHandler } = require('@app-core/server');
const { appLogger } = require('@app-core/logger');
const retrieveService = require('../../services/creator-card/retrieve');

module.exports = createHandler({
  path: '/creator-cards/:slug',
  method: 'get',
  middlewares: [],
  async onResponseEnd(rc, rs) {
    appLogger.info({ requestContext: rc, response: rs }, 'retrieve-request-completed');
  },

  async handler(rc, helpers) {
    const { slug } = rc.params;
    const { access_code: accessCode } = rc.query;

    const response = await retrieveService({ slug, accessCode });

    if (response.status === 'error') {
      return {
        status: response.statusCode || 400,
        message: response.message,
        code: response.code,
      };
    }

    return {
      status: helpers.http_statuses.HTTP_200_OK,
      message: 'Creator Card Retrieved Successfully.',
      data: response,
    };
  },
});
