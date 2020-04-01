'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // menu
  router.get('/menu', controller.menu.list);
  router.post('/menu', controller.menu.add)
  router.put('/menu', controller.menu.update)
  router.del('/menu', controller.menu.del)
};
