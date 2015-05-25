var v = require('skeemas')(),

    meta = require('./spec/meta_schema.json');



// console.log(v.validate({}, meta)); // Valid

// console.log(v.validate({ type:'array', items:{type:'object'} }, meta)); // Valid

console.log(v.validate({
        id: 'http://example.com/schema0b',
        $schema: 'http://json-schema.org/draft-04/schema#',
        type: 'object',
        properties: [
          { s: 'string' },
          { n: 'number' }
        ]
      }, meta, { breakOnError: true, schemas: {} })) // Invalid with 'Failed "anyOf" criteria' @ '#/items'