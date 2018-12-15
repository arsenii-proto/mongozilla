const SYSTEM = "SYSTEM-ss-s-s-s-sss".replace(/s/g, () =>
  Date.now()
    .toString(16)
    .substring(1)
);
const MIXIN = "MIXIN-ss-s-s-s-sss".replace(/s/g, () =>
  Date.now()
    .toString(16)
    .substring(1)
);
const MODEL = "MODEL-ss-s-s-s-sss".replace(/s/g, () =>
  Date.now()
    .toString(16)
    .substring(1)
);

export { SYSTEM, MODEL, MIXIN };
