"use strict";
exports.__esModule = true;
var class_validator_1 = require("class-validator");
var exceptions_1 = require("../exceptions");
var ObjectId = require('mongoose').Types.ObjectId;
/**
 *
 * Valid a value if is defined (is required), default valid id from url and valid _id of mongodb
 * @category Middlewares
 * @param {any} value - the value to validate
 * @return {RequestHandler}  {RequestHandler}
 */
var isDefinedParam = function (value, param, validateMongoId) {
    if (value === void 0) { value = 'params'; }
    if (param === void 0) { param = 'id'; }
    if (validateMongoId === void 0) { validateMongoId = true; }
    return function (req, res, next) {
        var paramValue = req[value][param];
        var exist = class_validator_1.isNotEmpty(req[value][param]);
        var isMongoId = false;
        if (validateMongoId) {
            isMongoId = ObjectId.isValid(paramValue);
            if (!exist || !isMongoId) {
                return next(new exceptions_1.HttpException(400, value + " is required and shoul be ObjectId"));
            }
        }
        else if (!exist)
            return next(new exceptions_1.HttpException(400, value + " is required"));
        next();
    };
};
exports["default"] = isDefinedParam;
