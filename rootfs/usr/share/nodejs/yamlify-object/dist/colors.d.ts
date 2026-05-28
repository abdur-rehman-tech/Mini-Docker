/**
 * Default colors for all supported value types
 */
export type Colors = {
    base?(string: any): string;
    date?(string: any): string;
    error?(string: any): string;
    symbol?(string: any): string;
    string?(string: any): string;
    number?(string: any): string;
    boolean?(string: any): string;
    regexp?(string: any): string;
    null?(string: any): string;
    undefined?(string: any): string;
};
export declare const colors: Colors;
