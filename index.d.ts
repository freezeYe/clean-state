export interface Module {
  state?: Record<string, any>;
  reducers?: Record<string, any>;
  effects?: Record<string, any>;
}

export interface Bootstrap {
  <Modules>(modules: Modules): {
    useModule: UseModule<Modules>;
    dispatch: InnerDispatch<Modules>;
  };
  DISPATCH_TYPE: string;
  addPlugin: (plugin: any) => void;
}

export type NameSpaceDeclare<Modules> = keyof Modules | (keyof Modules)[];

export type UseModule<Modules extends Record<string, Module>> = <
  NameSpace extends NameSpaceDeclare<Modules>
>(
  namespace: NameSpace,
) => NameSpace extends keyof Modules
  ? { [key in NameSpace]: Modules[key]['state'] }
  : { [key in NameSpace[number]]: Modules[key]['state'] };

export type RootEffects<Modules> = {
  [key in keyof Modules]: Modules[key]['effects'] extends undefined
    ? Record<string, any>
    : {
        [fnKey in keyof Modules[key]['effects']]: (
          payload?: Parameters<Modules[key]['effects'][fnKey]>[0]['payload'],
        ) => any;
      };
};

export type RootReducers<Modules> = {
  [key in keyof Modules]: Modules[key]['reducers'] extends undefined
    ? Record<string, any>
    : {
        [fnKey in keyof Modules[key]['reducers']]: (
          payload?: Parameters<Modules[key]['reducers'][fnKey]>[0]['payload'],
        ) => any;
      };
};

export type Dispatch = (
  namespace: string,
  payload?: Record<string, any>,
) => any;

export type InnerDispatch<Modules> = Dispatch &
  RootEffects<Modules> &
  RootReducers<Modules>;

export type MixinModule<C, M> = {
  [key in keyof M]: {
    state: M[key]['state'] & C['state'];
    reducers: M[key]['reducers'] & C['reducers'];
    effects: M[key]['effects'] & C['effects'];
  };
};

export type EffectProps<T, S = any, R = Record<string, any>> = {
  payload: T;
  state: S;
  rootState: R;
  dispatch?: any;
};

export type ReducerProps<T, S = any, R = Record<string, any>> = {
  payload: T;
  state: S;
  rootState: R;
};

export type Plugin = (modules: any, on: any) => void;

export const mixin: <C extends Module, M extends Record<string, Module>>(
  common: C,
  modules: M,
) => MixinModule<C, M>;

const bootstrap: Bootstrap;
export default bootstrap;
