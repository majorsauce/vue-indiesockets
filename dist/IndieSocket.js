"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndieSocket = void 0;
var IndieSocketServer_1 = require("./IndieSocketServer");
Object.defineProperty(exports, "IndieSocketServer", { enumerable: true, get: function () { return IndieSocketServer_1.IndieSocketServer; } });
var IndieSocketClient_1 = require("./IndieSocketClient");
Object.defineProperty(exports, "IndieSocketClient", { enumerable: true, get: function () { return IndieSocketClient_1.IndieSocketClient; } });
var Socket = /** @class */ (function () {
    function Socket(vue, url, options) {
        this.ws = undefined;
        this.listeners = new Map();
        this._connected = false;
        this.options = { debug: false, autoReconnect: true };
        this.url = url;
        this.options = __assign(__assign({}, this.options), options);
        this.responsiveStore = new vue({
            data: function () { return ({
                connected: false
            }); }
        });
        this._init(url);
    }
    Object.defineProperty(Socket.prototype, "connected", {
        get: function () {
            return this.responsiveStore.connected;
        },
        enumerable: false,
        configurable: true
    });
    Socket.prototype._init = function (url) {
        var _this = this;
        this.ws = new WebSocket(url);
        this.ws.onopen = function () {
            var _a, _b;
            if (_this.options.debug)
                console.log("[IndieSocket] Connected to " + url);
            (_a = _this.listeners.get("_connected")) === null || _a === void 0 ? void 0 : _a.forEach(function (listener) { return listener.callback.call(listener.vm); });
            (_b = _this.listeners.get("_all")) === null || _b === void 0 ? void 0 : _b.forEach(function (listener) { return listener.callback.call(listener.vm); });
            _this.responsiveStore.connected = true;
        };
        this.ws.onclose = function () {
            var _a, _b;
            if (_this.options.debug)
                console.log("[IndieSocket] Disconnected");
            _this.responsiveStore.connected = false;
            (_a = _this.listeners.get("_closed")) === null || _a === void 0 ? void 0 : _a.forEach(function (listener) { return listener.callback.call(listener.vm); });
            (_b = _this.listeners.get("_all")) === null || _b === void 0 ? void 0 : _b.forEach(function (listener) { return listener.callback.call(listener.vm); });
            _this.reconnect();
        };
        this.ws.onmessage = function (message) {
            var _a, _b, _c, _d;
            var _e = JSON.parse(message.data), event = _e[0], data = _e[1];
            if (_this.options.debug)
                console.log("[IndieSocket] Inbound message: " + event + " with value " + JSON.stringify(data));
            (_a = _this.listeners.get(event)) === null || _a === void 0 ? void 0 : _a.forEach(function (listener) { return listener.callback.call(listener.vm, data); });
            (_b = _this.listeners.get("_in")) === null || _b === void 0 ? void 0 : _b.forEach(function (listener) { return listener.callback.call(listener.vm, data); });
            (_c = _this.listeners.get("_io")) === null || _c === void 0 ? void 0 : _c.forEach(function (listener) { return listener.callback.call(listener.vm, data); });
            (_d = _this.listeners.get("_all")) === null || _d === void 0 ? void 0 : _d.forEach(function (listener) { return listener.callback.call(listener.vm, data); });
        };
        this.ws.onerror = function (e) {
            var _a, _b;
            if (_this.options.debug)
                console.log("[IndieSocket] Error " + JSON.stringify(e));
            (_a = _this.listeners.get("_error")) === null || _a === void 0 ? void 0 : _a.forEach(function (listener) { return listener.callback.call(listener.vm, e); });
            (_b = _this.listeners.get("_all")) === null || _b === void 0 ? void 0 : _b.forEach(function (listener) { return listener.callback.call(listener.vm, e); });
            _this.reconnect();
        };
    };
    Socket.prototype.reconnect = function () {
        var _a;
        if (this.options.autoReconnect != true || ((_a = this.ws) === null || _a === void 0 ? void 0 : _a.readyState) != 3)
            return;
        if (this.options.debug)
            console.log("[IndieSocket] Trying to reconnect to " + this.url);
        this.ws = undefined;
        this._init(this.url);
    };
    Socket.prototype.addListener = function (vm, key, callback) {
        var _a;
        if (this.options.debug)
            console.log("[IndieSocket] Adding listener for messsage " + key);
        if (!this.listeners.has(key))
            this.listeners.set(key, []);
        (_a = this.listeners.get(key)) === null || _a === void 0 ? void 0 : _a.push({ vm: vm, callback: callback });
    };
    // eslint-disable-next-line
    Socket.prototype.send = function (name) {
        var _a, _b, _c, _d;
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        if (this.options.debug)
            console.log("[IndieSocket] Outbound message: " + name + " with value " + JSON.stringify(data));
        (_a = this.ws) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify([name, data]));
        (_b = this.listeners.get("_out")) === null || _b === void 0 ? void 0 : _b.forEach(function (listener) { return listener.callback.call(listener.vm, data); });
        (_c = this.listeners.get("_io")) === null || _c === void 0 ? void 0 : _c.forEach(function (listener) { return listener.callback.call(listener.vm, data); });
        (_d = this.listeners.get("_all")) === null || _d === void 0 ? void 0 : _d.forEach(function (listener) { return listener.callback.call(listener.vm, data); });
    };
    return Socket;
}());
var IndieSocket = /** @class */ (function () {
    function IndieSocket(url, options) {
        this.options = {};
        this.url = url;
        this.options = options || {};
    }
    // eslint-disable-next-line
    IndieSocket.prototype.install = function (vue) {
        try {
            var socket = new Socket(vue, this.url, this.options);
            vue.prototype.$socket = socket;
            if (socket.options.debug)
                console.log("[IndieSocket] Vue initialization started for " + this.url);
            vue.mixin({
                created: function () {
                    var handlers = this.$options.sockets || {};
                    for (var key in handlers)
                        if (typeof handlers[key] === 'function') {
                            this.$socket.addListener(this, key, handlers[key]);
                            if (this.$socket.options.debug)
                                console.log("[IndieSocket] Registered handler " + key);
                        }
                },
            });
        }
        catch (e) {
            console.log(e);
        }
    };
    return IndieSocket;
}());
exports.IndieSocket = IndieSocket;
