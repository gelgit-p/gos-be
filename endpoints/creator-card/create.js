const { createHandler } = require('@app-core/server');
const { appLogger } = require('@app-core/logger');
const createService = require('../../services/creator-card/create-card');

module.exports = createHandler({
  path: '/creator-cards',
  method: 'post',
  middlewares: [],
  async onResponseEnd(rc, rs) {
    appLogger.info({ requestContext: rc, response: rs }, 'create-request-completed');
  },

  async handler(rc, helpers) {
    const payload = rc.body;

    const response = await createService(payload);

    if (response.status === 'error') {
      return {
        ...response,
        status: 400,
      };
    }

    return {
      status: 200,
      data: response,
    };
  },

  //   async handler(rc, helpers) {
  //     const payload = rc.body;

  //     const response = await createService(payload);

  // If service returned a slug conflict, return a 400 error payload.
  // if (response?.code === 'SL02') {
  //   return {
  //     // status: helpers.http_statuses.HTTP_400_BAD_REQUEST,
  //     // message: response.message,
  //     data: response,
  //   };
  // }

  // const result = await createCard(serviceData);

  // if (response.status === 'error') {
  //   return res.status(400).json(response);
  // }

  // return res.status(200).json({ status: 'success', data: response });

  //     // return response;
  //   },
});
