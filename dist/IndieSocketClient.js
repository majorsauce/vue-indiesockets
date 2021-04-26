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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndieSocketClient = void 0;
var events_1 = require("events");
var IndieSocketClient = /** @class */ (function (_super) {
    __extends(IndieSocketClient, _super);
    function IndieSocketClient(socket, debug) {
        if (debug === void 0) { debug = false; }
        var _this = _super.call(this) || this;
        _this.socket = socket;
        _this.debug = debug;
        _this.socket.on("message", function (message) {
            var _a = JSON.parse(message), event = _a[0], data = _a[1];
            if (_this.debug)
                console.log("[IndieSocket] Inbound message: " + event + " with value " + JSON.stringify(data));
            _this.emit.apply(_this, __spreadArrays([event], data));
            if (event !== "_in")
                _this.emit.apply(_this, __spreadArrays(["_in", event], data));
            if (event !== "_io")
                _this.emit.apply(_this, __spreadArrays(["_io", event], data));
            if (event !== "_all")
                _this.emit.apply(_this, __spreadArrays(["_*", event], data));
        });
        _this.socket.on("close", function () {
            if (_this.debug)
                console.log("[IndieSocket] Client disconnected");
            _this.emit("_closed");
            _this.emit("_all");
        });
        _this.socket.on("error", function (e) {
            if (_this.debug)
                console.log("[IndieSocket] Error occured: " + e);
            _this.emit("_error", e);
            _this.emit("_all", e);
        });
        return _this;
    }
    // eslint-ignore-next-line
    IndieSocketClient.prototype.send = function (event, data) {
        if (this.debug)
            console.log("[IndieSocket] Outbound message: " + event + " with value " + JSON.stringify(data));
        this.emit("_out", event, data);
        this.emit("_io", event, data);
        this.emit("_all", event, data);
        this.socket.send(JSON.stringify([event, data]));
    };
    return IndieSocketClient;
}(events_1.EventEmitter));
exports.IndieSocketClient = IndieSocketClient;
