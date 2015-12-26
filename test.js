'use strict'

const ava = require('ava')
const assert = require('assert')
const AlgebraicType = require('./')
const test = (name, f) => ava(name, t => { f(t); t.end() })


const Action = AlgebraicType({
  ReceiveProducts: {
    products: Array,
  },

  AddToCart: {
    productId: String
  },

  CheckoutRequest: { },

  CheckoutSuccess: {
    cart: Object,
  },

  CheckoutFailure: {
    cart: Object,
  },

})

const TestNamespace = 'chris/prefix/'
const NamespaceAction = AlgebraicType({
  meta: {
    namespace: TestNamespace,
  },

  ReceiveProducts: {
    products: Array,
  },

  AddToCart: {
    productId: String
  },

  CheckoutRequest: { },

  CheckoutSuccess: {
    cart: Object,
  },

  CheckoutFailure: {
    cart: Object,
  },

})


// value constructor
test('value constructor valid data', t => {
  t.same(
    Action.ReceiveProducts({ products: [ { id: '1' } ], meta: { time: 1 } }),
    { type: 'ReceiveProducts', products: [ { id: '1' } ], meta: { time: 1 } }
  )
})

test('value constructor valid extra data', t => {
  t.same(
    Action.CheckoutRequest({ total: 100 }),
    { type: 'CheckoutRequest', total: 100 }
  )
})

test('value constructor with no parameter when no data required', t => {
  t.same(
    Action.CheckoutRequest(),
    { type: 'CheckoutRequest' }
  )
})

test('value constructor with symbol', t => {
  const TEST = Symbol('Reticulate Spline')
  const action = Action.CheckoutRequest({ [TEST]: 1 })
  t.same(action[TEST], 1)
})

test('value constructor with invalid data', t => {
  t.throws(() => Action.ReceiveProducts({ products: 'wow' }))
})


// isX
test('isX() true', t => {
  t.true(Action.isReceiveProducts({ type: 'ReceiveProducts' }))
})

test('isX() false', t => {
  t.false(Action.isReceiveProducts({ type: 'Nyan' }))
})


// validate()
test('validate() valid object', t => {
  const VALID_OBJECT = { type: 'ReceiveProducts', products: [ ] }
  t.ok(Action.validate(VALID_OBJECT) === VALID_OBJECT)
})

test('validate() invalid object', t => {
  const INVALID_OBJECT = { type: 'ReceiveProducts', products: { } }
  t.throws(() => Action.validate(INVALID_OBJECT))
})

test('validate() untyped object', t => {
  const UNTYPED_OBJECT = { products: { } }
  t.throws(() => Action.validate(UNTYPED_OBJECT))
})

test('validate() unknown object', t => {
  const UNKNOWN_TYPE_OBJECT = { type: '@@redux/INIT', products: { } }
  t.ok(Action.validate(UNKNOWN_TYPE_OBJECT) === UNKNOWN_TYPE_OBJECT)
})


// hasType()
test('hasType() true', t => {
  t.true(Action.hasType('ReceiveProducts'))
  t.true(NamespaceAction.hasType('ReceiveProducts'))
})

test('hasType() false', t => {
  t.false(Action.hasType('@@redux/INIT'))
  t.false(Action.hasType('@@redux/hasOwnProperty'))
  t.false(Action.hasType('@@redux/__proto__'))
})


// toString()
test('toString()', t => {
  t.ok(Action.ReceiveProducts.toString() === 'ReceiveProducts')
  t.ok(NamespaceAction.ReceiveProducts.toString() === 'ReceiveProducts')
})


// constructor
test('force type name not to start with lowercase', t => {
  t.throws(() => AlgebraicType({ setColor: { } }))
})
test('allows `meta` key', t => {
  AlgebraicType({ meta: { } })
})


// namepsacing
test('namespacing value constructor valid data', t => {

  t.same(
    NamespaceAction.ReceiveProducts({ products: [ { id: '1' } ], meta: { time: 1 } }),
    { type: TestNamespace + 'ReceiveProducts', products: [ { id: '1' } ], meta: { time: 1 } }
  )
})

test('namespaced value constructor valid extra data', t => {
  t.same(
    NamespaceAction.CheckoutRequest({ total: 100 }),
    { type: TestNamespace + 'CheckoutRequest', total: 100 }
  )
})

test('namespaced value constructor with no parameter when no data required', t => {
  t.same(
    NamespaceAction.CheckoutRequest(),
    { type: TestNamespace + 'CheckoutRequest' }
  )
})

test('namespaced value constructor with symbol', t => {
  const TEST = Symbol('Reticulate Spline')
  const action = NamespaceAction.CheckoutRequest({ [TEST]: 1 })
  t.same(action[TEST], 1)
})

test('namespaced value constructor create different action type for same action name', t => {
  t.notSame(NamespaceAction.CheckoutRequest(), Action.CheckoutRequest())
})

test('namespaced action produced different action from unnamespaced action', t => {
  t.true(Action.isReceiveProducts({ type: 'ReceiveProducts' }))
  t.false(NamespaceAction.isReceiveProducts({ type: 'ReceiveProducts' }))

  t.true(NamespaceAction.isReceiveProducts({ type: TestNamespace + 'ReceiveProducts' }))
  t.false(Action.isReceiveProducts({ type: TestNamespace + 'ReceiveProducts' }))
})
