/// <reference types="node" />
import { EventEmitter } from "events";
export declare class IndieSocketClient extends EventEmitter {
    socket: any;
    debug: boolean;
    constructor(socket: any, debug?: boolean);
    send(event: string, data?: any): void;
}
