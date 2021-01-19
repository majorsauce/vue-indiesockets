/// <reference types="node" />
import { EventEmitter } from "events";
export default class IndieSocketServer extends EventEmitter {
    debug: boolean;
    constructor(server: any, debug?: boolean);
}
