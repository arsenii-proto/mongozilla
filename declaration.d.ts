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

declare module MongoZilla.PropsOveloadingManager {
  interface Constructor {
    (): Manager;
  }

  interface ExtendedContructed {
    (source: Manager): Manager;
  }

  interface Manager {
    proto: {
      setters: ManagerNamespaceFacade;
      getters: ManagerNamespaceFacade;
    };
    statically: {
      setters: ManagerNamespaceFacade;
      getters: ManagerNamespaceFacade;
    };
  }

  interface ManagerNamespaceFacade {
    has: (name: String) => boolean;
    set: (name: String, callable: Function) => void;
    delete: (name: String) => boolean;
    apply: (name: String, target: Object, args?: Array<any>) => any;
  }
}
