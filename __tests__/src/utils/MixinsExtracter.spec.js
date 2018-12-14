import { extractMixins } from "@/src/utils/MixinsExtracter";

describe("extractMixins", () => {
  it("should be exported", () => {
    expect(extractMixins).toBeDefined();
  });
  it("should return array of mixins", () => {
    const mixin1 = {
      collection: "aa"
    };
    const mixin2 = {
      mixins: [mixin1],
      collection: "bb"
    };
    const mixin3 = {
      collection: "cc"
    };
    const mainMixin = {
      mixins: [mixin2, mixin3],
      collection: "mm"
    };

    const mixinsList = extractMixins(mainMixin);

    expect(mixinsList).toBeInstanceOf(Array);
    expect(mixinsList.length).toBe(4);
    expect(mixinsList[0].collection).toBe(mainMixin.collection);
    expect(mixinsList[1].collection).toBe(mixin2.collection);
    expect(mixinsList[2].collection).toBe(mixin1.collection);
    expect(mixinsList[3].collection).toBe(mixin3.collection);
  });
});
