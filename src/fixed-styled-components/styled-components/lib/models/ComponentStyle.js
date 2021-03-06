'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var PropTypes = require('prop-types');

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _hash = require('../vendor/glamor/hash');

var _hash2 = _interopRequireDefault(_hash);

var _flatten = require('../utils/flatten');

var _flatten2 = _interopRequireDefault(_flatten);

var _parse = require('../vendor/postcss-safe-parser/parse');

var _parse2 = _interopRequireDefault(_parse);

var _postcssNested = require('../vendor/postcss-nested');

var _postcssNested2 = _interopRequireDefault(_postcssNested);

var _autoprefix = require('../utils/autoprefix');

var _autoprefix2 = _interopRequireDefault(_autoprefix);

var _StyleSheet = require('./StyleSheet');

var _StyleSheet2 = _interopRequireDefault(_StyleSheet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var babelPluginFlowReactPropTypes_proptype_GlamorInsertedRule = require('../types').babelPluginFlowReactPropTypes_proptype_GlamorInsertedRule || PropTypes.any;

var babelPluginFlowReactPropTypes_proptype_NameGenerator = require('../types').babelPluginFlowReactPropTypes_proptype_NameGenerator || PropTypes.any;

var babelPluginFlowReactPropTypes_proptype_RuleSet = require('../types').babelPluginFlowReactPropTypes_proptype_RuleSet || PropTypes.any;

/*
 ComponentStyle is all the CSS-specific stuff, not
 the React-specific stuff.
 */
exports.default = function (nameGenerator) {
  var inserted = {};

  var ComponentStyle = function () {
    function ComponentStyle(rules) {
      _classCallCheck(this, ComponentStyle);

      this.rules = rules;
      if (!_StyleSheet2.default.injected) _StyleSheet2.default.inject();
      this.insertedRule = _StyleSheet2.default.insert('');
    }

    /*
     * Flattens a rule set into valid CSS
     * Hashes it, wraps the whole chunk in a ._hashName {}
     * Parses that with PostCSS then runs PostCSS-Nested on it
     * Returns the hash to be injected on render()
     * */


    _createClass(ComponentStyle, [{
      key: 'generateAndInjectStyles',
      value: function generateAndInjectStyles(executionContext) {
        var flatCSS = (0, _flatten2.default)(this.rules, executionContext).join('').replace(/^\s*\/\/.*$/gm, ''); // replace JS comments
        var hash = (0, _hash2.default)(flatCSS);
        if (!inserted[hash]) {
          var selector = nameGenerator(hash);
          inserted[hash] = selector;
          var root = (0, _parse2.default)('.' + selector + ' { ' + flatCSS + ' }');
          (0, _postcssNested2.default)(root);
          (0, _autoprefix2.default)(root);
          this.insertedRule.appendRule(root.toResult().css);
        }
        return inserted[hash];
      }
    }]);

    return ComponentStyle;
  }();

  return ComponentStyle;
};

module.exports = exports['default'];
