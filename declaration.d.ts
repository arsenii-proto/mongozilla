declare module MongoZilla.Model {
  interface Schema {
    /** Connection Name */
    connection?: string;
    /** Collection Name */
    collection: string;
    /** Model Blueprint */
    blueprint: object;
    /** Model intance methods */
    methods?: object;
    /** Database Actions */
    actions?: object;
    /** Computed props */
    computed?: object;
    /** Validating lifecycle */
    validating?: Function;
    /** Validated lifecycle */
    validated?: Function;
    /** Saving lifecycle */
    saving?: Function;
    /** Saved lifecycle */
    saved?: Function;
    /** Retrieved lifecycle */
    retrieved?: Function;
    /** Creating lifecycle */
    creating?: Function;
    /** Created lifecycle */
    created?: Function;
    /** Updating lifecycle */
    updating?: Function;
    /** Updated lifecycle */
    updated?: Function;
    /** Deleting lifecycle */
    deleting?: Function;
    /** Deleted lifecycle */
    deleted?: Function;
    /** Refreshed lifecycle */
    refreshed?: Function;
  }

  interface Factory { }

  interface FactoryBuilder {
    (schema: Schema): Factory;
  }
}

declare module MongoZilla.LifeCycleHooks {
  interface Construct {
    (): Mapper;
  }

  interface Mapper {
    on: AddListener;
    fire: FireHook;
    fireReverse: FireHook;
    fireChain: FireHookChain;
    fireChainReverse: FireHookChain;
  }

  interface AddListener {
    (hook: AvailableHooks, callable: Function): void;
  }

  type AvailableHooks =
    | "validating"
    | "validated"
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
    list: () => Array<String>
  }
}

declare module MongoZilla.MixinParser {
  interface ParserMethod {
    (arg: MixinParserArg): void;
  }

  interface MixinParserArg {
    mixin: MongoZilla.Mixin.MixinSchema;
    manager: MongoZilla.PropsOveloadingManager.Manager;
    mapper: MongoZilla.LifeCycleHooks.Mapper;
  }
}

declare module MongoZilla.Mixin {
  interface MixinSchema {
    /** Connection Name */
    connection?: string;
    /** Collection Name */
    collection: string;
    /** Model Blueprint */
    blueprint: object;
    /** Model intance methods */
    methods?: object;
    /** Database Actions */
    actions?: object;
    /** Computed props */
    computed?: object;
    /** Validating lifecycle */
    validating?: Function;
    /** Validated lifecycle */
    validated?: Function;
    /** Saving lifecycle */
    saving?: Function;
    /** Saved lifecycle */
    saved?: Function;
    /** Retrieved lifecycle */
    retrieved?: Function;
    /** Creating lifecycle */
    creating?: Function;
    /** Created lifecycle */
    created?: Function;
    /** Updating lifecycle */
    updating?: Function;
    /** Updated lifecycle */
    updated?: Function;
    /** Deleting lifecycle */
    deleting?: Function;
    /** Deleted lifecycle */
    deleted?: Function;
    /** Refreshed lifecycle */
    refreshed?: Function;
  }
}

declare module MongoZilla.BlueprintValidator {
  interface Constructor {
    (blueprint: object): Validator;
  }

  interface Validator {
    valid: (value: any) => Boolean;
    map: (value: any) => any;
    required: Boolean;
  }
}

declare module MongoZilla.ModelHandler {
  interface Constructor {
    (operator: ModelOperator): Object;
  }

  interface ModelOperator {
    manager: MongoZilla.PropsOveloadingManager.Manager;
    mapper: MongoZilla.LifeCycleHooks.Mapper;
    validator: MongoZilla.BlueprintValidator.Validator;
  }
}
