"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Schremlin = exports.GORM_TYPES = exports.REMOTE_TYPES = exports.ORM_SCHEMA = exports.ORM_OPTS = exports.ORM = void 0;

var _neSchemata = require("ne-schemata");

var _gremlinOrm = _interopRequireDefault(require("gremlin-orm"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineEnumerableProperties(obj, descs) { for (var key in descs) { var desc = descs[key]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, key, desc); } if (Object.getOwnPropertySymbols) { var objectSymbols = Object.getOwnPropertySymbols(descs); for (var i = 0; i < objectSymbols.length; i++) { var sym = objectSymbols[i]; var desc = descs[sym]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, sym, desc); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ORM = Symbol('Gremlin-ORM Instance');
exports.ORM = ORM;
var ORM_OPTS = Symbol('Gremlin-ORM Instance Creation Options');
exports.ORM_OPTS = ORM_OPTS;
var ORM_SCHEMA = Symbol('Gremlin-ORM Compatible Schema');
exports.ORM_SCHEMA = ORM_SCHEMA;
var REMOTE_TYPES = Symbol('Gremlin Defined Schema Types');
exports.REMOTE_TYPES = REMOTE_TYPES;
var GORM_TYPES = {
  String: function String(orm) {
    return orm.STRING;
  },
  Int: function Int(orm) {
    return orm.NUMBER;
  },
  Float: function Float(orm) {
    return orm.NUMBER;
  },
  Boolean: function Boolean(orm) {
    return orm.BOOLEAN;
  },
  ID: function ID(orm) {
    return orm.STRING;
  },
  Date: function Date(orm) {
    return orm.DATE;
  }
};
/**
 * The library `gremlin-orm` contains a connector and translator to the
 * Gremlin language and remote database. The `GremlinOrmOptions` type
 * defines the parameters that can be deconstructed and passed to a new
 * instance call of the `Gorm` class.
 *
 * @type {GremlinOrmOptions}
 */

exports.GORM_TYPES = GORM_TYPES;

var Schremlin =
/*#__PURE__*/
function (_Schemata) {
  _inherits(Schremlin, _Schemata);

  /**
   * Creates a new instance of Gremlin-ORM Schemata for use with databases
   * using Gremlin-Groovy or other services supported by Gremlin-ORM.
   *
   * @param {string} typeDefs the SDL definition for the schema to create
   * @param {GremlinOrmOptions} gormOpts an optional object containing the
   * configuration parameters that can be passed to a new Gorm instance as
   * exported by the `gremlin-orm` library.
   */
  function Schremlin(typeDefs, resolvers) {
    var _this;

    var gormOpts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
      dialect: 'janusgraph'
    };

    _classCallCheck(this, Schremlin);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Schremlin).call(this, typeDefs, resolvers));
    _this[ORM_OPTS] = gormOpts;
    _this[ORM] = _this.createOrmInstance();
    _this[REMOTE_TYPES] = {};
    _this[ORM_SCHEMA] = _this.buildORMSchema();

    _this.defineRemoteSchemas();

    return _this;
  }
  /**
   * When error's occur, the connection to the Gremlin listener can be shut
   * down. This method is invoked once when a new instance is created and again
   * whenever called to restart the connection to the server.
   *
   * @param {GremlinOrmOptions} gormOpts an object containing parameters to use
   * when instantiating a new instance of Gorm. If nothing is supplied, the
   * options originally provided to the constructor are used instead.
   * @return {Gorm} an instantiated instance of `Gorm`
   */


  _createClass(Schremlin, [{
    key: "createOrmInstance",
    value: function createOrmInstance(gormOpts) {
      var _Symbol$toStringTag, _Object$assign, _mutatorMap;

      var _ref = gormOpts || this[ORM_OPTS],
          dialect = _ref.dialect,
          port = _ref.port,
          url = _ref.url,
          options = _ref.options;

      return Object.assign(new _gremlinOrm.default(dialect, port, url, options), (_Object$assign = {}, _Symbol$toStringTag = Symbol.toStringTag, _mutatorMap = {}, _mutatorMap[_Symbol$toStringTag] = _mutatorMap[_Symbol$toStringTag] || {}, _mutatorMap[_Symbol$toStringTag].get = function () {
        return 'GremlinOrmOptions';
      }, _defineEnumerableProperties(_Object$assign, _mutatorMap), _Object$assign));
    }
  }, {
    key: "buildORMSchema",

    /**
     * This method walks a `Schemata.types` object and invokes typical Gremlin
     * style schema creation (ala JanusGraph). The keys are the names of types
     * and fields and the values are GraphQL SDL type values.
     *
     * @param  {Object} typeMap an object with keys that are the names of types
     * and fields and values that are GraphQL SDL type values.
     */
    value: function buildORMSchema(typeMap) {
      var orm = this.orm;
      var types = typeMap || this.types;
      var fields = {};

      var _arr = Object.keys(types);

      for (var _i = 0; _i < _arr.length; _i++) {
        var type = _arr[_i];

        if (/Query|Mutation|Subscription/.test(type)) {
          continue;
        }

        try {
          var _arr2 = Object.keys(types[type]);

          for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
            var field = _arr2[_i2];
            var sdlType = types[type][field].type;
            var gormKey = /(\w+)/.exec(sdlType);

            if (!gormKey) {
              continue;
            } else {
              gormKey = gormKey[1];
            }

            var gormType = GORM_TYPES[gormKey](orm);
            var required = /\!/.test(sdlType);
            (fields[type] = fields[type] || {})[field] = {
              type: gormType,
              required: required
            };
          }

          if (Object.keys(fields).length) {
            orm.define(type, fields);
          } else {
            console.log("No fields for ".concat(type));
            continue;
          }
        } catch (err) {
          console.error(err);
          continue;
        }
      }

      return fields;
    }
  }, {
    key: "defineRemoteSchemas",
    value: function defineRemoteSchemas(gremlinSchema) {
      var ormSchema = gremlinSchema || this.ormSchema;

      var _arr3 = Object.keys(ormSchema);

      for (var _i3 = 0; _i3 < _arr3.length; _i3++) {
        var schema = _arr3[_i3];
        console.log("Defining schema for ".concat(schema));
        this.remoteTypes[schema] = this.orm.define(schema, ormSchema[schema]);
      }
    }
  }, {
    key: "reconnect",
    value: function reconnect() {
      var retries = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;

      if (this.orm.client.connected) {
        return true;
      }

      for (var i = 0; i < retries; i++) {
        this.orm = this.createOrmInstance();

        if (this.connected) {
          this.defineRemoteSchemas();
          return true;
        }
      }

      if (!this.connected) {
        return false;
      }
    }
  }, {
    key: "remoteTypes",
    get: function get() {
      return this[REMOTE_TYPES];
    },
    set: function set(value) {
      this[REMOTE_TYPES] = value;
    }
    /**
     * Retrieves the instance's `gremlin-orm` Gorm instance
     *
     * @return {Gorm} the internal instance of Gorm, exported by the
     * `gremlin-orm` library.
     */

  }, {
    key: "orm",
    get: function get() {
      return this[ORM];
    }
    /**
     * Sets a new instance of the `gremlin-orm` for this instance of
     * Schremlin.
     *
     * @param  {Gorm} value a new instance of the Gorm class exported by the
     * `gremlin-orm` library.
     */
    ,
    set: function set(value) {
      this[ORM] = value;
    }
    /**
     * Retrieves the calculated schema that is usable by gremlin-orm in general.
     * 
     * @return {Object} the calculated gremlin-orm compatible schema def
     */

  }, {
    key: "ormSchema",
    get: function get() {
      return this[ORM_SCHEMA];
    },
    set: function set(value) {
      this[ORM_SCHEMA] = value;
    }
  }, {
    key: "connected",
    get: function get() {
      console.log('Connected? ' + this.orm.client.connected);
      return this.orm.client.connected;
    }
  }]);

  return Schremlin;
}(_neSchemata.Schemata);

exports.Schremlin = Schremlin;