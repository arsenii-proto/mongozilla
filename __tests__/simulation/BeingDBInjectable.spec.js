import { Model } from "@/src/Model";
import { Any } from "@/src/utils/BlueprintValidator";
import { connect } from "@/src/Connection";

const dbConfig = {
  url: "mongodb://admin:5Wg959RRHJbv7b4@ds247171.mlab.com:47171/arsenii-proto",
  database: "arsenii-proto",
  name: "test"
};

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

describe("BeingDBInjectable", () => {
  it("should connect to db", done => {
    connect(
      dbConfig.url,
      dbConfig.database
    )
      .then(() => done())
      .catch(done);
  });

  it("should become SuperHero Constructor", () => {
    const SuperHero = Model(superSchema);

    expect(SuperHero).toBeInstanceOf(Function);
  });

  it("should create new Superhero", () => {
    const SuperHero = Model(superSchema);

    expect(new SuperHero(superManData)).toBeInstanceOf(SuperHero);
  });

  describe("save method", () => {
    it("should be implemented", () => {
      const SuperHero = Model(superSchema);
      const instance = new SuperHero(superManData);

      expect(instance.save).toBeDefined();
      expect(instance.save).toBeInstanceOf(Function);
    });

    it("should return promise", () => {
      const SuperHero = Model(superSchema);
      const instance = new SuperHero(superManData);
      const result = instance.save().catch(() => {});

      expect(result).toBeInstanceOf(Promise);
    });

    it("should be resolved", done => {
      const SuperHero = Model(superSchema);
      const instance = new SuperHero(superManData);

      instance
        .save()
        .then(() => done())
        .catch(done);
    });
  });

  describe("delete method", () => {
    it("should be implemented", () => {
      const SuperHero = Model(superSchema);
      const instance = new SuperHero(superManData);

      expect(instance.delete).toBeDefined();
      expect(instance.delete).toBeInstanceOf(Function);
    });

    it("should return promise", () => {
      const SuperHero = Model(superSchema);
      const instance = new SuperHero(superManData);
      const result = instance.delete().catch(() => {});

      expect(result).toBeInstanceOf(Promise);
    });

    it("should be resolved", done => {
      const SuperHero = Model(superSchema);
      const instance = new SuperHero(superManData);

      instance
        .fill({
          name: "Arsenii"
        })
        .save()
        .then(() =>
          instance
            .delete()
            .then(() => done())
            .catch(done)
        )
        .catch(done);
    });
  });

  describe("refresh method", () => {
    it("should be implemented", () => {
      const SuperHero = Model(superSchema);
      const instance = new SuperHero(superManData);

      expect(instance.refresh).toBeDefined();
      expect(instance.refresh).toBeInstanceOf(Function);
    });

    it("should return promise", () => {
      const SuperHero = Model(superSchema);
      const instance = new SuperHero(superManData);
      const result = instance.refresh().catch(() => {});

      expect(result).toBeInstanceOf(Promise);
    });

    it("should be resolved", done => {
      const SuperHero = Model(superSchema);
      const instance = new SuperHero(superManData);

      instance
        .save()
        .then(() => {
          instance
            .fill({
              name: "Arsenii"
            })
            .refresh()
            .then(() => {
              expect(instance.name).toBe(superManData.name);
              done();
            })
            .catch(done);
        })
        .catch(done);
    });
  });
});
