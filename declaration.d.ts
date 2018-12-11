declare module MongoZilla.LifeCycleHooks {
  interface Construct {
    (): Mapper;
  }

  interface Mapper {
    on: AddListener;
    fire: FireHook;
    fireChain: FireHookChain;
    fireChainReverse: FireHookChain;
  }

  interface AddListener {
    (hook: AvailableHooks, callable: Function): void;
  }

  type AvailableHooks =
    | "construct"
    | "validating"
    | "validated"
    | "validator"
    | "saving"
    | "saved"
    | "retrieved"
    | "creating"
    | "created"
    | "updating"
    | "updated"
    | "deleting"
    | "deleted"
    | "refreshed";

  interface FireHook {
    (
      hook: AvailableHooks,
      target: object,
      args: Array<any>,
      systemArgs: Array<any>
    ): void;
  }

  interface FireHookChain {
    (
      hook: AvailableHooks,
      target: object,
      args: Array<any>,
      systemArgs: Array<any>
    ): boolean;
  }
}
