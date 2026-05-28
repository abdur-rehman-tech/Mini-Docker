import { Colors } from './colors';
export type Config = {
    indent?: string;
    prefix?: string;
    postfix?: string;
    errorToString?(Error: any, string?: any): string;
    dateToString?(Date: any): string;
    colors?: Colors;
};
export declare const defaultConfig: Config;
export declare function getConfig(config?: Config): Config;
