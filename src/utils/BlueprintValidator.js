const NestedModule = () => {};
const Any = new Function();

const isType = (T, v) =>
  v instanceof T ||
  (T.name && Object.prototype.toString.apply(v) === `[object ${T.name}]`);

const isTrueObject = v =>
  isType(Object, v) &&
  [Array, String, Number, Boolean, Function].reduce(
    (all, current) => all && !isType(current, v),
    true
  );

const createValidator = () => {
  const validators = [];
  const mappers = [];
  const map = value => mappers.reduce((value, mapper) => mapper(value), value);
  const valid = value => {
    const val = map(value);

    return validators.reduce((all, validator) => all && validator(val), true);
  };
  let required = false;

  const facade = {
    facade: {
      valid,
      map,
      get required() {
        return required;
      }
    },
    required(v) {
      required = Boolean(v);
      return facade;
    },
    addValidator(validator) {
      validators.push(validator);
      return facade;
    },
    addMapper(mapper) {
      mappers.push(mapper);
      return facade;
    }
  };

  return facade;
};

const makeValueValidator = shape => {
  const validator = createValidator();

  if (shape === Any || !isType(Object, shape)) {
    return validator.facade;
  }

  if ([String, Number, Boolean, Array].includes(shape)) {
    return validator.addValidator(value => isType(shape, value)).facade;
  }

  if (Object === shape) {
    return validator.addValidator(value => isTrueObject(value)).facade;
  }

  if (isType(Array, shape)) {
    validator.addValidator(value => isType(Array, value));

    if (shape.length) {
      const itemValidator = makeValueValidator(shape[0]);

      validator.addValidator(items =>
        items.reduce((all, item) => all && itemValidator.valid(item), true)
      );

      validator.addMapper(items => items.map(item => itemValidator.map(item)));
    }

    return validator.facade;
  }

  if ("$type" in shape) {
    if ("$default" in shape) {
      if (isType(Function, shape.$default)) {
        validator.addMapper(value =>
          value !== undefined ? value : shape.$default()
        );
      } else {
        validator.addMapper(value =>
          value !== undefined ? value : shape.$default
        );
      }
    } else if ("$required" in shape) {
      validator.required(shape.$required);
    }

    if (shape.$type !== Any) {
      validator.addValidator(value => isType(shape.$type, value));
    }

    if (Number === shape.$type) {
      if ("$min" in shape) {
        validator.addValidator(value => value >= shape.$min);
      }
      if ("$max" in shape) {
        validator.addValidator(value => value <= shape.$max);
      }
    }

    if ([String, Array, []].includes(shape.$type)) {
      if ("$minLength" in shape) {
        validator.addValidator(value => value.length >= shape.$minLength);
      }
      if ("$maxLength" in shape) {
        validator.addValidator(value => value.length <= shape.$maxLength);
      }
    }

    if ("$in" in shape && isType(Array, shape.$in)) {
      validator.addValidator(value => shape.$in.includes(value));
    }

    if ("$validator" in shape && isType(Function, shape.$validator)) {
      validator.addValidator(value => Boolean(shape.$validator(value)));
    }

    if ("$mapper" in shape && isType(Function, shape.$mapper)) {
      validator.addMapper(value => shape.$mapper(value));
    }

    return validator.facade;
  }

  if (isType(NestedModule, shape)) {
    return shape.validator;
  }

  if (isTrueObject(shape)) {
    const objectValidator = makeObjectValidator(shape);

    return validator
      .addValidator(value => isTrueObject(value))
      .addValidator(objectValidator.valid)
      .addMapper(objectValidator.map).facade;
  }

  return validator.facade;
};

const makeObjectValidator = blueprint => {
  const validator = createValidator();

  Object.keys(blueprint).forEach(key => {
    const shapeValidator = makeValueValidator(blueprint[key]);

    if (shapeValidator.required) {
      validator.addValidator(value => key in value);
    }

    validator.addValidator(value => shapeValidator.valid(value[key]));
    validator.addMapper(
      value =>
        value && {
          ...value,
          [key]: shapeValidator.map(value[key])
        }
    );
  });

  return validator.facade;
};

/** @type {MongoZilla.BlueprintValidator.Constructor} */
const makeBlueprintValidator = blueprint => makeObjectValidator(blueprint);

export { makeBlueprintValidator, Any, createValidator };
