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
var valid = validator.validate(data, schema); // true/false
var errors = validator.errors;
```

### Create validator function

```
var validate = validator.compile(schema);
var valid = validate(data);
var errors = validate.errors;
```

### Add schema

```
validator.addSchema(schema, id);
```

If `id` is not passed, schema.id will be used


### Get schema

```
var schema = validator.getSchema(id);
```
