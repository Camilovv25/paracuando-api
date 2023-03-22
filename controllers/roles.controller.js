const RolesService = require('../services/roles.service');
const { getPagination, getPagingData } = require('../utils/helpers');

const rolesService = new RolesService();

const getRoles = async (req, res, next) => {
  try {
    const { page = 1, size = 10 } = req.query;

    const { limit, offset } = getPagination(page, size);

    const roles = await rolesService.findAndCount({ limit, offset });

    const results = getPagingData(roles, page, limit);

    return res.json({ results });
  } catch (error) {
    next(error);
  }
};



const addRole = async (request, response, next) => {
  try {
    let { body } = request
    let role = await rolesService.createRole(body)
    return response.status(201).json({ results: role })
  } catch (error) {
    next(error)
  }
}

const getRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const role = await rolesService.getRoleOr404(id);
    return res.json({ results: role });
  } catch (error) {
    next(error);
  }
};

const updateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const role = await rolesService.updateRole(id, req.body);
    return res.json({ results: role });
  } catch (error) {
    next(error);
  }
};

const removeRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    await rolesService.removeRole(id);
    return res.json({ message: 'removed' });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getRoles
};
