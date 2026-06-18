const { createHandler } = require('@app-core/server');
const { appLogger } = require('@app-core/logger');
const deleteService = require('../../services/creator-card/delete-card');

module.exports = createHandler({
  path: '/creator-cards/:slug',
  method: 'delete',
  middlewares: [],
  async onResponseEnd(rc, rs) {
    appLogger.info({ requestContext: rc, response: rs }, 'delete-request-completed');
  },

  async handler(rc, helpers) {
    const { slug } = rc.params;
    const payload = rc.body;

    const response = await deleteService({ slug, ...payload });

    if (response.status === 'error') {
      return {
        status: response.statusCode || 400,
        message: response.message,
        code: response.code,
      };
    }

    return {
      status: helpers.http_statuses.HTTP_200_OK,
      message: 'Creator Card Deleted Successfully.',
      data: response,
    };
  },
});
