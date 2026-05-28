"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP = void 0;
const assert_1 = __importDefault(require("assert"));
const llparse_1 = require("llparse");
var Node = llparse_1.source.node.Node;
const constants_1 = require("./constants");
const url_1 = require("./url");
const NODES = [
    'start',
    'after_start',
    'start_req',
    'after_start_req',
    'start_res',
    'start_req_or_res',
    'req_or_res_method',
    'res_after_start',
    'res_after_protocol',
    'res_http_major',
    'res_http_dot',
    'res_http_minor',
    'res_http_end',
    'res_after_version',
    'res_status_code_digit_1',
    'res_status_code_digit_2',
    'res_status_code_digit_3',
    'res_status_code_otherwise',
    'res_status_start',
    'res_status',
    'res_line_almost_done',
    'req_first_space_before_url',
    'req_spaces_before_url',
    'req_http_start',
    'req_after_http_start',
    'req_after_protocol',
    'req_http_version',
    'req_http_major',
    'req_http_dot',
    'req_http_minor',
    'req_http_end',
    'req_http_complete',
    'req_http_complete_crlf',
    'req_pri_upgrade',
    'headers_start',
    'header_field_start',
    'header_field',
    'header_field_colon',
    'header_field_colon_discard_ws',
    'header_field_general',
    'header_field_general_otherwise',
    'header_value_discard_ws',
    'header_value_discard_ws_almost_done',
    'header_value_discard_lws',
    'header_value_start',
    'header_value',
    'header_value_otherwise',
    'header_value_lenient',
    'header_value_lenient_failed',
    'header_value_lws',
    'header_value_te_chunked',
    'header_value_te_chunked_last',
    'header_value_te_token',
    'header_value_te_token_ows',
    'header_value_content_length_once',
    'header_value_content_length',
    'header_value_content_length_ws',
    'header_value_connection',
    'header_value_connection_ws',
    'header_value_connection_token',
    'header_value_almost_done',
    'headers_almost_done',
    'headers_done',
    'chunk_size_start',
    'chunk_size_digit',
    'chunk_size',
    'chunk_size_otherwise',
    'chunk_size_almost_done',
    'chunk_size_almost_done_lf',
    'chunk_extensions',
    'chunk_extension_name',
    'chunk_extension_value',
    'chunk_extension_quoted_value',
    'chunk_extension_quoted_value_quoted_pair',
    'chunk_extension_quoted_value_done',
    'chunk_data',
    'chunk_data_almost_done',
    'chunk_complete',
    'body_identity',
    'body_identity_eof',
    'message_done',
    'eof',
    'cleanup',
    'closed',
    'restart',
];
class HTTP {
    llparse;
    url;
    TOKEN;
    span;
    callback;
    nodes = new Map();
    constructor(llparse) {
        this.llparse = llparse;
        const p = llparse;
        this.url = new url_1.URL(p);
        this.TOKEN = constants_1.TOKEN;
        this.span = {
            body: p.span(p.code.span('llhttp__on_body')),
            chunkExtensionName: p.span(p.code.span('llhttp__on_chunk_extension_name')),
            chunkExtensionValue: p.span(p.code.span('llhttp__on_chunk_extension_value')),
            headerField: p.span(p.code.span('llhttp__on_header_field')),
            headerValue: p.span(p.code.span('llhttp__on_header_value')),
            protocol: p.span(p.code.span('llhttp__on_protocol')),
            method: p.span(p.code.span('llhttp__on_method')),
            status: p.span(p.code.span('llhttp__on_status')),
            version: p.span(p.code.span('llhttp__on_version')),
        };
        this.callback = {
            // User callbacks
            onProtocolComplete: p.code.match('llhttp__on_protocol_complete'),
            onUrlComplete: p.code.match('llhttp__on_url_complete'),
            onStatusComplete: p.code.match('llhttp__on_status_complete'),
            onMethodComplete: p.code.match('llhttp__on_method_complete'),
            onVersionComplete: p.code.match('llhttp__on_version_complete'),
            onHeaderFieldComplete: p.code.match('llhttp__on_header_field_complete'),
            onHeaderValueComplete: p.code.match('llhttp__on_header_value_complete'),
            onHeadersComplete: p.code.match('llhttp__on_headers_complete'),
            onMessageBegin: p.code.match('llhttp__on_message_begin'),
            onMessageComplete: p.code.match('llhttp__on_message_complete'),
            onChunkHeader: p.code.match('llhttp__on_chunk_header'),
            onChunkExtensionName: p.code.match('llhttp__on_chunk_extension_name_complete'),
            onChunkExtensionValue: p.code.match('llhttp__on_chunk_extension_value_complete'),
            onChunkComplete: p.code.match('llhttp__on_chunk_complete'),
            onReset: p.code.match('llhttp__on_reset'),
            // Internal callbacks `src/http.c`
            beforeHeadersComplete: p.code.match('llhttp__before_headers_complete'),
            afterHeadersComplete: p.code.match('llhttp__after_headers_complete'),
            afterMessageComplete: p.code.match('llhttp__after_message_complete'),
        };
        for (const name of NODES) {
            this.nodes.set(name, p.node(name));
        }
    }
    build() {
        const p = this.llparse;
        p.property('i64', 'content_length');
        p.property('i8', 'type');
        p.property('i8', 'method');
        p.property('i8', 'http_major');
        p.property('i8', 'http_minor');
        p.property('i8', 'header_state');
        p.property('i16', 'lenient_flags');
        p.property('i8', 'upgrade');
        p.property('i8', 'finish');
        p.property('i16', 'flags');
        p.property('i16', 'status_code');
        p.property('i8', 'initial_message_completed');
        // Verify defaults
        assert_1.default.strictEqual(constants_1.FINISH.SAFE, 0);
        assert_1.default.strictEqual(constants_1.TYPE.BOTH, 0);
        // Shared settings (to be used in C wrapper)
        p.property('ptr', 'settings');
        this.buildLine();
        this.buildHeaders();
        return {
            entry: this.node('start'),
        };
    }
    buildLine() {
        const p = this.llparse;
        const span = this.span;
        const n = (name) => this.node(name);
        const url = this.url.build();
        const switchType = this.load('type', {
            [constants_1.TYPE.REQUEST]: n('start_req'),
            [constants_1.TYPE.RESPONSE]: n('start_res'),
        }, n('start_req_or_res'));
        n('start')
            .match(['\r', '\n'], n('start'))
            .otherwise(this.load('initial_message_completed', {
            1: this.invokePausable('on_reset', constants_1.ERROR.CB_RESET, n('after_start')),
        }, n('after_start')));
        n('after_start').otherwise(this.update('finish', constants_1.FINISH.UNSAFE, this.invokePausable('on_message_begin', constants_1.ERROR.CB_MESSAGE_BEGIN, switchType)));
        n('start_req_or_res')
            .peek('H', this.span.method.start(n('req_or_res_method')))
            .otherwise(this.update('type', constants_1.TYPE.REQUEST, 'start_req'));
        n('req_or_res_method')
            .select(constants_1.H_METHOD_MAP, this.store('method', this.update('type', constants_1.TYPE.REQUEST, this.span.method.end(this.invokePausable('on_method_complete', constants_1.ERROR.CB_METHOD_COMPLETE, n('req_first_space_before_url'))))))
            .match('HTTP/', this.span.method.end(this.update('type', constants_1.TYPE.RESPONSE, this.span.version.start(n('res_http_major')))))
            .otherwise(p.error(constants_1.ERROR.INVALID_CONSTANT, 'Invalid word encountered'));
        const checkVersion = (destination) => {
            const node = n(destination);
            const errorNode = this.span.version.end(p.error(constants_1.ERROR.INVALID_VERSION, 'Invalid HTTP version'));
            return this.testLenientFlags(constants_1.LENIENT_FLAGS.VERSION, {
                1: node,
            }, this.load('http_major', {
                0: this.load('http_minor', {
                    9: node,
                }, errorNode),
                1: this.load('http_minor', {
                    0: node,
                    1: node,
                }, errorNode),
                2: this.load('http_minor', {
                    0: node,
                }, errorNode),
            }, errorNode));
        };
        const checkIfAllowLFWithoutCR = (success, failure) => {
            return this.testLenientFlags(constants_1.LENIENT_FLAGS.OPTIONAL_CR_BEFORE_LF, { 1: success }, failure);
        };
        // Response
        const endResponseProtocol = () => {
            return this.span.protocol.end(this.invokePausable('on_protocol_complete', constants_1.ERROR.CB_PROTOCOL_COMPLETE, n('res_after_protocol')));
        };
        n('start_res')
            .otherwise(this.span.protocol.start(n('res_after_start')));
        n('res_after_start')
            .match(['HTTP', 'RTSP', 'ICE'], endResponseProtocol())
            .otherwise(this.span.protocol.end(p.error(constants_1.ERROR.INVALID_CONSTANT, 'Expected HTTP/, RTSP/ or ICE/')));
        n('res_after_protocol')
            .match('/', span.version.start(n('res_http_major')))
            .otherwise(p.error(constants_1.ERROR.INVALID_CONSTANT, 'Expected HTTP/, RTSP/ or ICE/'));
        n('res_http_major')
            .select(constants_1.MAJOR, this.store('http_major', 'res_http_dot'))
            .otherwise(this.span.version.end(p.error(constants_1.ERROR.INVALID_VERSION, 'Invalid major version')));
        n('res_http_dot')
            .match('.', n('res_http_minor'))
            .otherwise(this.span.version.end(p.error(constants_1.ERROR.INVALID_VERSION, 'Expected dot')));
        n('res_http_minor')
            .select(constants_1.MINOR, this.store('http_minor', checkVersion('res_http_end')))
            .otherwise(this.span.version.end(p.error(constants_1.ERROR.INVALID_VERSION, 'Invalid minor version')));
        n('res_http_end')
            .otherwise(this.span.version.end(this.invokePausable('on_version_complete', constants_1.ERROR.CB_VERSION_COMPLETE, 'res_after_version')));
        n('res_after_version')
            .match(' ', this.update('status_code', 0, 'res_status_code_digit_1'))
            .otherwise(p.error(constants_1.ERROR.INVALID_VERSION, 'Expected space after version'));
        n('res_status_code_digit_1')
            .select(constants_1.NUM_MAP, this.mulAdd('status_code', {
            overflow: p.error(constants_1.ERROR.INVALID_STATUS, 'Invalid status code'),
            success: 'res_status_code_digit_2',
        }))
            .otherwise(p.error(constants_1.ERROR.INVALID_STATUS, 'Invalid status code'));
        n('res_status_code_digit_2')
            .select(constants_1.NUM_MAP, this.mulAdd('status_code', {
            overflow: p.error(constants_1.ERROR.INVALID_STATUS, 'Invalid status code'),
            success: 'res_status_code_digit_3',
        }))
            .otherwise(p.error(constants_1.ERROR.INVALID_STATUS, 'Invalid status code'));
        n('res_status_code_digit_3')
            .select(constants_1.NUM_MAP, this.mulAdd('status_code', {
            overflow: p.error(constants_1.ERROR.INVALID_STATUS, 'Invalid status code'),
            success: 'res_status_code_otherwise',
        }))
            .otherwise(p.error(constants_1.ERROR.INVALID_STATUS, 'Invalid status code'));
        const onStatusComplete = this.invokePausable('on_status_complete', constants_1.ERROR.CB_STATUS_COMPLETE, n('headers_start'));
        n('res_status_code_otherwise')
            .match(' ', n('res_status_start'))
            .match('\r', n('res_line_almost_done'))
            .match('\n', checkIfAllowLFWithoutCR(onStatusComplete, p.error(constants_1.ERROR.INVALID_STATUS, 'Invalid response status')))
            .otherwise(p.error(constants_1.ERROR.INVALID_STATUS, 'Invalid response status'));
        n('res_status_start')
            .otherwise(span.status.start(n('res_status')));
        n('res_status')
            .peek('\r', span.status.end().skipTo(n('res_line_almost_done')))
            .peek('\n', span.status.end().skipTo(checkIfAllowLFWithoutCR(onStatusComplete, p.error(constants_1.ERROR.CR_EXPECTED, 'Missing expected CR after response line'))))
            .skipTo(n('res_status'));
        n('res_line_almost_done')
            .match(['\r', '\n'], onStatusComplete)
            .otherwise(this.testLenientFlags(constants_1.LENIENT_FLAGS.OPTIONAL_LF_AFTER_CR, {
            1: onStatusComplete,
        }, p.error(constants_1.ERROR.STRICT, 'Expected LF after CR')));
        // Request
        n('start_req').otherwise(this.span.method.start(n('after_start_req')));
        n('after_start_req')
            .select(constants_1.METHOD_MAP, this.store('method', this.span.method.end(this.invokePausable('on_method_complete', constants_1.ERROR.CB_METHOD_COMPLETE, n('req_first_space_before_url')))))
            .otherwise(p.error(constants_1.ERROR.INVALID_METHOD, 'Invalid method encountered'));
        n('req_first_space_before_url')
            .match(' ', n('req_spaces_before_url'))
            .otherwise(p.error(constants_1.ERROR.INVALID_METHOD, 'Expected space after method'));
        n('req_spaces_before_url')
            .match(' ', n('req_spaces_before_url'))
            .otherwise(this.isEqual('method', constants_1.METHODS.CONNECT, {
            equal: url.entry.connect,
            notEqual: url.entry.normal,
        }));
        const onUrlCompleteHTTP = this.invokePausable('on_url_complete', constants_1.ERROR.CB_URL_COMPLETE, n('req_http_start'));
        url.exit.toHTTP
            .otherwise(onUrlCompleteHTTP);
        const onUrlCompleteHTTP09 = this.invokePausable('on_url_complete', constants_1.ERROR.CB_URL_COMPLETE, n('headers_start'));
        url.exit.toHTTP09
            .otherwise(this.update('http_major', 0, this.update('http_minor', 9, onUrlCompleteHTTP09)));
        const checkMethod = (methods, error) => {
            const success = n('req_after_protocol');
            const failure = p.error(constants_1.ERROR.INVALID_CONSTANT, error);
            const map = {};
            for (const method of methods) {
                map[method] = success;
            }
            return this.span.protocol.end(this.invokePausable('on_protocol_complete', constants_1.ERROR.CB_PROTOCOL_COMPLETE, this.load('method', map, failure)));
        };
        n('req_http_start')
            .match(' ', n('req_http_start'))
            .otherwise(this.span.protocol.start(n('req_after_http_start')));
        n('req_after_http_start')
            .match('HTTP', checkMethod(constants_1.METHODS_HTTP, 'Invalid method for HTTP/x.x request'))
            .match('RTSP', checkMethod(constants_1.METHODS_RTSP, 'Invalid method for RTSP/x.x request'))
            .match('ICE', checkMethod(constants_1.METHODS_ICE, 'Expected SOURCE method for ICE/x.x request'))
            .otherwise(this.span.protocol.end(p.error(constants_1.ERROR.INVALID_CONSTANT, 'Expected HTTP/, RTSP/ or ICE/')));
        n('req_after_protocol')
            .match('/', n('req_http_version'))
            .otherwise(p.error(constants_1.ERROR.INVALID_CONSTANT, 'Expected HTTP/, RTSP/ or ICE/'));
        n('req_http_version').otherwise(span.version.start(n('req_http_major')));
        n('req_http_major')
            .select(constants_1.MAJOR, this.store('http_major', 'req_http_dot'))
            .otherwise(this.span.version.end(p.error(constants_1.ERROR.INVALID_VERSION, 'Invalid major version')));
        n('req_http_dot')
            .match('.', n('req_http_minor'))
            .otherwise(this.span.version.end(p.error(constants_1.ERROR.INVALID_VERSION, 'Expected dot')));
        n('req_http_minor')
            .select(constants_1.MINOR, this.store('http_minor', checkVersion('req_http_end')))
            .otherwise(this.span.version.end(p.error(constants_1.ERROR.INVALID_VERSION, 'Invalid minor version')));
        n('req_http_end').otherwise(span.version.end(this.invokePausable('on_version_complete', constants_1.ERROR.CB_VERSION_COMPLETE, this.load('method', {
            [constants_1.METHODS.PRI]: n('req_pri_upgrade'),
        }, n('req_http_complete')))));
        n('req_http_complete')
            .match('\r', n('req_http_complete_crlf'))
            .match('\n', checkIfAllowLFWithoutCR(n('req_http_complete_crlf'), p.error(constants_1.ERROR.INVALID_VERSION, 'Expected CRLF after version')))
            .otherwise(p.error(constants_1.ERROR.INVALID_VERSION, 'Expected CRLF after version'));
        n('req_http_complete_crlf')
            .match('\n', n('headers_start'))
            .otherwise(this.testLenientFlags(constants_1.LENIENT_FLAGS.OPTIONAL_LF_AFTER_CR, {
            1: n('headers_start'),
        }, p.error(constants_1.ERROR.STRICT, 'Expected CRLF after version')));
        n('req_pri_upgrade')
            .match('\r\n\r\nSM\r\n\r\n', p.error(constants_1.ERROR.PAUSED_H2_UPGRADE, 'Pause on PRI/Upgrade'))
            .otherwise(p.error(constants_1.ERROR.INVALID_VERSION, 'Expected HTTP/2 Connection Preface'));
    }
    buildHeaders() {
        this.buildHeaderField();
        this.buildHeaderValue();
    }
    buildHeaderField() {
        const p = this.llparse;
        const span = this.span;
        const n = (name) => this.node(name);
        const onInvalidHeaderFieldChar = p.error(constants_1.ERROR.INVALID_HEADER_TOKEN, 'Invalid header field char');
        n('headers_start')
            .match(' ', this.testLenientFlags(constants_1.LENIENT_FLAGS.HEADERS, {
            1: n('header_field_start'),
        }, p.error(constants_1.ERROR.UNEXPECTED_SPACE, 'Unexpected space after start line')))
            .otherwise(n('header_field_start'));
        n('header_field_start')
            .match('\r', n('headers_almost_done'))
            .match('\n', this.testLenientFlags(constants_1.LENIENT_FLAGS.OPTIONAL_CR_BEFORE_LF, {
            1: this.testFlags(constants_1.FLAGS.TRAILING, {
                1: this.invokePausable('on_chunk_complete', constants_1.ERROR.CB_CHUNK_COMPLETE, 'message_done'),
            }).otherwise(this.headersCompleted()),
        }, onInvalidHeaderFieldChar))
            .peek(':', p.error(constants_1.ERROR.INVALID_HEADER_TOKEN, 'Invalid header token'))
            .otherwise(span.headerField.start(n('header_field')));
        n('header_field')
            .transform(p.transform.toLower())
            // Match headers that need special treatment
            .select(constants_1.SPECIAL_HEADERS, this.store('header_state', 'header_field_colon'))
            .otherwise(this.resetHeaderState('header_field_general'));
        /* https://www.rfc-editor.org/rfc/rfc7230.html#section-3.3.3, paragraph 3.
         *
         * If a message is received with both a Transfer-Encoding and a
         * Content-Length header field, the Transfer-Encoding overrides the
         * Content-Length.  Such a message might indicate an attempt to
         * perform request smuggling (Section 9.5) or response splitting
         * (Section 9.4) and **ought to be handled as an error**.  A sender MUST
         * remove the received Content-Length field prior to forwarding such
         * a message downstream.
         *
         * Since llhttp 9, we go for the stricter approach and treat this as an error.
         */
        const checkInvalidTransferEncoding = (otherwise) => {
            return this.testFlags(constants_1.FLAGS.CONTENT_LENGTH, {
                1: this.testLenientFlags(constants_1.LENIENT_FLAGS.CHUNKED_LENGTH, {
                    0: p.error(constants_1.ERROR.INVALID_TRANSFER_ENCODING, 'Transfer-Encoding can\'t be present with Content-Length'),
                }).otherwise(otherwise),
            }).otherwise(otherwise);
        };
        const checkInvalidContentLength = (otherwise) => {
            return this.testFlags(constants_1.FLAGS.TRANSFER_ENCODING, {
                1: this.testLenientFlags(constants_1.LENIENT_FLAGS.CHUNKED_LENGTH, {
                    0: p.error(constants_1.ERROR.INVALID_CONTENT_LENGTH, 'Content-Length can\'t be present with Transfer-Encoding'),
                }).otherwise(otherwise),
            }).otherwise(otherwise);
        };
        const onHeaderFieldComplete = this.invokePausable('on_header_field_complete', constants_1.ERROR.CB_HEADER_FIELD_COMPLETE, this.load('header_state', {
            [constants_1.HEADER_STATE.TRANSFER_ENCODING]: checkInvalidTransferEncoding(n('header_value_discard_ws')),
            [constants_1.HEADER_STATE.CONTENT_LENGTH]: checkInvalidContentLength(n('header_value_discard_ws')),
        }, 'header_value_discard_ws'));
        const checkLenientFlagsOnColon = this.testLenientFlags(constants_1.LENIENT_FLAGS.HEADERS, {
            1: n('header_field_colon_discard_ws'),
        }, span.headerField.end().skipTo(onInvalidHeaderFieldChar));
        n('header_field_colon')
            // https://datatracker.ietf.org/doc/html/rfc7230#section-3.2.4
            // Whitespace character is not allowed between the header field-name
            // and colon. If the next token matches whitespace then throw an error.
            //
            // Add a check for the lenient flag. If the lenient flag is set, the
            // whitespace token is allowed to support legacy code not following
            // http specs.
            .peek(' ', checkLenientFlagsOnColon)
            .peek(':', span.headerField.end().skipTo(onHeaderFieldComplete))
            // Fallback to general header, there're additional characters:
            // `Connection-Duration` instead of `Connection` and so on.
            .otherwise(this.resetHeaderState('header_field_general'));
        n('header_field_colon_discard_ws')
            .match(' ', n('header_field_colon_discard_ws'))
            .otherwise(n('header_field_colon'));
        n('header_field_general')
            .match(this.TOKEN, n('header_field_general'))
            .otherwise(n('header_field_general_otherwise'));
        // Just a performance optimization, split the node so that the fast case
        // remains in `header_field_general`
        n('header_field_general_otherwise')
            .peek(':', span.headerField.end().skipTo(onHeaderFieldComplete))
            .otherwise(p.error(constants_1.ERROR.INVALID_HEADER_TOKEN, 'Invalid header token'));
    }
    buildHeaderValue() {
        const p = this.llparse;
        const span = this.span;
        const callback = this.callback;
        const n = (name) => this.node(name);
        const fallback = this.resetHeaderState('header_value');
        n('header_value_discard_ws')
            .match([' ', '\t'], n('header_value_discard_ws'))
            .match('\r', n('header_value_discard_ws_almost_done'))
            .match('\n', this.testLenientFlags(constants_1.LENIENT_FLAGS.OPTIONAL_CR_BEFORE_LF, {
            1: n('header_value_discard_lws'),
        }, p.error(constants_1.ERROR.INVALID_HEADER_TOKEN, 'Invalid header value char')))
            .otherwise(span.headerValue.start(n('header_value_start')));
        n('header_value_discard_ws_almost_done')
            .match('\n', n('header_value_discard_lws'))
            .otherwise(this.testLenientFlags(constants_1.LENIENT_FLAGS.HEADERS, {
            1: n('header_value_discard_lws'),
        }, p.error(constants_1.ERROR.STRICT, 'Expected LF after CR')));
        const onHeaderValueComplete = this.invokePausable('on_header_value_complete', constants_1.ERROR.CB_HEADER_VALUE_COMPLETE, n('header_field_start'));
        const emptyContentLengthError = p.error(constants_1.ERROR.INVALID_CONTENT_LENGTH, 'Empty Content-Length');
        const checkContentLengthEmptiness = this.load('header_state', {
            [constants_1.HEADER_STATE.CONTENT_LENGTH]: emptyContentLengthError,
        }, this.setHeaderFlags(this.emptySpan(span.headerValue, onHeaderValueComplete)));
        n('header_value_discard_lws')
            .match([' ', '\t'], this.testLenientFlags(constants_1.LENIENT_FLAGS.HEADERS, {
            1: n('header_value_discard_ws'),
        }, p.error(constants_1.ERROR.INVALID_HEADER_TOKEN, 'Invalid header value char')))
            .otherwise(checkContentLengthEmptiness);
        // Multiple `Transfer-Encoding` headers should be treated as one, but with
        // values separate by a comma.
        //
        // See: https://tools.ietf.org/html/rfc7230#section-3.2.2
        const toTransferEncoding = this.unsetFlag(constants_1.FLAGS.CHUNKED, 'header_value_te_chunked');
        // Once chunked has been selected, no other encoding is possible in requests
        // https://datatracker.ietf.org/doc/html/rfc7230#section-3.3.1
        const forbidAfterChunkedInRequest = (otherwise) => {
            return this.load('type', {
                [constants_1.TYPE.REQUEST]: this.testLenientFlags(constants_1.LENIENT_FLAGS.TRANSFER_ENCODING, {
                    0: span.headerValue.end().skipTo(p.error(constants_1.ERROR.INVALID_TRANSFER_ENCODING, 'Invalid `Transfer-Encoding` header value')),
                }).otherwise(otherwise),
            }, otherwise);
        };
        n('header_value_start')
            .otherwise(this.load('header_state', {
            [constants_1.HEADER_STATE.UPGRADE]: this.setFlag(constants_1.FLAGS.UPGRADE, fallback),
            [constants_1.HEADER_STATE.TRANSFER_ENCODING]: this.testFlags(constants_1.FLAGS.CHUNKED, {
                1: forbidAfterChunkedInRequest(this.setFlag(constants_1.FLAGS.TRANSFER_ENCODING, toTransferEncoding)),
            }, this.setFlag(constants_1.FLAGS.TRANSFER_ENCODING, toTransferEncoding)),
            [constants_1.HEADER_STATE.CONTENT_LENGTH]: n('header_value_content_length_once'),
            [constants_1.HEADER_STATE.CONNECTION]: n('header_value_connection'),
        }, 'header_value'));
        //
        // Transfer-Encoding
        //
        n('header_value_te_chunked')
            .transform(p.transform.toLowerUnsafe())
            .match('chunked', n('header_value_te_chunked_last'))
            .otherwise(n('header_value_te_token'));
        n('header_value_te_chunked_last')
            .match(' ', n('header_value_te_chunked_last'))
            .peek(['\r', '\n'], this.update('header_state', constants_1.HEADER_STATE.TRANSFER_ENCODING_CHUNKED, 'header_value_otherwise'))
            .peek(',', forbidAfterChunkedInRequest(n('header_value_te_chunked')))
            .otherwise(n('header_value_te_token'));
        n('header_value_te_token')
            .match(',', n('header_value_te_token_ows'))
            .match(constants_1.CONNECTION_TOKEN_CHARS, n('header_value_te_token'))
            .otherwise(fallback);
        n('header_value_te_token_ows')
            .match([' ', '\t'], n('header_value_te_token_ows'))
            .otherwise(n('header_value_te_chunked'));
        //
        // Content-Length
        //
        const invalidContentLength = (reason) => {
            // End span for easier testing
            // TODO(indutny): minimize code size
            return span.headerValue.end()
                .otherwise(p.error(constants_1.ERROR.INVALID_CONTENT_LENGTH, reason));
        };
        n('header_value_content_length_once')
            .otherwise(this.testFlags(constants_1.FLAGS.CONTENT_LENGTH, {
            0: n('header_value_content_length'),
        }, p.error(constants_1.ERROR.UNEXPECTED_CONTENT_LENGTH, 'Duplicate Content-Length')));
        n('header_value_content_length')
            .select(constants_1.NUM_MAP, this.mulAdd('content_length', {
            overflow: invalidContentLength('Content-Length overflow'),
            success: 'header_value_content_length',
        }))
            .otherwise(n('header_value_content_length_ws'));
        n('header_value_content_length_ws')
            .match(' ', n('header_value_content_length_ws'))
            .peek(['\r', '\n'], this.setFlag(constants_1.FLAGS.CONTENT_LENGTH, 'header_value_otherwise'))
            .otherwise(invalidContentLength('Invalid character in Content-Length'));
        //
        // Connection
        //
        n('header_value_connection')
            .transform(p.transform.toLower())
            // TODO(indutny): extra node for token back-edge?
            // Skip lws
            .match([' ', '\t'], n('header_value_connection'))
            .match('close', this.update('header_state', constants_1.HEADER_STATE.CONNECTION_CLOSE, 'header_value_connection_ws'))
            .match('upgrade', this.update('header_state', constants_1.HEADER_STATE.CONNECTION_UPGRADE, 'header_value_connection_ws'))
            .match('keep-alive', this.update('header_state', constants_1.HEADER_STATE.CONNECTION_KEEP_ALIVE, 'header_value_connection_ws'))
            .otherwise(n('header_value_connection_token'));
        n('header_value_connection_ws')
            .match(',', this.setHeaderFlags('header_value_connection'))
            .match(' ', n('header_value_connection_ws'))
            .peek(['\r', '\n'], n('header_value_otherwise'))
            .otherwise(this.resetHeaderState('header_value_connection_token'));
        n('header_value_connection_token')
            .match(',', n('header_value_connection'))
            .match(constants_1.CONNECTION_TOKEN_CHARS, n('header_value_connection_token'))
            .otherwise(n('header_value_otherwise'));
        // Split for performance reasons
        n('header_value')
            .match(constants_1.HEADER_CHARS, n('header_value'))
            .otherwise(n('header_value_otherwise'));
        const checkIfAllowLFWithoutCR = (success, failure) => {
            return this.testLenientFlags(constants_1.LENIENT_FLAGS.OPTIONAL_CR_BEFORE_LF, { 1: success }, failure);
        };
        const checkLenient = this.testLenientFlags(constants_1.LENIENT_FLAGS.HEADERS, {
            1: n('header_value_lenient'),
        }, span.headerValue.end(p.error(constants_1.ERROR.INVALID_HEADER_TOKEN, 'Invalid header value char')));
        n('header_value_otherwise')
            .peek('\r', span.headerValue.end().skipTo(n('header_value_almost_done')))
            .peek('\n', span.headerValue.end(checkIfAllowLFWithoutCR(n('header_value_almost_done'), p.error(constants_1.ERROR.CR_EXPECTED, 'Missing expected CR after header value'))))
            .otherwise(checkLenient);
        n('header_value_lenient')
            .peek('\r', span.headerValue.end().skipTo(n('header_value_almost_done')))
            .peek('\n', span.headerValue.end(n('header_value_almost_done')))
            .skipTo(n('header_value_lenient'));
        n('header_value_almost_done')
            .match('\n', n('header_value_lws'))
            .otherwise(p.error(constants_1.ERROR.LF_EXPECTED, 'Missing expected LF after header value'));
        n('header_value_lws')
            .peek([' ', '\t'], this.testLenientFlags(constants_1.LENIENT_FLAGS.HEADERS, {
            1: this.load('header_state', {
                [constants_1.HEADER_STATE.TRANSFER_ENCODING_CHUNKED]: this.resetHeaderState(span.headerValue.start(n('header_value_start'))),
            }, span.headerValue.start(n('header_value_start'))),
        }, p.error(constants_1.ERROR.INVALID_HEADER_TOKEN, 'Unexpected whitespace after header value')))
            .otherwise(this.setHeaderFlags(onHeaderValueComplete));
        const checkTrailing = this.testFlags(constants_1.FLAGS.TRAILING, {
            1: this.invokePausable('on_chunk_complete', constants_1.ERROR.CB_CHUNK_COMPLETE, 'message_done'),
        }).otherwise(this.headersCompleted());
        n('headers_almost_done')
            .match('\n', checkTrailing)
            .otherwise(this.testLenientFlags(constants_1.LENIENT_FLAGS.OPTIONAL_LF_AFTER_CR, {
            1: checkTrailing,
        }, p.error(constants_1.ERROR.STRICT, 'Expected LF after headers')));
        const upgradePause = p.pause(constants_1.ERROR.PAUSED_UPGRADE, 'Pause on CONNECT/Upgrade');
        const afterHeadersComplete = p.invoke(callback.afterHeadersComplete, {
            1: this.invokePausable('on_message_complete', constants_1.ERROR.CB_MESSAGE_COMPLETE, upgradePause),
            2: n('chunk_size_start'),
            3: n('body_identity'),
            4: n('body_identity_eof'),
            // non-chunked `Transfer-Encoding` for request, see `src/native/http.c`
            5: p.error(constants_1.ERROR.INVALID_TRANSFER_ENCODING, 'Request has invalid `Transfer-Encoding`'),
        });
        n('headers_done')
            .otherwise(afterHeadersComplete);
        upgradePause
            .otherwise(n('cleanup'));
        afterHeadersComplete
            .otherwise(this.invokePausable('on_message_complete', constants_1.ERROR.CB_MESSAGE_COMPLETE, 'cleanup'));
        n('body_identity')
            .otherwise(span.body.start()
            .otherwise(p.consume('content_length').otherwise(span.body.end(n('message_done')))));
        n('body_identity_eof')
            .otherwise(this.update('finish', constants_1.FINISH.SAFE_WITH_CB, span.body.start(n('eof'))));
        // Just read everything until EOF
        n('eof')
            .skipTo(n('eof'));
        n('chunk_size_start')
            .otherwise(this.update('content_length', 0, 'chunk_size_digit'));
        const addContentLength = this.mulAdd('content_length', {
            overflow: p.error(constants_1.ERROR.INVALID_CHUNK_SIZE, 'Chunk size overflow'),
            success: 'chunk_size',
        }, { signed: false, base: 0x10 });
        n('chunk_size_digit')
            .select(constants_1.HEX_MAP, addContentLength)
            .otherwise(p.error(constants_1.ERROR.INVALID_CHUNK_SIZE, 'Invalid character in chunk size'));
        n('chunk_size')
            .select(constants_1.HEX_MAP, addContentLength)
            .otherwise(n('chunk_size_otherwise'));
        n('chunk_size_otherwise')
            .match([' ', '\t'], this.testLenientFlags(constants_1.LENIENT_FLAGS.SPACES_AFTER_CHUNK_SIZE, {
            1: n('chunk_size_otherwise'),
        }, p.error(constants_1.ERROR.INVALID_CHUNK_SIZE, 'Invalid character in chunk size')))
            .match('\r', n('chunk_size_almost_done'))
            .match('\n', checkIfAllowLFWithoutCR(n('chunk_size_almost_done'), p.error(constants_1.ERROR.CR_EXPECTED, 'Missing expected CR after chunk size')))
            .match(';', n('chunk_extensions'))
            .otherwise(p.error(constants_1.ERROR.INVALID_CHUNK_SIZE, 'Invalid character in chunk size'));
        const onChunkExtensionNameCompleted = (destination) => {
            return this.invokePausable('on_chunk_extension_name', constants_1.ERROR.CB_CHUNK_EXTENSION_NAME_COMPLETE, destination);
        };
        const onChunkExtensionValueCompleted = (destination) => {
            return this.invokePausable('on_chunk_extension_value', constants_1.ERROR.CB_CHUNK_EXTENSION_VALUE_COMPLETE, destination);
        };
        n('chunk_extensions')
            .match(' ', p.error(constants_1.ERROR.STRICT, 'Invalid character in chunk extensions'))
            .match('\r', p.error(constants_1.ERROR.STRICT, 'Invalid character in chunk extensions'))
            .otherwise(this.span.chunkExtensionName.start(n('chunk_extension_name')));
        n('chunk_extension_name')
            .match(constants_1.TOKEN, n('chunk_extension_name'))
            .peek('=', this.span.chunkExtensionName.end().skipTo(this.span.chunkExtensionValue.start(onChunkExtensionNameCompleted(n('chunk_extension_value')))))
            .peek(';', this.span.chunkExtensionName.end().skipTo(onChunkExtensionNameCompleted(n('chunk_extensions'))))
            .peek('\r', this.span.chunkExtensionName.end().skipTo(onChunkExtensionNameCompleted(n('chunk_size_almost_done'))))
            .peek('\n', this.span.chunkExtensionName.end(onChunkExtensionNameCompleted(checkIfAllowLFWithoutCR(n('chunk_size_almost_done'), p.error(constants_1.ERROR.CR_EXPECTED, 'Missing expected CR after chunk extension name')))))
            .otherwise(this.span.chunkExtensionName.end().skipTo(p.error(constants_1.ERROR.STRICT, 'Invalid character in chunk extensions name')));
        n('chunk_extension_value')
            .match('"', n('chunk_extension_quoted_value'))
            .match(constants_1.TOKEN, n('chunk_extension_value'))
            .peek(';', this.span.chunkExtensionValue.end().skipTo(onChunkExtensionValueCompleted(n('chunk_extensions'))))
            .peek('\r', this.span.chunkExtensionValue.end().skipTo(onChunkExtensionValueCompleted(n('chunk_size_almost_done'))))
            .peek('\n', this.span.chunkExtensionValue.end(onChunkExtensionValueCompleted(checkIfAllowLFWithoutCR(n('chunk_size_almost_done'), p.error(constants_1.ERROR.CR_EXPECTED, 'Missing expected CR after chunk extension value')))))
            .otherwise(this.span.chunkExtensionValue.end().skipTo(p.error(constants_1.ERROR.STRICT, 'Invalid character in chunk extensions value')));
        n('chunk_extension_quoted_value')
            .match(constants_1.QUOTED_STRING, n('chunk_extension_quoted_value'))
            .match('"', this.span.chunkExtensionValue.end(onChunkExtensionValueCompleted(n('chunk_extension_quoted_value_done'))))
            .match('\\', n('chunk_extension_quoted_value_quoted_pair'))
            .otherwise(this.span.chunkExtensionValue.end().skipTo(p.error(constants_1.ERROR.STRICT, 'Invalid character in chunk extensions quoted value')));
        n('chunk_extension_quoted_value_quoted_pair')
            .match(constants_1.HTAB_SP_VCHAR_OBS_TEXT, n('chunk_extension_quoted_value'))
            .otherwise(this.span.chunkExtensionValue.end().skipTo(p.error(constants_1.ERROR.STRICT, 'Invalid quoted-pair in chunk extensions quoted value')));
        n('chunk_extension_quoted_value_done')
            .match(';', n('chunk_extensions'))
            .match('\r', n('chunk_size_almost_done'))
            .peek('\n', checkIfAllowLFWithoutCR(n('chunk_size_almost_done'), p.error(constants_1.ERROR.CR_EXPECTED, 'Missing expected CR after chunk extension value')))
            .otherwise(p.error(constants_1.ERROR.STRICT, 'Invalid character in chunk extensions quote value'));
        n('chunk_size_almost_done')
            .match('\n', n('chunk_size_almost_done_lf'))
            .otherwise(this.testLenientFlags(constants_1.LENIENT_FLAGS.OPTIONAL_LF_AFTER_CR, {
            1: n('chunk_size_almost_done_lf'),
        }).otherwise(p.error(constants_1.ERROR.STRICT, 'Expected LF after chunk size')));
        const toChunk = this.isEqual('content_length', 0, {
            equal: this.setFlag(constants_1.FLAGS.TRAILING, 'header_field_start'),
            notEqual: 'chunk_data',
        });
        n('chunk_size_almost_done_lf')
            .otherwise(this.invokePausable('on_chunk_header', constants_1.ERROR.CB_CHUNK_HEADER, toChunk));
        n('chunk_data')
            .otherwise(span.body.start()
            .otherwise(p.consume('content_length').otherwise(span.body.end(n('chunk_data_almost_done')))));
        n('chunk_data_almost_done')
            .match('\r\n', n('chunk_complete'))
            .match('\n', checkIfAllowLFWithoutCR(n('chunk_complete'), p.error(constants_1.ERROR.CR_EXPECTED, 'Missing expected CR after chunk data')))
            .otherwise(this.testLenientFlags(constants_1.LENIENT_FLAGS.OPTIONAL_CRLF_AFTER_CHUNK, {
            1: n('chunk_complete'),
        }).otherwise(p.error(constants_1.ERROR.STRICT, 'Expected LF after chunk data')));
        n('chunk_complete')
            .otherwise(this.invokePausable('on_chunk_complete', constants_1.ERROR.CB_CHUNK_COMPLETE, 'chunk_size_start'));
        const upgradeAfterDone = this.isEqual('upgrade', 1, {
            // Exit, the rest of the message is in a different protocol.
            equal: upgradePause,
            // Restart
            notEqual: 'cleanup',
        });
        n('message_done')
            .otherwise(this.invokePausable('on_message_complete', constants_1.ERROR.CB_MESSAGE_COMPLETE, upgradeAfterDone));
        const lenientClose = this.testLenientFlags(constants_1.LENIENT_FLAGS.KEEP_ALIVE, {
            1: n('restart'),
        }, n('closed'));
        // Check if we'd like to keep-alive
        n('cleanup')
            .otherwise(p.invoke(callback.afterMessageComplete, {
            1: this.update('content_length', 0, n('restart')),
        }, this.update('finish', constants_1.FINISH.SAFE, lenientClose)));
        const lenientDiscardAfterClose = this.testLenientFlags(constants_1.LENIENT_FLAGS.DATA_AFTER_CLOSE, {
            1: n('closed'),
        }, p.error(constants_1.ERROR.CLOSED_CONNECTION, 'Data after `Connection: close`'));
        n('closed')
            .match(['\r', '\n'], n('closed'))
            .skipTo(lenientDiscardAfterClose);
        n('restart')
            .otherwise(this.update('initial_message_completed', 1, this.update('finish', constants_1.FINISH.SAFE, n('start'))));
    }
    headersCompleted() {
        const p = this.llparse;
        const callback = this.callback;
        const n = (name) => this.node(name);
        // Set `upgrade` if needed
        const beforeHeadersComplete = p.invoke(callback.beforeHeadersComplete);
        /* Here we call the headers_complete callback. This is somewhat
         * different than other callbacks because if the user returns 1, we
         * will interpret that as saying that this message has no body. This
         * is needed for the annoying case of receiving a response to a HEAD
         * request.
         *
         * We'd like to use CALLBACK_NOTIFY_NOADVANCE() here but we cannot, so
         * we have to simulate it by handling a change in errno below.
         */
        const onHeadersComplete = p.invoke(callback.onHeadersComplete, {
            0: n('headers_done'),
            1: this.setFlag(constants_1.FLAGS.SKIPBODY, 'headers_done'),
            2: this.update('upgrade', 1, this.setFlag(constants_1.FLAGS.SKIPBODY, 'headers_done')),
            [constants_1.ERROR.PAUSED]: this.pause('Paused by on_headers_complete', 'headers_done'),
        }, p.error(constants_1.ERROR.CB_HEADERS_COMPLETE, 'User callback error'));
        beforeHeadersComplete.otherwise(onHeadersComplete);
        return beforeHeadersComplete;
    }
    node(name) {
        if (name instanceof Node) {
            return name;
        }
        (0, assert_1.default)(this.nodes.has(name), `Unknown node with name "${name}"`);
        return this.nodes.get(name);
    }
    load(field, map, next) {
        const p = this.llparse;
        const res = p.invoke(p.code.load(field), map);
        if (next !== undefined) {
            res.otherwise(this.node(next));
        }
        return res;
    }
    store(field, next) {
        const p = this.llparse;
        const res = p.invoke(p.code.store(field));
        if (next !== undefined) {
            res.otherwise(this.node(next));
        }
        return res;
    }
    update(field, value, next) {
        const p = this.llparse;
        const res = p.invoke(p.code.update(field, value));
        if (next !== undefined) {
            res.otherwise(this.node(next));
        }
        return res;
    }
    resetHeaderState(next) {
        return this.update('header_state', constants_1.HEADER_STATE.GENERAL, next);
    }
    emptySpan(span, next) {
        return span.start(span.end(this.node(next)));
    }
    unsetFlag(flag, next) {
        const p = this.llparse;
        return p.invoke(p.code.and('flags', ~flag), this.node(next));
    }
    setFlag(flag, next) {
        const p = this.llparse;
        return p.invoke(p.code.or('flags', flag), this.node(next));
    }
    testFlags(flag, map, next) {
        const p = this.llparse;
        const res = p.invoke(p.code.test('flags', flag), map);
        if (next !== undefined) {
            res.otherwise(this.node(next));
        }
        return res;
    }
    testLenientFlags(flag, map, next) {
        const p = this.llparse;
        const res = p.invoke(p.code.test('lenient_flags', flag), map);
        if (next !== undefined) {
            res.otherwise(this.node(next));
        }
        return res;
    }
    setHeaderFlags(next) {
        const HS = constants_1.HEADER_STATE;
        const F = constants_1.FLAGS;
        const toConnection = this.update('header_state', constants_1.HEADER_STATE.CONNECTION, next);
        return this.load('header_state', {
            [HS.CONNECTION_KEEP_ALIVE]: this.setFlag(F.CONNECTION_KEEP_ALIVE, toConnection),
            [HS.CONNECTION_CLOSE]: this.setFlag(F.CONNECTION_CLOSE, toConnection),
            [HS.CONNECTION_UPGRADE]: this.setFlag(F.CONNECTION_UPGRADE, toConnection),
            [HS.TRANSFER_ENCODING_CHUNKED]: this.setFlag(F.CHUNKED, next),
        }, this.node(next));
    }
    mulAdd(field, targets, options = { base: 10, signed: false }) {
        const p = this.llparse;
        return p.invoke(p.code.mulAdd(field, options), {
            1: this.node(targets.overflow),
        }, this.node(targets.success));
    }
    isEqual(field, value, map) {
        const p = this.llparse;
        return p.invoke(p.code.isEqual(field, value), {
            0: this.node(map.notEqual),
        }, this.node(map.equal));
    }
    pause(msg, next) {
        const p = this.llparse;
        const res = p.pause(constants_1.ERROR.PAUSED, msg);
        if (next !== undefined) {
            res.otherwise(this.node(next));
        }
        return res;
    }
    invokePausable(name, errorCode, next) {
        let cb;
        switch (name) {
            case 'on_message_begin':
                cb = this.callback.onMessageBegin;
                break;
            case 'on_protocol_complete':
                cb = this.callback.onProtocolComplete;
                break;
            case 'on_url_complete':
                cb = this.callback.onUrlComplete;
                break;
            case 'on_status_complete':
                cb = this.callback.onStatusComplete;
                break;
            case 'on_method_complete':
                cb = this.callback.onMethodComplete;
                break;
            case 'on_version_complete':
                cb = this.callback.onVersionComplete;
                break;
            case 'on_header_field_complete':
                cb = this.callback.onHeaderFieldComplete;
                break;
            case 'on_header_value_complete':
                cb = this.callback.onHeaderValueComplete;
                break;
            case 'on_message_complete':
                cb = this.callback.onMessageComplete;
                break;
            case 'on_chunk_header':
                cb = this.callback.onChunkHeader;
                break;
            case 'on_chunk_extension_name':
                cb = this.callback.onChunkExtensionName;
                break;
            case 'on_chunk_extension_value':
                cb = this.callback.onChunkExtensionValue;
                break;
            case 'on_chunk_complete':
                cb = this.callback.onChunkComplete;
                break;
            case 'on_reset':
                cb = this.callback.onReset;
                break;
            default:
                throw new Error('Unknown callback: ' + name);
        }
        const p = this.llparse;
        return p.invoke(cb, {
            0: this.node(next),
            [constants_1.ERROR.PAUSED]: this.pause(`${name} pause`, next),
        }, p.error(errorCode, `\`${name}\` callback error`));
    }
}
exports.HTTP = HTTP;
//# sourceMappingURL=http.js.map