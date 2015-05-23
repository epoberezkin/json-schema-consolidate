'use strict';


var ss = require('schemasaurus')
    , stableStringify = require('json-stable-stringify')
    , util = require('./_util');


module.exports = Validator;


function Validator(opts) {
    if (!(this instanceof Validator)) return new Validator(opts);
    var self = this;

    this._opts = util.copy(opts);
    if (this._opts.schemas) console.error('schemasaurus: referencing other schemas not supported');
    var _formats = this._opts.formats || {};
    this._compiled = {};

    // this is done on purpose, so that methods are bound to the instance without using bind
    this.validate = validate;
    this.compile = compile;
    this.addSchema = addSchema;
    this.getSchema = getSchema;

    for (var f in _formats) _formats[f] = { regexp: _formats[f], message: 'not matching ' + f };


    function validate(schema, json) {
        var v = compile(schema);
        return v(json);
    }


    function compile(schema) {
        schema = util.parse(schema);
        var schemaStr = stableStringify(schema);
        var v = self._compiled[schemaStr]
        if (!v) v = self._compiled[schemaStr] = ss.newValidator(schema, self._opts);

        return function validate(json) {
            return v(json);
        };
    }


    function addSchema(schema, id) {
        throw new Error('jsen: adding schema is not supported');
    }


    function getSchema(id) {
        throw new Error('jsen: adding schema is not supported');
    }
}
