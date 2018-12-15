import { Model } from "@/src/Model";
import { Any } from "@/src/utils/BlueprintValidator";

/** @type {MongoZilla.Model.Schema} */
const superSchema = {
  collection: "superheroes",
  blueprint: {
    name: String,
    age: {
      $type: Any,
      $validator(value) {
        return !isNaN(Number(value));
      },
      $mapper(value) {
        return Number(value);
      }
    },
    superName: String,
    powers: []
  }
};
const superManData = {
  name: "Clark Kent",
  age: 140,
  superName: "SuperMan",
  powers: []
};

describe("BeingSerialise", () => {
  it("should become SuperHero Constructor", () => {
    const SuperHero = Model(superSchema);

    expect(SuperHero).toBeInstanceOf(Function);
  });

  it("should create new Superhero", () => {
    const SuperHero = Model(superSchema);

    expect(new SuperHero(superManData)).toBeInstanceOf(SuperHero);
  });

  it("should correctly set/get instance props", () => {
    const SuperHero = Model(superSchema);
    const instance = new SuperHero(superManData);

    expect(instance.name).toBe(superManData.name);
    expect(instance.age).toBe(superManData.age);
    expect(instance.superName).toBe(superManData.superName);
    expect(instance.powers).toBe(superManData.powers);
  });

  it("should implement instance method fill", () => {
    const SuperHero = Model(superSchema);
    const instance = new SuperHero(superManData);

    const changedData = {
      name: "AAA",
      age: 18
    };

    instance.fill(changedData);

    expect(instance.name).toBe(changedData.name);
    expect(instance.age).toBe(changedData.age);
    expect(instance.superName).toBe(superManData.superName);
    expect(instance.powers).toBe(superManData.powers);
  });
});
