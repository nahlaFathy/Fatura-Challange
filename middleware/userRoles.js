
const { roles } = require('../helper/Authorization')

/// check if user has a right to  do something 
exports.grantAccess = function (action, resource) {
    return async (req, res, next) => {
        try {
            //  check for granted permissions for a specific resource and action.
            const permission = roles.can(req.user.role)[action](resource);
            if (!permission.granted) {
                return res.status(401).json({
                    error: "You don't have enough permission to perform this action"
                });
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}