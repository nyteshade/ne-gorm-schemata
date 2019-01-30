"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showResults = exports.s = exports.sdl = exports.findOrCreate = void 0;

var _Schremlin = require("./Schremlin");

var _gremlinOrm = _interopRequireDefault(require("gremlin-orm"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sdl = "\n  type Person {\n    id: ID!\n    name: String \n    email: String\n    age: Int\n  }\n\n  type Job {\n    id: ID!\n    name: String\n  }\n";
exports.sdl = sdl;
var s = new _Schremlin.Schremlin(sdl);
exports.s = s;
console.log(s.ormSchema);
console.log(s.remoteTypes);

var showResults = function showResults(error, results) {
  if (error) {
    console.log('Error!!', error);
  } else {
    console.log(results);
  }
};

exports.showResults = showResults;

var findOrCreate = function findOrCreate(schema, data) {
  schema.find(data, function (error, searchResults) {
    if (error || !searchResults) {
      schema.create(data, showResults);
    } else {
      console.log("Skipping ".concat(data.name, " as it already exists"));
    }
  });
};

exports.findOrCreate = findOrCreate;

if (!s.connected) {
  s.reconnect();
}

findOrCreate(s.remoteTypes.Job, {
  id: '1',
  name: 'Engineer'
});
findOrCreate(s.remoteTypes.Job, {
  id: '2',
  name: 'Scientist'
});
findOrCreate(s.remoteTypes.Person, {
  id: '1',
  name: 'Brielle',
  age: 21,
  email: 'nyteshade@gmail.com'
});