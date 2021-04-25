export { IndieSocketServer } from "./IndieSocketServer";
export { IndieSocketClient } from "./IndieSocketClient";
export declare class IndieSocket {
    url: string;
    options: any;
    constructor(url: string, options?: {
        debug?: boolean;
        autoReconnect?: boolean;
    });
    install(vue: any): void;
}
