'use strict';

function throws(name, entry, condition) {
    throw new Error(condition
        ? `No known conditions for "${entry}" specifier in "${name}" package`
        : `Missing "${entry}" specifier in "${name}" package`);
}
function conditions(options) {
    let out = new Set(['default', ...options.conditions || []]);
    options.unsafe || out.add(options.require ? 'require' : 'import');
    options.unsafe || out.add(options.browser ? 'browser' : 'node');
    return out;
}
function walk(name, mapping, input, options) {
    let entry = toEntry(name, input);
    let c = conditions(options || {});
    let m = mapping[entry];
    let v, replace;
    if (m === void 0) {
        // loop for longest key match
        let match;
        let longest;
        let tmp;
        let key;
        for (key in mapping) {
            if (longest && key.length < longest.length) ;
            else if (key[key.length - 1] === '/' && entry.startsWith(key)) {
                replace = entry.substring(key.length);
                longest = key;
            }
            else if (key.length > 1) {
                tmp = key.indexOf('*', 1);
                if (!!~tmp) {
                    match = RegExp('^' + key.substring(0, tmp) + '(.*)' + key.substring(1 + tmp)).exec(entry);
                    if (match && match[1]) {
                        replace = match[1];
                        longest = key;
                    }
                }
            }
        }
        m = mapping[longest];
    }
    if (!m) {
        // missing export
        throws(name, entry);
    }
    v = loop(m, c);
    // unknown condition(s)
    if (!v)
        throws(name, entry, 1);
    if (replace)
        injects(v, replace);
    return v;
}
/** @note: mutates! */
function injects(items, value) {
    let i = 0, len = items.length, tmp;
    let rgx1 = /[*]/g, rgx2 = /[/]$/;
    for (; i < len; i++) {
        items[i] = rgx1.test(tmp = items[i])
            ? tmp.replace(rgx1, value)
            : rgx2.test(tmp)
                ? (tmp + value)
                : tmp;
    }
}
function toEntry(name, ident, externals) {
    if (name === ident || ident === '.')
        return '.';
    let root = name + '/', len = root.length;
    let bool = ident.slice(0, len) === root;
    let output = bool ? ident.slice(len) : ident;
    if (output[0] === '#')
        return output;
    return (bool || !externals)
        ? (output.slice(0, 2) === './' ? output : './' + output)
        : output;
}
function loop(m, keys, result) {
    if (m) {
        if (typeof m === 'string') {
            if (result)
                result.add(m);
            return [m];
        }
        let idx, arr;
        if (Array.isArray(m)) {
            arr = result || new Set;
            for (idx = 0; idx < m.length; idx++) {
                loop(m[idx], keys, arr);
            }
            // return if initialized set
            if (!result && arr.size) {
                return [...arr];
            }
        }
        else
            for (idx in m) {
                if (keys.has(idx)) {
                    return loop(m[idx], keys, result);
                }
            }
    }
}

function legacy(pkg, options = {}) {
    let i = 0, value, browser = options.browser, fields = options.fields || ['module', 'main'], isSTRING = typeof browser == 'string';
    if (browser && !fields.includes('browser')) {
        fields.unshift('browser');
        // "module-a" -> "module-a"
        // "./path/file.js" -> "./path/file.js"
        // "foobar/path/file.js" -> "./path/file.js"
        if (isSTRING)
            browser = toEntry(pkg.name, browser, true);
    }
    for (; i < fields.length; i++) {
        if (value = pkg[fields[i]]) {
            if (typeof value == 'string') ;
            else if (typeof value == 'object' && fields[i] == 'browser') {
                if (isSTRING) {
                    value = value[browser];
                    if (value == null)
                        return browser;
                }
            }
            else {
                continue;
            }
            return typeof value == 'string'
                ? ('./' + value.replace(/^\.?\//, ''))
                : value;
        }
    }
}

function exports$1(pkg, input, options) {
    let map = pkg.exports, k;
    if (map) {
        if (typeof map === 'string') {
            map = { '.': map };
        }
        else
            for (k in map) {
                // convert {conditions} to "."={condtions}
                if (k[0] !== '.')
                    map = { '.': map };
                break;
            }
        return walk(pkg.name, map, input || '.', options);
    }
}
function imports(pkg, input, options) {
    if (pkg.imports)
        return walk(pkg.name, pkg.imports, input, options);
}
function resolve(pkg, input, options) {
    // let entry = input && input !== '.'
    // 	? toEntry(pkg.name, input)
    // 	: '.';
    input = toEntry(pkg.name, input || '.');
    return input[0] === '#'
        ? imports(pkg, input, options)
        : exports$1(pkg, input, options);
}

exports.exports = exports$1;
exports.imports = imports;
exports.legacy = legacy;
exports.resolve = resolve;
