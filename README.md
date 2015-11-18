# algebraic-type

Algebraic types for JavaScript. Inspired by [adt](https://www.npmjs.com/package/adt) and the [Elm architecture](https://github.com/evancz/elm-architecture-tutorial/), but works with plain object.


## Why?

To reduce boilerplate in generating and checking Redux action objects.
To reduce errors when creating Redux action types and reducers.
To allow action’s shape to be specified.


## Examples

```js
import AlgebraicType from 'algebraic-type'
```

### Simple Example

```elm
type Action = Increment | Decrement
```

```js
const Action = AlgebraicType({
  Increment: { },
  Decrement: { },
})
```


### Todo Example from Redux

- __The Flux/Redux approach is to define action types as string constants.__
  Each action type name is spelled out twice.
  There is a possibility that the constant or the value is misspelled.

  ```js
  export const ADD_TODO = 'ADD_TODO'
  export const DELETE_TODO = 'DELETE_TODO'
  export const EDIT_TODO = 'EDIT_TODO'
  export const COMPLETE_TODO = 'COMPLETE_TODO'
  export const COMPLETE_ALL = 'COMPLETE_ALL'
  export const CLEAR_COMPLETED = 'CLEAR_COMPLETED'
  ```

- __In Elm, you declare your action as an algebraic data type.__
  This also lets you specify the shape of your action,
  as well as providing type safety.

  ```elm
  type Action
      = AddTodo String
      | DeleteTodo Int
      | EditTodo Int String
      | CompleteTodo Int
      | CompleteAll
      | ClearCompleted
  ```

- __With algebraic-type, you create an algebraic type like this.__
  Each key is the action type’s name.
  Inside it, you describe the shape of the object.

  ```js
  const Action = AlgebraicType({
    AddTodo: {
      text: String,
    },
    DeleteTodo: {
      id: Number,
    },
    EditTodo: {
      id: Number,
      text: String,
    },
    CompleteTodo: {
      id: Number,
    },
    CompleteAll: { },
    ClearCompleted: { },
  })
  ```

  You still have the benefit of seeing all the actions in your application in a single place.

- __Plain Redux Action Creators: Create an object literal directly.__

  ```js
  export function addTodo(text) {
    return { type: types.ADD_TODO, text }
  }
  ```

  There is a possibility that you misspelt the property name.
  Maybe it’s late at night and you’re hungry and thinking about some tofu soup.
  You typed in `types.ADD_TOFU` (or just `ADD_TOFU` in case of ES6 imports).
  You end up dispatching an `undefined` action.
  You may also be dispatching a malformed object.

- __With `algebraic-type`: You invoke the value constructor.__

  ```js
  function addTodo(text) {
    return Action.AddTodo({ text })
  }
  ```

  The value constructor validates what’s passed into it,
  and returns a __plain, serializable object__ with the `type` property set to the constructor’s name.

  ```js
  Action.AddTodo({ text: 'Learn Redux' })
  // => { type: 'AddTodo', text: 'Learn Redux' }
  ```

  You immediately get an error if you misspell it.

  ```js
  Action.AddTofu({ text: 'Learn Redux' })
  // => TypeError: Action.AddTofu is not a function
  ```

  You immediately get an error if it is not in the shape you specified.

  ```js
  Action.AddTodo({ task: 'Learn Redux' })
  // => Error: missing property: "text"
  ```

  __`algebraic-type` is not a replacement for action creators;__
  they are simply utilities that helps you creating well-formed action types and action objects.
  [The case for action creators still holds](http://rackt.org/redux/docs/recipes/ReducingBoilerplate.html#action-creators).

- __Plain Redux: Use switch statements.__
  If you misspeelt the imported name, your reducer simply won’t process the action.

  ```js
  export default function todos(state = initialState, action) {
    switch (action.type) {
      case ADD_TODO:
        ...
  
      case DELETE_TODO:
        ...
  
      default:
        return state
    }
  }
  ```

- __With `algebraic-type`: Use the generated matcher function.__
  If you misspelt the action name, you immediately get a TypeError.

  ```js
  export default function todos(state = initialState, action) {
    if (Action.isAddTodo(action)) {
      ...
    }
    else if (Action.isDeleteTodo(action)) {
      ...
    }
    else {
      return state
    }
  }
  ```

- TK `createReducer` example.


## Moar Feature Ideas

These are just ideas; they are not implemented yet.

- __Breaking:__ Rename `check()` to `validate()` so that it is compatible with `data-structure`.

- __Force all user-specified types to start with an uppercase.__ Throw an error otherwise.

  This allows new features to be innovated without fear of clashing with user types.

- __Add name prefix to generated `type` to prevent them from clashing.__
  Maybe follow the [ducks](https://github.com/erikras/ducks-modular-redux) convention:

  ```js
  const Action = AlgebraicType({
    prefix: 'my-app/widgets/',
    Load: { },
    Create: { widget: Object },
    Update: { widget: Object },
    Remove: { widget: Object },
  })
  ```

  Another example is to construct similar-looking actions:

  ```js
  function AsyncAction(prefix) {
    return new AlgebraicType({
      prefix,
      Request: { },
      Success: { response: Object },
      Failure: { error: String },
    })
  }
  ```

- __Allow type composition/nested actions.__ This allows actions to be more modular.

  Here is an example from Elm’s architecture tutorial, [a list of counters](https://github.com/evancz/elm-architecture-tutorial/#example-3-a-dynamic-list-of-counters):

  ```js
  import { Action as CounterAction } from './counter'

  const Action = AlgebraicType({
    prefix: 'my-app/main/',
    Insert: { },
    Remove: { },
    Modify: { id: String, action: CounterAction },
  })
  ```

- __Implement toString()__ so that it can be used easily with `createReducer`, esp when composed of multiple types.

- __switch() function__ that takes an incoming object and switches between functions based on type.

- __types() function__ that returns an list of available keys.
