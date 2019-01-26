# ne-gorm-schemata
This is a bi-directional NodeJS Gremlin ORM Schema to GraphQL Schema converter

## Plans
This repo will be the location for some code I plan to write to translate schemas defined for use with `git@github.com:gremlin-orm/gremlin-orm.git` back and forth to GraphQL SDL typeDefs. Ideally we can go from defining something like 

```js
const gremlinOrm = require('gremlin-orm');
const g = new gremlinOrm('janusgraph'); // connects to localhost:8182 by default

const Person = g.define('person', {
  name: {
    type: g.STRING,
    required: true
  },
  age: {
    type: g.NUMBER
  }
});
```

to something like
```js
const gremlinOrm = require('gremlin-orm');
const g = new gremlinOrm('janusgraph'); // connects to localhost:8182 by default
const { gql } = require('ne-gorm-schemata');

const Person = gql(g)`
  type Person {
    name: String!
    age: Int
  }
`
```

### AST Parsing
Using the library `ne-schemata` in conjunction with `gremlin-orm`, `ne-gorm-schemata` should be able to achieve what is shown above by simply parsing the SDL, walking the generated schema and running a `g.define()` on each of the non root types defined. Things like directives, enums, etc.. will need to be skipped unless there is a relevant analogue. 
