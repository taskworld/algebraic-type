
var DataStructure = require('data-structure')
var assign = require('object-assign')

function AlgebraicType (subtypes) {

  var types = { }
  var metaData = assign({
    namespace: ''
  }, subtypes.meta)

  var keys = Object.keys(subtypes)
  var indexOfMeta = keys.indexOf('meta')
  subTypeKeys = indexOfMeta == -1 ? keys : keys.splice(indexOfMeta, 1)

  subTypeKeys.forEach(function (subtypeName) {

    if (/^[a-z]/.test(subtypeName)) {
      if (subtypeName !== 'meta') {
        throw new Error('Type name `' + subtypeName + '` should not start with lowercase.')
      }
    }
    // Should ignore meta action???

    var schema = subtypes[subtypeName]
    var validate = DataStructure(schema)

    function construct (fields) {
      return assign({ type: subtypeName }, validate(fields || { }))
    }

    function is (fields) {
      return fields.type === subtypeName
    }

    function getName () {
      return subtypeName
    }

    construct.validate = validate
    construct.toString = getName
    types[subtypeName] = construct
    types['is' + subtypeName] = is
  })

  types.validate = function (object) {
    if (!object.type) {
      throw new TypeError('Expected `type` property')
    }
    if (types[object.type] && types[object.type].validate) {
      return types[object.type].validate(object)
    }
    return object
  }

  types.hasType = function (typeName) {

    return !!(types[typeName] && types[typeName].validate)
  }

  return types
}

module.exports = AlgebraicType
