'use strict';

require('coffee-script/register');

var JSCK = require('jsck')
    , stableStringify = require('json-stable-stringify')
    , util = require('./_util');


module.exports = Validator;


function Validator(opts) {
    if (!(this instanceof Validator)) return new Validator(opts);
    var self = this;

    this._opts = util.copy(opts);
    var _schemas = this._opts.schemas = this._opts.schemas || {};
    if (this._opts.formats) console.error('jsck: custom formats not supported');

    this.jsck = new JSCK.draft4();
    this._compiled = {};

    for (var id in _schemas) addSchema(_schemas[id]);

    // this is done on purpose, so that methods are bound to the instance without using bind
    this.validate = validate;
    this.compile = compile;
    this.addSchema = addSchema;
    this.getSchema = getSchema;


    function validate(schema, json) {
        var v = compile(schema);
        return v(json);
    }


    function compile(schema) {
        schema = util.parse(schema);
        var schemaStr = stableStringify(schema);
        var v = self._compiled[schemaStr];
        if (!v) {
            if (schema.id) {
                self.jsck.add(schema);
                v = self.jsck.validator({uri: schema.id});
            } else {
                v = new JSCK.draft4(schema);
            }
            self._compiled[schemaStr] = v;
        }

        return function validate(json) {
            return v.validate(json);
        };
    }


    function addSchema(schema, id) {
        schema = util.parse(schema);
        if (!schema.id || (id && id != schema.id))
            throw new Error('jsck: no schema.id or id is passed and is diferent');
        self.jsck.add(schema);
        _schemas[schema.id] = schema;
    }


    function getSchema(id) {
        return _schemas[id];
    }
}
