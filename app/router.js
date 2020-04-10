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
  router.get('/user/menu', controller.menu.userMenu)
  router.get('/menu/tree', controller.menu.tree)

  //role
  router.get('/role', controller.role.list)
  router.post('/role', controller.role.add)
  router.put('/role', controller.role.update)
  router.del('/role', controller.role.del)
  router.get('/role/options', controller.role.options)

  //user
  router.post('/user/register', controller.user.register)
  router.post('/user/login', controller.user.login)
  router.get('/user/getInfo', controller.user.getInfo)
  router.get('/user' , controller.user.getList)
  router.post('/user', controller.user.add)
  router.put('/user', controller.user.update)
  router.del('/user', controller.user.delUser)
};
