const express = require('express');
const router = express.Router();
const controller = require('../../controllers/employeesController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verify-roles');

router.route('/')
    .get(controller.getAllEmployees)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), controller.createNewEmployee)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), controller.updateEmployee)
    .delete(verifyRoles(ROLES_LIST.Admin), controller.deleteEmployee);

router.route('/:id')
    .get(controller.getAnEmployee);

module.exports = router;