import {
  makeBlueprintValidator,
  createValidator,
  Any
} from "@/src/utils/BlueprintValidator";

describe("makeBlueprintValidator", () => {
  it("should be exported", () => {
    expect(makeBlueprintValidator).toBeDefined();
  });

  it("should return validator", () => {
    const validator = makeBlueprintValidator({});

    expect(validator.map).toBeDefined();
    expect(validator.valid).toBeDefined();
    expect(validator.required).toBeDefined();
  });

  it("should resolve correctly {name: Any}", () => {
    const blueprint = {
      name: Any
    };
    const validator = makeBlueprintValidator(blueprint);

    expect(
      validator.valid({
        name: "Dumitru"
      })
    ).toBeTruthy();
    expect(
      validator.valid({
        name: "Dumitru",
        age: 18
      })
    ).toBeTruthy();
    expect(validator.valid({})).toBeTruthy();
    expect(
      validator.valid({
        name: 12
      })
    ).toBeTruthy();
    expect(
      validator.valid({
        name: {
          first: "Dumitru",
          second: "Arsenii"
        }
      })
    ).toBeTruthy();
    expect(
      validator.valid({
        name: null
      })
    ).toBeTruthy();
  });

  it("should resolve correctly {name: String}", () => {
    const blueprint = {
      name: String
    };
    const validator = makeBlueprintValidator(blueprint);

    expect(
      validator.valid({
        name: "Dumitru"
      })
    ).toBeTruthy();
    expect(
      validator.valid({
        name: "Dumitru",
        age: 18
      })
    ).toBeTruthy();
    expect(validator.valid({})).toBeFalsy();
    expect(
      validator.valid({
        name: 12
      })
    ).toBeFalsy();
    expect(
      validator.valid({
        name: {
          first: "Dumitru",
          second: "Arsenii"
        }
      })
    ).toBeFalsy();
    expect(
      validator.valid({
        name: null
      })
    ).toBeFalsy();
  });

  it("should resolve correctly {age: Number}", () => {
    const blueprint = {
      age: Number
    };
    const validator = makeBlueprintValidator(blueprint);

    expect(
      validator.valid({
        age: 24
      })
    ).toBeTruthy();
    expect(
      validator.valid({
        age: 24,
        name: "Dumitru"
      })
    ).toBeTruthy();
    expect(validator.valid({})).toBeFalsy();
    expect(
      validator.valid({
        age: "Dumitru"
      })
    ).toBeFalsy();
    expect(
      validator.valid({
        age: {
          years: 24,
          month: 10
        }
      })
    ).toBeFalsy();
    expect(
      validator.valid({
        age: null
      })
    ).toBeFalsy();
  });

  it("should resolve correctly {maried: Boolean}", () => {
    const blueprint = {
      maried: Boolean
    };
    const validator = makeBlueprintValidator(blueprint);

    expect(
      validator.valid({
        maried: false
      })
    ).toBeTruthy();
    expect(
      validator.valid({
        maried: false,
        name: "Dumitru"
      })
    ).toBeTruthy();
    expect(validator.valid({})).toBeFalsy();
    expect(
      validator.valid({
        maried: "Dumitru"
      })
    ).toBeFalsy();
    expect(
      validator.valid({
        maried: {
          years: 24,
          month: 10
        }
      })
    ).toBeFalsy();
    expect(
      validator.valid({
        maried: null
      })
    ).toBeFalsy();
  });

  it("should resolve correctly {movies: Array}", () => {
    const blueprint = {
      movies: Array
    };
    const validator = makeBlueprintValidator(blueprint);

    expect(
      validator.valid({
        movies: []
      })
    ).toBeTruthy();
    expect(
      validator.valid({
        movies: [false],
        name: "Dumitru"
      })
    ).toBeTruthy();
    expect(validator.valid({})).toBeFalsy();
    expect(
      validator.valid({
        movies: "Dumitru"
      })
    ).toBeFalsy();
    expect(
      validator.valid({
        movies: {
          years: 24,
          month: 10
        }
      })
    ).toBeFalsy();
    expect(
      validator.valid({
        movies: null
      })
    ).toBeFalsy();
  });

  it("should resolve correctly {info: Object}", () => {
    const blueprint = {
      info: Object
    };
    const validator = makeBlueprintValidator(blueprint);

    expect(
      validator.valid({
        info: {}
      })
    ).toBeTruthy();
    expect(
      validator.valid({
        info: { maried: false },
        name: "Dumitru"
      })
    ).toBeTruthy();
    expect(validator.valid({})).toBeFalsy();
    expect(
      validator.valid({
        info: "Dumitru"
      })
    ).toBeFalsy();
    expect(
      validator.valid({
        info: [24, 10]
      })
    ).toBeFalsy();
    expect(
      validator.valid({
        info: null
      })
    ).toBeFalsy();
  });

  it("should resolve correctly {name: String, info: Object, age: Number, maried: Boolean, movies: Array}", () => {
    const blueprint = {
      name: String,
      info: Object,
      age: Number,
      maried: Boolean,
      movies: Array
    };
    const validator = makeBlueprintValidator(blueprint);

    expect(
      validator.valid({
        name: "Dumitru",
        info: {},
        age: 24,
        maried: false,
        movies: ["Avatar Last AirBender"]
      })
    ).toBeTruthy();
    expect(
      validator.valid({
        name: "Dumitru",
        info: {
          carier: "Developer"
        },
        age: 24,
        maried: false,
        movies: ["Avatar Last AirBender"],
        speed: 100
      })
    ).toBeTruthy();
    expect(validator.valid({})).toBeFalsy();
    expect(
      validator.valid({
        age: "Dumitru",
        movies: {
          carier: "Developer"
        },
        name: 24,
        info: false,
        maried: ["Avatar Last AirBender"]
      })
    ).toBeFalsy();
  });

  it("should resolve correctly {name: String, info: { age: Number, maried: Boolean, movies: Array}}", () => {
    const blueprint = {
      name: String,
      info: { age: Number, maried: Boolean, movies: Array }
    };
    const validator = makeBlueprintValidator(blueprint);

    expect(
      validator.valid({
        name: "Dumitru",
        info: {
          age: 24,
          maried: false,
          movies: ["Avatar Last AirBender"]
        }
      })
    ).toBeTruthy();
    expect(
      validator.valid({
        name: "Dumitru",
        info: {
          carier: "Developer",
          age: 24,
          maried: false,
          movies: ["Avatar Last AirBender"],
          speed: 100
        }
      })
    ).toBeTruthy();
    expect(validator.valid({})).toBeFalsy();
    expect(
      validator.valid({
        age: "Dumitru",
        movies: {
          carier: "Developer"
        },
        name: 24,
        info: false,
        maried: ["Avatar Last AirBender"]
      })
    ).toBeFalsy();
  });

  describe("name object definition", () => {
    const blueprint = {
      name: {
        $type: String,
        $required: true,
        $minLength: 5,
        $maxLength: 10
      }
    };

    it("should valid with $minLength=5", () => {
      const validator = makeBlueprintValidator(blueprint);
      expect(
        validator.valid({
          name: "Dumitru"
        })
      ).toBeTruthy();
      expect(
        validator.valid({
          name: "Dumi"
        })
      ).toBeFalsy();
    });

    it("should valid with $maxLength=10", () => {
      const validator = makeBlueprintValidator(blueprint);
      expect(
        validator.valid({
          name: "Dumitru"
        })
      ).toBeTruthy();
      expect(
        validator.valid({
          name: "Dumitru8910"
        })
      ).toBeFalsy();
    });

    it("should valid with $required=true", () => {
      const validator = makeBlueprintValidator(blueprint);
      expect(
        validator.valid({
          name: "Dumitru"
        })
      ).toBeTruthy();
      expect(validator.valid({})).toBeFalsy();
    });

    it("should valid with $required=true and $defualt=Dumitru", () => {
      const validator = makeBlueprintValidator({
        name: {
          ...blueprint.name,
          $default: "Dumitru"
        }
      });
      expect(validator.valid({})).toBeTruthy();
    });

    it("should valid with $in=[Dumitru,Andrei]", () => {
      const validator = makeBlueprintValidator({
        name: {
          ...blueprint.name,
          $in: ["Dumitru", "Andrei"]
        }
      });
      expect(
        validator.valid({
          name: "Dumitru"
        })
      ).toBeTruthy();
      expect(
        validator.valid({
          name: "Andrei"
        })
      ).toBeTruthy();
      expect(
        validator.valid({
          name: "Andreika"
        })
      ).toBeFalsy();
    });

    it("should valid with $validator", () => {
      const validator = makeBlueprintValidator({
        name: {
          ...blueprint.name,
          $validator: val => /^[A-Z].+$/.test(val)
        }
      });
      expect(
        validator.valid({
          name: "Dumitru"
        })
      ).toBeTruthy();
      expect(
        validator.valid({
          name: "Andrei"
        })
      ).toBeTruthy();
      expect(
        validator.valid({
          name: "andreika"
        })
      ).toBeFalsy();
    });

    it("should map with $defualt=Dumitru", () => {
      const validator = makeBlueprintValidator({
        name: {
          ...blueprint.name,
          $default: "Dumitru"
        }
      });
      expect(validator.map({}).name).toBe("Dumitru");
    });

    it("should map with $mapper", () => {
      const validator = makeBlueprintValidator({
        name: {
          ...blueprint.name,
          $mapper: name => `Hi, my name is ${name}, nice to meet you`
        }
      });
      expect(
        validator.map({
          name: "Dumitru"
        }).name
      ).toBe("Hi, my name is Dumitru, nice to meet you");
    });
  });

  describe("age object definition", () => {
    const blueprint = {
      age: {
        $type: Number,
        $required: true,
        $min: 18,
        $max: 140
      }
    };

    it("should valid with $min=18", () => {
      const validator = makeBlueprintValidator(blueprint);
      expect(
        validator.valid({
          age: 24
        })
      ).toBeTruthy();
      expect(
        validator.valid({
          age: 14
        })
      ).toBeFalsy();
    });

    it("should valid with $max=140", () => {
      const validator = makeBlueprintValidator(blueprint);
      expect(
        validator.valid({
          age: 24
        })
      ).toBeTruthy();
      expect(
        validator.valid({
          age: 149
        })
      ).toBeFalsy();
    });

    it("should valid with $default=24", () => {
      const validator = makeBlueprintValidator({
        age: { ...blueprint.age, $default: 24 }
      });
      expect(
        validator.valid({
          age: 24
        })
      ).toBeTruthy();
      expect(validator.valid({})).toBeTruthy();
    });

    it("should valid with $in=24", () => {
      const validator = makeBlueprintValidator({
        age: { ...blueprint.age, $in: [24, 33] }
      });
      expect(
        validator.valid({
          age: 24
        })
      ).toBeTruthy();
      expect(
        validator.valid({
          age: 33
        })
      ).toBeTruthy();
      expect(
        validator.valid({
          age: 22
        })
      ).toBeFalsy();
    });

    it("should valid with $validator", () => {
      const validator = makeBlueprintValidator({
        age: { ...blueprint.age, $validator: val => val % 2 === 0 }
      });
      expect(
        validator.valid({
          age: 24
        })
      ).toBeTruthy();
      expect(
        validator.valid({
          age: 44
        })
      ).toBeTruthy();
      expect(
        validator.valid({
          age: 33
        })
      ).toBeFalsy();
    });

    it("should map with $default=24", () => {
      const validator = makeBlueprintValidator({
        age: { ...blueprint.age, $default: 24 }
      });
      expect(
        validator.map({
          age: 24
        }).age
      ).toBe(24);
    });

    it("should map with $mapper", () => {
      const validator = makeBlueprintValidator({
        age: { ...blueprint.age, $mapper: age => (age > 20 ? 50 : age) }
      });
      expect(
        validator.map({
          age: 24
        }).age
      ).toBe(50);
    });
  });

  describe("name and age in info object", () => {
    const blueprint = {
      info: {
        name: {
          $type: String,
          $required: true,
          $minLength: 5,
          $maxLength: 10
        },
        age: {
          $type: Number,
          $required: true,
          $min: 18,
          $max: 140
        }
      }
    };
    const validator = makeBlueprintValidator(blueprint);

    expect(
      validator.valid({
        info: {
          name: "Dumitru",
          age: 24
        }
      })
    ).toBeTruthy();
    expect(
      validator.valid({
        info: {
          name: "Dumitru986798",
          age: 24
        }
      })
    ).toBeFalsy();
    expect(
      validator.valid({
        info: {
          name: "Dumitru",
          age: 240
        }
      })
    ).toBeFalsy();
  });
  describe("name and age in persons array object", () => {
    const blueprint = {
      persons: [
        {
          name: {
            $type: String,
            $required: true,
            $minLength: 5,
            $maxLength: 10
          },
          age: {
            $type: Number,
            $required: true,
            $min: 18,
            $max: 140
          }
        }
      ]
    };
    const validator = makeBlueprintValidator(blueprint);

    expect(
      validator.valid({
        persons: [
          {
            name: "Dumitru",
            age: 24
          },
          {
            name: "Elena",
            age: 22
          }
        ]
      })
    ).toBeTruthy();
    expect(
      validator.valid({
        persons: [
          {
            name: "Dumitru986798",
            age: 24
          },
          {
            name: "Dumitru",
            age: 24
          }
        ]
      })
    ).toBeFalsy();
    expect(
      validator.valid({
        persons: [
          {
            name: "Dumitru",
            age: 240
          },
          {
            name: "Dumitru",
            age: 24
          }
        ]
      })
    ).toBeFalsy();
  });
});

describe("createValidator", () => {
  it("should return validator", () => {
    const validator = createValidator();

    expect(validator.addMapper).toBeDefined();
    expect(validator.addValidator).toBeDefined();
    expect(validator.required).toBeDefined();
    expect(validator.facade).toBeDefined();
  });
  describe("returned validator", () => {
    it("should return himself when call addMapper", () => {
      const validator = createValidator();

      expect(validator.addMapper(() => {})).toBe(validator);
    });
    it("should return himself when call addValidator", () => {
      const validator = createValidator();

      expect(validator.addValidator(() => {})).toBe(validator);
    });
    it("should return himself when call required", () => {
      const validator = createValidator();

      expect(validator.required(1)).toBe(validator);
    });
  });
});
