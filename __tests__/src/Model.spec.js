import { Model } from "@/src/Model";

describe("Model", () => {
  const nameValue = "aa";
  const ageValue = 12;
  const schema = {
    blueprint: {
      name: String,
      age: Number
    },
    computed: {
      nameOf() {
        return nameValue;
      },
      ageOf() {
        return ageValue;
      },
      json() {
        return {
          name: nameValue,
          age: ageValue
        };
      }
    },
    methods: {
      parsedNameAndAge(helloMessage = "Hello") {
        return `${helloMessage}, my name is ${this.nameOf} and I'm ${
          this.ageOf
        }`;
      }
    },
    actions: {
      getAll(n = 10) {
        const all = [];

        for (let i = 0; i < n; i++) {
          all.push(i);
        }

        return all;
      }
    }
  };

  it("should be exported", () => {
    expect(Model).toBeDefined();
  });

  describe("Factory Proxy", () => {
    const Hero = Model(schema);

    it("should be constructor", () => {
      expect(new Hero() instanceof Hero).toBe(true);
    });

    it("should have method getAll", () => {
      expect(Hero.getAll).toBeDefined();
    });

    it("should return corect value calling getAll", done => {
      const result = Hero.getAll(20);

      expect(result).toBeInstanceOf(Promise);

      result
        .then(({ started, ended, result }) => {
          expect(started <= ended).toBe(true);
          for (let i = 0; i < 20; i++) {
            expect(result[i]).toBe(i);
          }
          done();
        })
        .catch(done);
    });
  });

  describe("Lifecycle", () => {
    const creating = jest.fn();
    const Hero = Model({
      ...schema,
      creating
    });

    it("should call creating lifecycle", () => {
      const data = {
        name: "Andrei",
        age: 12
      };
      new Hero(data);

      expect(creating).toBeCalledWith(data);
    });

    describe("Model Proxy", () => {
      const Hero = Model(schema);
      const instance = new Hero();

      it("should return correct value from computed prop nameOf", () => {
        expect(instance.nameOf).toBeDefined();
        expect(instance.nameOf).toBe(nameValue);
      });

      it("should return correct value from computed prop ageOf", () => {
        expect(instance.ageOf).toBeDefined();
        expect(instance.ageOf).toBe(ageValue);
      });

      it("should return correct value from method parsedNameAndAge", () => {
        expect(instance.parsedNameAndAge).toBeDefined();
        expect(instance.parsedNameAndAge("AA")).toBe(
          `AA, my name is ${nameValue} and I'm ${ageValue}`
        );
      });
    });
  });
});
