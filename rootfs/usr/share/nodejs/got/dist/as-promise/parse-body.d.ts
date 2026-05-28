import { ResponseType, Response, ParseJsonFunction } from './types';
declare const parseBody: (response: Response, responseType: ResponseType, parseJson: ParseJsonFunction, encoding?: BufferEncoding) => unknown;
export default parseBody;
