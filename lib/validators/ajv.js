'use strict';


var Ajv = require('ajv')
    , util = require('./_util');


module.exports = Validator;


function Validator(opts) {
    if (!(this instanceof Validator)) return new Validator(opts);
    var self = this;

    this._opts = util.copy(opts || {});
    var _schemas = this._opts.schemas = this._opts.schemas || {};
    delete this._opts.schemas;

    var ajv = this.ajv = Ajv(this._opts);

    // this is done on purpose, so that methods are bound to the instance without using bind
    this.validate = validate;
    this.compile = compile;
    this.addSchema = addSchema;
    this.getSchema = getSchema;

    for (var id in _schemas)
        ajv.addSchema(util.parse(_schemas[id]), id);


    function validate(schema, json) {
        var valid = ajv.validate(util.parse(schema), json);
        return { valid: valid, errors: ajv.errors || [] };
    }


    function compile(schema) {
        var v = ajv.compile(util.parse(schema));
        return _validator(v);
    }


    function addSchema(schema, id) {
        var v = ajv.addSchema(util.parse(schema), id);
        return _validator(v);
    }


    function _validator(v) {
        return function(json) {
            var valid  = v(json);
            return { valid: valid, errors: v.errors || [] };
        }
    }


    function getSchema(id) {
        var v = ajv.getSchema(id)
        return v && v.schema;
    }
}
