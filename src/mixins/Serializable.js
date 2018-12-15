import { SYSTEM } from "@/src/conts/MixinTypes";

/** @type {MongoZilla.Model.Schema} */
export const Serialized = {
  _$type: SYSTEM,
  creating([props]) {
    const { manager, blueprint } = this[SYSTEM];

    manager.statically.getters.set("original", () => ({}));
    manager.statically.getters.set("atributes", () => props || {});

    Object.keys(blueprint).forEach(key => {
      manager.proto.getters.set(key, () => this.json[key]);
      manager.proto.setters.set(key, value => {
        const props = manager.statically.getters.apply("atributes", {});
        props[key] = value;
      });
    });
  },
  methods: {
    fill(props) {
      props &&
        Object.keys(props).forEach(key => {
          this[key] = props[key];
        });

      return this;
    }
  },
  computed: {
    json() {
      const { manager } = this[SYSTEM];

      return {
        ...manager.statically.getters.apply("original", {}),
        ...manager.statically.getters.apply("atributes", {})
      };
    },
    _id() {
      return this.json._id;
    }
  }
};
