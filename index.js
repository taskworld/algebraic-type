
// I try to write this in ES5 because it may be open-sourced.
var DataStructure = require('data-structure')

function AlgebraicType (subtypes) {

  var types = { }

  Object.keys(subtypes).forEach(function (subtypeName) {

    var schema = subtypes[subtypeName]
    var check = DataStructure(schema)

    function construct (fields) {
      return Object.assign({ type: subtypeName }, check(fields))
    }

    function is (fields) {
      return fields.type === subtypeName
    }

    construct.check = check
    types[subtypeName] = construct
    types['is' + subtypeName] = is
  })

  types.check = function (object) {
    if (!object.type) {
      throw new TypeError('Expected `type` property')
    }
    if (types[object.type] && types[object.type].check) {
      return types[object.type].check(object)
    }
    return object
  }

  types.hasType = function (typeName) {

    return !!(types[typeName] && types[typeName].check)
  }

  return types
}

module.exports = AlgebraicType
