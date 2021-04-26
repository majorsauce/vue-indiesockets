"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndieSocketServer = void 0;
var events_1 = require("events");
var IndieSocketClient_1 = require("./IndieSocketClient");
var IndieSocketServer = /** @class */ (function (_super) {
    __extends(IndieSocketServer, _super);
    function IndieSocketServer(server, debug) {
        if (debug === void 0) { debug = false; }
        var _this = _super.call(this) || this;
        _this.debug = debug;
        server.on("connection", function (socket) {
            if (debug)
                console.log("[IndieSocket] Client connected");
            var client = new IndieSocketClient_1.IndieSocketClient(socket, debug);
            _this.emit("_connected", client);
            _this.emit("_all", client);
        });
        return _this;
    }
    return IndieSocketServer;
}(events_1.EventEmitter));
exports.IndieSocketServer = IndieSocketServer;
