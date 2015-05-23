# json-schema-consolidate

Unified api to different JSON-schema validators


## Supported validators

- [is-my-json-valid](https://github.com/mafintosh/is-my-json-valid)
- [jjv](https://github.com/acornejo/jjv)
- [skeemas](https://github.com/Prestaul/skeemas)
- [tv4](https://github.com/geraintluff/tv4)
- [z-schema](https://github.com/zaggino/z-schema#register-a-custom-format)

You must install the validators you use separately.

See Validators compatibility and [json-schema-benchmark](https://github.com/ebdrup/json-schema-benchmark)


## Install

```
npm install json-schema-consolidate
npm install <validator>
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

`schema` can be a string, in which case it will be JSON.parse'd.

If you need to validate with the previously added schema, you can either use `getSchema` to retrieve it or pass `{ $ref: '<id>' }` as the schema.

If the referenced schema is missing it is an error (for all validators - tv4 is corrected in this case).

For compiling validators, this method will cache compiled schemas using serialized schema as a key ([json-stable-stringify](https://github.com/substack/json-stable-stringify) is used).


### Create validating function

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

`schema` can be array of schemas, in which case the second parameter is not used.


### Get schema

(previously added)

```
var schema = validator.getSchema(id);
```


### Options

These options are available in all supported validators:

- allErrors - continue validation after errors and return all validation errors

- verbose - validator dependent

- schemas - include some schemas, same result as calling `addSchema` method

- formats - define additional formats, all validators support RegExp, most support functions.


Validator specific options can also be passed.


## Validators compatibility

### Compiling:

__is-my-json-valid__ - not supported: functions in custom formats, full URIs in schema ids.

__z-schema__ - custom formats are registered globally, not in the instance. Schema ids must be full valid URIs.


### Interpreting:

__jjv__ - option `allErrors` not supported. "Compiling" schema registers it (`addSchema`) if `schema.id` is present.

__skeemas__ - not supported: custom formats.

__tv4__ - supports all options.


## Running tests

To run tests you need to install [json-schema-tests](https://github.com/pandastrike/json-schema-tests) and all validators:

```
npm install
npm install -g coffee-script
npm install -g json-schema-tests
```

Then you can run tests with `./test` script:


```
./test
./test --full
./test <validator>
./test <validator> --short
```


## License

[MIT](https://github.com/epoberezkin/json-schema-consolidate/blob/master/LICENSE)
