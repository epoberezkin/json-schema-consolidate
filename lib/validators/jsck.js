'use strict';

require('coffee-script/register');

var jsck = require('jsck')
    , stableStringify = require('json-stable-stringify')
    , util = require('./_util');


module.exports = Validator;


function Validator(opts) {
    if (!(this instanceof Validator)) return new Validator(opts);
    var self = this;

    if (opts) {
        if (opts.schemas) console.error('jsck: referencing other schemas not supported');
        if (opts.formats) console.error('jsck: custom formats not supported');
    }
    this._compiled = {};

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
        if (!v) v = self._compiled[schemaStr] = new jsck.draft4(schema);

        return function validate(json) {
            return v.validate(json);
        };
    }


    function addSchema(schema, id) {
        throw new Error('jsen: adding schema is not supported');
    }


    function getSchema(id) {
        throw new Error('jsen: adding schema is not supported');
    }
}
