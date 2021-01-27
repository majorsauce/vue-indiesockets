export { IndieSocketServer } from "./IndieSocketServer";
export { IndieSocketClient } from "./IndieSocketClient";
export declare class IndieSocket {
    install(Vue: any, url: string, options?: {
        debug: boolean;
        autoReconnect: boolean;
    }): void;
}
