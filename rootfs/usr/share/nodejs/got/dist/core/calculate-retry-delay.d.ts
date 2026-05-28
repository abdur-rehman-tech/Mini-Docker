import { RetryFunction } from '.';
type Returns<T extends (...args: any) => unknown, V> = (...args: Parameters<T>) => V;
export declare const retryAfterStatusCodes: ReadonlySet<number>;
declare const calculateRetryDelay: Returns<RetryFunction, number>;
export default calculateRetryDelay;
