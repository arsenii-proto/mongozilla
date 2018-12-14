const extractMixins = ({ mixins, ...schema }) => {
  let mixinsList = [schema];

  if (mixins) {
    mixins.forEach(mixin => {
      mixinsList = [...mixinsList, ...extractMixins(mixin)];
    });
  }

  return mixinsList;
};

export { extractMixins };
