
// I try to write this in ES5 because it may be open-sourced.
var DataStructure = require('data-structure')

function AlgebraicType (subtypes) {

  var types = { }

  Object.keys(subtypes).forEach(function (subtypeName) {

    if (/^[a-z]/.test(subtypeName)) {
      if (subtypeName !== 'meta') {
        throw new Error('Type name `' + subtypeName + '` should not start with lowercase.')
      }
    }

    var schema = subtypes[subtypeName]
    var validate = DataStructure(schema)

    function construct (fields) {
      return Object.assign({ type: subtypeName }, validate(fields))
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
