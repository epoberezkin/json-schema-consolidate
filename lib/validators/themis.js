'use strict';


var Themis = require('themis')
    , stableStringify = require('json-stable-stringify')
    , util = require('./_util');


module.exports = Validator;


function Validator(opts) {
    if (!(this instanceof Validator)) return new Validator(opts);
    var self = this;

    this._opts = util.copy(opts);
    var _schemas = this._opts.schemas = this._opts.schemas || {};
    var _schemasArray = [];
    var _formats = this._opts.formats = this._opts.formats || {};
    this._compiled = {};

    // this is done on purpose, so that methods are bound to the instance without using bind
    this.validate = validate;
    this.compile = compile;
    this.addSchema = addSchema;
    this.getSchema = getSchema;

    for (var id in _schemas) {
        _schemas[id] = util.parse(_schemas[id]);
        _schemasArray.push(_schemas[id]);
    }
    for (var f in _formats) Themis.registerFormat(f, util.regexp(_formats[f]));


    function validate(schema, json) {
        var v = compile(schema);
        return v(json);
    }


    function compile(schema) {
        schema = util.parse(schema);
        var schemaStr = stableStringify(schema);
        var v = self._compiled[schemaStr];
        if (!v) {
            var schemas = _schemasArray.length ? _schemasArray.concat(schema) : schema;
            v = self._compiled[schemaStr] = Themis.validator(schemas, self._opts);
        }

        return function validate(json) {
            return v(json, schema.id || '0');
        };
    }


    function addSchema(schema, id) {
        schema = util.parse(schema);
        if (Array.isArray(schema))
            return schema.forEach(function(s) { addSchema(s); }); // !!! second parameter must be undefined, so you can't just pass addSchema to forEach
        var id = id || schema.id;
        _schemas[id] = schema;
        _schemasArray.push(schema);
    }


    function getSchema(id) {
        return _schemas[id];
    }
}


// function convertOpts(opts) {
//     var _opts = opts ? util.copy(opts) : {};
//     _opts.greedy = _opts.allErrors;
//     return _opts;
// }
