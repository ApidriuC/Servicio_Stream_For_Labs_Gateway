"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var morgan_1 = __importDefault(require("morgan"));
var routes_1 = __importDefault(require("../routes"));
var errorHandler_1 = __importDefault(require("../exceptions/errorHandler"));
var utils_1 = require("../utils");
var passport_1 = __importDefault(require("passport"));
var azureStrategy_1 = __importDefault(require("../passport/azureStrategy"));
var jwtStrategy_1 = __importDefault(require("../passport/jwtStrategy"));
/**
 *
 *
 * The class of managament application
 * @class Server
 */
var Server = /** @class */ (function () {
    /**
     * Creates an instance of Server.
     * @param {number} port - The por of app listen
     * @memberof Server
     */
    // eslint-disable-next-line no-unused-vars
    function Server(port) {
        this.port = port;
        this.app = express_1["default"]();
        this.env = process.env.NODE_ENV || 'development';
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }
    /**
     *
     * Initialize the application
     * @static
     * @param {number} port - the port
     * @return Server
     * @memberof Server
     */
    Server.init = function (port) {
        return new Server(port);
    };
    /**
     *
     * Start listen the server
     * @param {Function} callback
     * @memberof Server
     */
    Server.prototype.listen = function (callback) {
        this.app.listen(this.port, callback());
    };
    /**
     *
     * Initialize the middlewares of the application
     * @private
     * @memberof Server
     */
    Server.prototype.initializeMiddlewares = function () {
        if (this.env === 'production') {
            this.app.use(morgan_1["default"]('combined', { stream: utils_1.stream }));
            this.app.use(cors_1["default"]({ origin: "*", credentials: true }));
        }
        else if (this.env === 'development') {
            this.app.use(morgan_1["default"]('dev', { stream: utils_1.stream }));
            this.app.use(cors_1["default"]({ origin: "*", credentials: true }));
        }
        this.app.use(express_1["default"].static('public'));
        this.app.use(express_1["default"].json());
        this.initializePassport();
        this.app.use(routes_1["default"]);
    };
    Server.prototype.initializePassport = function () {
        this.app.use(passport_1["default"].initialize());
        passport_1["default"].use(azureStrategy_1["default"]);
        passport_1["default"].use(jwtStrategy_1["default"]);
    };
    /**
     *
     * Initialize the routes of application
     * @private
     * @memberof Server
     */
    Server.prototype.initializeRoutes = function () {
        this.app.use(routes_1["default"]);
    };
    /**
     *
     * Initialize the error handler of the applicacion
     * @private
     * @memberof Server
     */
    Server.prototype.initializeErrorHandling = function () {
        this.app.use(errorHandler_1["default"]);
    };
    return Server;
}());
exports["default"] = Server;
