<p align="right">
  <strong>
    <a href="../README.md">English</a> |
    <a href="./README-zh-cn.md">中文</a>
  </strong>
</p>

<p align="center">
  <img width="650px" src="https://github.com/freezeYe/assets/blob/master/cs.png" />
</p>

<div align="center">
<a href="https://www.npmjs.com/clean-state" target="_blank"><img src="https://img.shields.io/npm/v/clean-state" alt="Npm Version" /></a>
<a href="https://www.npmjs.com/clean-state" target="_blank"><img src="https://img.shields.io/npm/l/clean-state?style=flat-square" alt="Package License" /></a>
<a href="https://www.npmjs.com/clean-state" target="_blank"><img src="https://img.shields.io/npm/dm/clean-state" alt="Downloads" /></a>
</div>

## 概览
🐻 clean-state是一款纯净小巧的状态管理神器。它放下了React所有的历史包袱，使用原生hooks来实现，并摆脱了Redux在状态更新时的无效渲染问题。在架构层面它会通过一个极其简单的api来自动组织。🍋如果你不是要制造一艘航空母舰又厌烦了复杂且难用的大型状态管理库，那么不妨来试试Clean-State。它小巧玲珑、性能极致完全可以满足你的需求。

## 特性
1.  使用原生hooks实现，对外部零依赖。
2.  架构简单，module 层粒度精细可测，划分清晰。
3.  性能优异，可做到模块级别的精确更新。
4.  原生支持副作用。
5.  极其小巧，仅仅200行代码。
6.  仅仅是react语法，零学习接入成本。
7.  对Typescript支持友好，可以自动推导模块类型。
8.  支持redux-tool调试工具。
9.  完美支持RN开发。

## 安装
```javascript
npm i clean-state --save
```

## 使用
#### 1.定义一个模块
```javascript
// modules/user.ts
const state = {
  name: 'test'
}

const user = {
  state,
  reducers: {
    setName({payload, state}) {
      return {...state, ...payload}
    }
  },
  effects: {
    async fetchNameAndSet({dispatch}) {
      const name = await Promise.resolve('fetch_name')
      dispatch.user.setName({name})
    }
  }
}

export default user;
```
#### 2.注册模块
```javascript
// modules/index.ts
import user from './user'
import bootstrap from 'clean-state'

const modules = { user }
export const {useModule, dispatch}  = bootstrap(modules);
```
    
#### 3.使用模块
```javascript
// page.ts
import {useCallback} from 'react'
import { useModule, dispatch } from './modules'

function App() {
  /** 
   * 这里你也能够传入数组同时返回多个模块状态
   * const {user, project} = useModule(['user', 'project'])
   */
  const { user } = useModule('user')
  const onChange = useCallback((e)=> {
    const { target } = e
    dispatch.user.setName({name: target.value})
  }, [])

  const onClick = useCallback(()=> {
    dispatch.user.fetchNameAndSet()
  }, [])

  return (
    <div className="App">
      <div>
        <div>
          name: {user.name}
        </div>
        <div>
          修改用户名: <input onChange={onChange}></input>
        </div>
        <button onClick={onClick}>获取用户名</button>
      </div>
    </div>
  );
}

export default App;
```

## 混入

在很多情况下，多个模块之间会存在公共的state、reducers或者effects，这里我们为了防止用户在每个模块里做重复声明，对外暴露了混入的方法。

```javascript
// common.ts
const common = {
  reducers: {
    setValue<State>({payload, state}: {payload: Record<string, any>, state: State}): State {
      return {...state, ...payload}
    }
  }
}
export default common;

// modules/index.ts
import commont from './common'
import user from './user'
import { mixin } from 'clean-state';

// Mix Common's setValue method into the User module
const modules = mixin(common, { user })

// You can now call the dispatch.user.setValue method on other pages
export const {useModule, dispatch}  = bootstrap(modules);

```

## 模块
### `state`
模块状态，是一个属性对象。
```
{
    name: 'zhangsan',
    order: 1
}
```
### `reducers`
更改模块状态的处理函数集合，会返回最新的state。
```
{
    setValue({payload, state, rootState}) {
        return {...state, ...payload}
    }
}
```

### `effects`
模块的副作用方法集合，主要处理异步调用。
```
{
    async fetchAndSetValue({payload, state, rootState, dispatch}) {
        const newOrder = await fetch('xxx')
        dispatch.user.setValue({order: newOrder})
    }
}
```

## 接口

### `bootstrap(modules)`
| 参数 | 说明 | 类型 |
| :----: | :----: | :----: |
| modules | 注册的模块集合 | {string, Module} |

### `useModule(moduleName)`
| 参数 | 说明 | 类型 |
| :----: | :----: | :----: |
| moduleName | 使用的模块名，返回对应状态 | string / string[] |

### `mixin(common, modules)`
| 参数 | 说明 | 类型 |
| :----: | :----: | :----: |
| common | 需要注入的公共模块 | Module |
| modules | 注册的模块集合 | Module |

### `dispatch.{moduleName}.{fnName}(payload)`
| 参数 | 说明 | 类型 |
| :----: | :----: | :----: |
| moduleName | 调用的具体模块名，需在bootstrap中注册 | string |
| fnName | 调用模块的方法名，reducer/effect | string |
| payload | 传递的负载值 | object |

## 调试
你可以使用 [cs-redux-devtool](https://github.com/freezeYe/cs-redux-devtool) 来调试你的项目，追踪历史数据变化。
<p align="center">
  <img width="400px" src="https://github.com/freezeYe/assets/blob/master/redux_devtool.png" />
</p>


## 注意

Dispatch调用优先级为 effects -> reducers，所以当一个模块下存在同名的reducer和effect时，只会执行effect。

## 问题

如果您对本库有更好的建议，或者遇到了任何使用上的问题，可以在这里记录:
[https://github.com/tnfe/clean-state/issues](https://github.com/tnfe/clean-state/issues) 

## 许可
[MIT](./LICENSE)
