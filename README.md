# json-schema-consolidate

Adapter to different JSON-schema (draft4) validators

[![Build Status](https://travis-ci.org/epoberezkin/json-schema-consolidate.svg?branch=master)](https://travis-ci.org/epoberezkin/json-schema-consolidate)
[![npm version](https://badge.fury.io/js/json-schema-consolidate.svg)](http://badge.fury.io/js/json-schema-consolidate)

## Supported validators

- [ajv](https://github.com/epoberezkin/ajv)
- [is-my-json-valid](https://github.com/mafintosh/is-my-json-valid)
- [jayschema](https://github.com/natesilva/jayschema)
- [jjv](https://github.com/acornejo/jjv)
- [jsck](https://github.com/pandastrike/jsck)
- [jsen](https://github.com/bugventure/jsen)
- [jsonschema](https://github.com/tdegrunt/jsonschema)
- [schemasaurus](https://github.com/AlexeyGrishin/schemasaurus)
- [skeemas](https://github.com/Prestaul/skeemas)
- [themis](https://github.com/playlyfe/themis)
- [tv4](https://github.com/geraintluff/tv4)
- [z-schema](https://github.com/zaggino/z-schema#register-a-custom-format)

You must install the validator(s) you use separately.

See [Validators compatibility](#validators-compatibility) and [json-schema-benchmark](https://github.com/ebdrup/json-schema-benchmark).


## Install

```
npm install json-schema-consolidate
npm install <validator>
```


## Usage

```
var consolidate = require('json-schema-consolidate');
var Validator = consolidate('<validator>');
var validator = new Validator(options); // or Validator(options);
```

or

```
var consolidate = require('json-schema-consolidate');
var validator = consolidate('<validator>', options);
```


### Validate

```
var result = validator.validate(schema, json); // { valid: true/false, errors: [...] }
```

`schema` can be a string, in which case it will be JSON.parse'd.

If you need to validate with the previously added schema, you can either use `getSchema` to retrieve it or pass `{ $ref: '<id>' }` as the schema.

If the referenced schema is missing it is an error (for all validators - tv4 is corrected in this case).

For compiling validators, this method will cache compiled schemas using serialized schema as a key ([json-stable-stringify](https://github.com/substack/json-stable-stringify) is used).


### Compile

(create validating function)

```
var validate = validator.compile(schema);
var result = validate(json); // { valid: true/false, errors: [...] }
```

For interpreting validators this method will simply return a closure that can be used to validate json, but there will be no performance gain.


### Add schema

(that can be referred to in other schemas)

```
validator.addSchema(schema, id);
```

If `id` is not passed, `schema.id` will be used

`schema` can be array of schemas, in which case the second parameter is not used.


### Get schema

(previously added)

```
var schema = validator.getSchema(id);
```


### Options

These options are available in all supported validators:

- `allErrors` - continue validation after errors and return all validation errors.

- `schemas` - include some schemas, same result as calling `addSchema` method.

- `formats` - define additional formats, most validators support RegExp and functions. Format function should return validation success as boolean for ALL validators used with json-schema-consolidate.


Validator specific options can also be passed.


## Validators compatibility

|validator|meta| ref |allErrors|formats|compile|fails|
|---------|:--:|:---:|:-------:|:-----:|:-----:|:---:|
|[ajv](https://github.com/epoberezkin/ajv)|&#x2713;|&#x2713;|&#x2713;|&#x2713;|&#x2713;|-/1|
|[is-my-json-valid](https://github.com/mafintosh/is-my-json-valid)|&#x2713;|short|-|&#x2713;|&#x2713;|3/9|
|[jayschema](https://github.com/natesilva/jayschema)|&#x2713;|&#x2713;|-|&#x2713;|-|1/5|
|[jjv](https://github.com/acornejo/jjv)|&#x2713;|&#x2713;|-|&#x2713;|-|3/4|
|[jsck](https://github.com/pandastrike/jsck)|&#x2713;|&#x2713;|-|-|&#x2713;|3/11|
|[jsen](https://github.com/bugventure/jsen)|&#x2713;|-|-|&#x2713;|&#x2713;|7/7|
|[jsonschema](https://github.com/tdegrunt/jsonschema)|-|full|&#x2713;|-|-|4/3|
|[schemasaurus](https://github.com/AlexeyGrishin/schemasaurus)|-|-|-|RegExp|&#x2713;|8/10|
|[skeemas](https://github.com/Prestaul/skeemas)|&#x2713;|full|-|-|-|3/1|
|[themis](https://github.com/playlyfe/themis)|&#x2713;|&#x2713;|-|&#x2713;|&#x2713;|3/8|
|[tv4](https://github.com/geraintluff/tv4)|-|&#x2713;|&#x2713;|&#x2713;|-|2/11|
|[z-schema](https://github.com/zaggino/z-schema)|&#x2713;|&#x2713;|&#x2713;|&#x2713;|&#x2713;|-/6|

- `meta`: validator can correctly validate schema against [meta-schema](http://json-schema.org/documentation.html). Some validators validate valid schemas as invalid or just throw error in this test.

- `ref`: support for referencing schemas in other files. Some validators support only `full` uris, some only `short` uris and some support both (&#x2713;).

- `allErrors`: if supported, the validator will stop after the first error unless this options is set to true.

- `formats`: most validators support functions and RegExp (some only with this package) as custom formats (&#x2713;). Some support only `RegExp`.

- `compile`: validators that compile schemas into validating functions. Even if a validator doesn't compile schemas, you can use `compile` method - it will return a function that will validate using the passed schema.

- `fails`: the number of tests that fails. The first number - tests in json-schema-consolidate interface tests, the second - the tests in the official json-schema draft4 test suite.


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

Skipped tests are features in validators that are either not implemented or failing.


## License

[MIT](https://github.com/epoberezkin/json-schema-consolidate/blob/master/LICENSE)
