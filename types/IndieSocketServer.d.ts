/// <reference types="node" />
import { EventEmitter } from "events";
export declare class IndieSocketServer extends EventEmitter {
    debug: boolean
	constructor(server: any, debug?: boolean)
}
