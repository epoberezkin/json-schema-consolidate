'use strict';


module.exports = {
    copy: copy,
    parse: parse,
    regexp: regexp
};


function copy(o, to) {
    to = to || {};
    for (var key in o) to[key] = o[key];
    return to;
}


function parse(schema) {
    return typeof schema == 'string' ? JSON.parse(schema) : schema;
}


function regexp(format) {
    return format instanceof RegExp ? testRegExp : format;

    function testRegExp(data) {
        return typeof data == 'string' && format.test(data);
    }
}
