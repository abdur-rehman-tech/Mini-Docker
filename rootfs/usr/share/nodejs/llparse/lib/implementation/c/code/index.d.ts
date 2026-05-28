import * as frontend from 'llparse-frontend';
import { And } from './and';
import { External } from './external';
import { IsEqual } from './is-equal';
import { Load } from './load';
import { MulAdd } from './mul-add';
import { Or } from './or';
import { Store } from './store';
import { Test } from './test';
import { Update } from './update';
export * from './base';
declare class Match extends External<frontend.code.External> {
}
declare class Span extends External<frontend.code.Span> {
}
declare class Value extends External<frontend.code.Value> {
}
declare const _default: {
    And: typeof And;
    IsEqual: typeof IsEqual;
    Load: typeof Load;
    Match: typeof Match;
    MulAdd: typeof MulAdd;
    Or: typeof Or;
    Span: typeof Span;
    Store: typeof Store;
    Test: typeof Test;
    Update: typeof Update;
    Value: typeof Value;
};
export default _default;
