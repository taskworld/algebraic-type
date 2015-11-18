'use strict'

const assert = require('assert')
const AlgebraicType = require('./')

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

// valid data
assert.deepEqual(
  Action.ReceiveProducts({ products: [ { id: '1' } ], meta: { time: 1 } }),
  { type: 'ReceiveProducts', products: [ { id: '1' } ], meta: { time: 1 } }
)

// invalid data
assert.throws(
  () => Action.ReceiveProducts({ products: 'wow' })
)

// isX
assert.strictEqual(
  Action.isReceiveProducts({ type: 'ReceiveProducts' }),
  true
)
assert.strictEqual(
  Action.isReceiveProducts({ type: 'Nyan' }),
  false
)

// check() valid
assert.deepEqual(
  Action.check({ type: 'ReceiveProducts', products: [ ] }),
  { type: 'ReceiveProducts', products: [ ] }
)

// check() invalid
assert.throws(
  () => Action.check({ type: 'ReceiveProducts', products: { } })
)

// check() untyped
assert.throws(
  () => Action.check({ products: { } })
)

// check() unknown
assert.deepEqual(
  Action.check({ type: '@@redux/INIT', products: { } }),
  { type: '@@redux/INIT', products: { } }
)

// hasType()
assert.deepEqual(
  Action.hasType('ReceiveProducts'),
  true
)
assert.deepEqual(
  Action.hasType('@@redux/INIT'),
  false
)
assert.deepEqual(
  Action.hasType('hasOwnProperty'),
  false
)
