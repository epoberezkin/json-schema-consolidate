# json-schema-consolidate

Unified api to different JSON-schema validators


## Supported validators

[is-my-json-valid](https://github.com/mafintosh/is-my-json-valid)


## Usage

```
npm install json-schema-consolidate
```

json-schema-consolidate will not install all validators - you have to install the validator(s) you use separately.


## Api

```
var Validator = require('json-schema-consolidate')('is-my-json-valid');
var validator = Validator(options);
```


### Validate

```
var result = validator.validate(json, schema); // { valid: true/false, errors: [...] }
```

For compiling validators, this method will cache compiled schemas using serialized schema as a key ([json-stable-stringify]() is used).


### Create validator function

```
var validate = validator.compile(schema);
var result = validate(json);
```

For interpreting validators this method will simply return a closure that can be used to validate json, but there will be no performance gain.


### Add schema

(that can be referred to in other schemas)

```
validator.addSchema(schema, id);
```

If `id` is not passed, schema.id will be used


### Get schema

(previously added)

```
var schema = validator.getSchema(id);
```


### Options

These options are available in all supported validators:

- allErrors - continue validation after errors and return all validation errors

- verbose - validator dependent

- schemas - add some schemas, same result as calling `addSchema` method

- formats - define additional formats, validator dependent


Validator specific options can also be passed.
