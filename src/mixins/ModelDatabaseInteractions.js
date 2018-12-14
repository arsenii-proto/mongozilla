import { SYSTEM } from "@/src/conts/MixinTypes";
const saveModel = (model, options, operator) => {};

export default {
  _$type: SYSTEM,
  methods: {
    save(options = {}) {
      saveModel(this, options, operator);
    }
  },
  construct() {}
};
