import { Same } from './same';
export declare class Has extends Same {
    simpleMatch(): void;
    isArray(): boolean;
    getPojoEntries(obj: any): [string, any][];
    printMapEntryUnexpected(_key: any, _val: any): void;
    get objectAsArray(): any[] | null;
    printErrorBody(): void;
    printSetBody(): void;
}
