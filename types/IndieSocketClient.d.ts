/// <reference types="node" />
import { EventEmitter } from "events";
export default class IndieSocketClient extends EventEmitter {
    socket: any;
    debug: boolean;
    constructor(socket: any, debug?: boolean);
    send(name: string, data: any): void;
}
