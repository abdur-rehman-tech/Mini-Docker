import * as frontend from 'llparse-frontend';
import { Consume } from './consume';
import { Empty } from './empty';
import { Error as ErrorNode } from './error';
import { Invoke } from './invoke';
import { Pause } from './pause';
import { Sequence } from './sequence';
import { Single } from './single';
import { SpanEnd } from './span-end';
import { SpanStart } from './span-start';
import { TableLookup } from './table-lookup';
export { Node } from './base';
declare class Error extends ErrorNode<frontend.node.Error> {
}
declare const _default: {
    Consume: typeof Consume;
    Empty: typeof Empty;
    Error: typeof Error;
    Invoke: typeof Invoke;
    Pause: typeof Pause;
    Sequence: typeof Sequence;
    Single: typeof Single;
    SpanEnd: typeof SpanEnd;
    SpanStart: typeof SpanStart;
    TableLookup: typeof TableLookup;
};
export default _default;
