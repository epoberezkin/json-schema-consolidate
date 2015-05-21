# json-schema-consolidate

Unified api to different JSON-schema validators


## Supported validators

[is-my-json-valid](https://github.com/mafintosh/is-my-json-valid)


## Install

```
npm install json-schema-consolidate
```

json-schema-consolidate will not install any validators - you have to install the validator(s) that you use separately.


## Usage

```
var consolidate = require('json-schema-consolidate');
var Validator = consolidate('is-my-json-valid');
var validator = new Validator(options); // or Validator(options);
```

or

```
var consolidate = require('json-schema-consolidate');
var validator = consolidate('is-my-json-valid', options);
```


### Validate

```
var result = validator.validate(schema, json); // { valid: true/false, errors: [...] }
```

For compiling validators, this method will cache compiled schemas using serialized schema as a key ([json-stable-stringify](https://github.com/substack/json-stable-stringify) is used).


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


## License

[MIT](https://github.com/epoberezkin/json-schema-consolidate/blob/master/LICENSE)
