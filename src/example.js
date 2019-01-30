import { Schremlin } from './Schremlin'
import Gorm from 'gremlin-orm'
let sdl = `
  type Person {
    id: ID!
    name: String 
    email: String
    age: Int
  }

  type Job {
    id: ID!
    name: String
  }
`

let s = new Schremlin(sdl)

console.log(s.ormSchema)
console.log(s.remoteTypes)

const showResults = (error, results) => {
  if (error) {
    console.log('Error!!', error)
  }
  else {
    console.log(results)
  }
}

const findOrCreate = (schema, data) => {
  schema.find(data, (error, searchResults) => {
    if (error || !searchResults) {
      schema.create(data, showResults)
    }
    else {
      console.log(`Skipping ${data.name} as it already exists`)
    }
  })
}

if (!s.connected) {
  s.reconnect()
}

findOrCreate(s.remoteTypes.Job, {id: '1', name: 'Engineer'})
findOrCreate(s.remoteTypes.Job, {id: '2', name: 'Scientist'})

findOrCreate(s.remoteTypes.Person, {
  id: '1', 
  name: 'Brielle', 
  age: 21, 
  email:'nyteshade@gmail.com'
})

export { findOrCreate, sdl, s, showResults }