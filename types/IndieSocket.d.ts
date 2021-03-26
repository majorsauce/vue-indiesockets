export { IndieSocketServer } from "./IndieSocketServer";
export { IndieSocketClient } from "./IndieSocketClient";
export declare class IndieSocket {
    url: string;
    options: {};
    constructor(url: string, options?: {
        debug?: boolean;
        autoReconnect?: boolean;
    });
    install(Vue: any): void;
}
