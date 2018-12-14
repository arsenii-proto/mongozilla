import { SYSTEM } from "@/src/conts/MixinTypes";
const saveModel = (model, options, operator) => {};

export default {
  _$type: SYSTEM,
  computed: {
    save: {
      get(_, operator) {
        return (options = {}) => {
          saveModel(this, options, operator);
        };
      }
    }
  }
};
