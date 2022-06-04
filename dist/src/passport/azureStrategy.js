"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var passport_azure_ad_1 = require("passport-azure-ad");
var models_1 = require("../models");
var services_1 = require("../services");
var adapter_1 = __importDefault(require("../routes/gateway/adapter"));
var STORAGE_SERVICE_BASE_URL = process.env.STORAGE_SERVICE_BASE_URL || "";
var apiStorageService = adapter_1["default"](STORAGE_SERVICE_BASE_URL);
var options = {
    identityMetadata: "https://login.microsoftonline.com/618bab0f-20a4-4de3-a10c-e20cee96bb35/v2.0/.well-known/openid-configuration",
    clientID: "4ffd1ea7-1b1d-4ad6-96d5-916315128e56"
};
var AzurebearerStrategy = new passport_azure_ad_1.BearerStrategy(options, function (token, done) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // Search user
            models_1.User.findOne({ oaid: token.oid }, function (err, user) {
                return __awaiter(this, void 0, void 0, function () {
                    var oid, preferred_username, name_1, newUser_1, error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log("OFFICE USER: ", user);
                                if (err) {
                                    console.log(err);
                                    return [2 /*return*/, done(err)];
                                }
                                if (!!user) return [3 /*break*/, 5];
                                oid = token.oid, preferred_username = token.preferred_username, name_1 = token.name;
                                console.log('User was added automatically as they were new. Their oid is: ', oid);
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, services_1.UserService
                                        .create(new models_1.User({ username: name_1, oaid: oid, email: preferred_username }))
                                    // Create folder to sotorage files
                                ];
                            case 2:
                                newUser_1 = _a.sent();
                                // Create folder to sotorage files
                                apiStorageService.get("/api/file/mkdir/" + name_1)
                                    .then(function (res) {
                                    return done(null, newUser_1);
                                })["catch"](function (error) {
                                    console.log(error);
                                    return done(error, false);
                                });
                                return [3 /*break*/, 4];
                            case 3:
                                error_1 = _a.sent();
                                console.log(error_1);
                                return [2 /*return*/, done(error_1, false)];
                            case 4: return [3 /*break*/, 6];
                            case 5: // if exist pass user to next request
                            return [2 /*return*/, done(null, user)];
                            case 6: return [2 /*return*/];
                        }
                    });
                });
            });
            return [2 /*return*/];
        });
    });
});
exports["default"] = AzurebearerStrategy;
