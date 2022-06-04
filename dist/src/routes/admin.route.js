"use strict";
exports.__esModule = true;
var express_1 = require("express");
/**
 *
 * Managament the routes of user
 * @category Routes
 * @class UserRouter
 * @implements {IRoute}
 */
var AdminRouter = /** @class */ (function () {
    function AdminRouter() {
        this.router = express_1.Router();
        this.createRoutes();
    }
    AdminRouter.prototype.createRoutes = function () {
        this.router.post('/', function (req, res, next) { return res.sendStatus(200); });
    };
    return AdminRouter;
}());
exports["default"] = new AdminRouter().router;
