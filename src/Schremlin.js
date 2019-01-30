// @flow

import { Schemata } from 'ne-schemata'
import GOrm from 'gremlin-orm'

import type { SchemaSource, ResolverMap } from 'ne-schemata'

export const ORM = Symbol('Gremlin-ORM Instance')
export const ORM_OPTS = Symbol('Gremlin-ORM Instance Creation Options')
export const ORM_SCHEMA = Symbol('Gremlin-ORM Compatible Schema')
export const REMOTE_TYPES = Symbol('Gremlin Defined Schema Types')

export const GORM_TYPES = {
  String(orm) { return orm.STRING },
  Int(orm) { return orm.NUMBER },
  Float(orm) { return orm.NUMBER },
  Boolean(orm) { return orm.BOOLEAN },
  ID(orm) { return orm.STRING },
  Date(orm) { return orm.DATE },
}

/**
 * The library `gremlin-orm` contains a connector and translator to the
 * Gremlin language and remote database. The `GremlinOrmOptions` type
 * defines the parameters that can be deconstructed and passed to a new
 * instance call of the `Gorm` class.
 *
 * @type {GremlinOrmOptions}
 */
export type GremlinOrmOptions = {
  dialect?: string,
  port?: number,
  url?: string,
  options?: Object
}

export class Schremlin extends Schemata {
  /**
   * Creates a new instance of Gremlin-ORM Schemata for use with databases
   * using Gremlin-Groovy or other services supported by Gremlin-ORM.
   *
   * @param {string} typeDefs the SDL definition for the schema to create
   * @param {GremlinOrmOptions} gormOpts an optional object containing the
   * configuration parameters that can be passed to a new Gorm instance as
   * exported by the `gremlin-orm` library.
   */
  constructor(
    typeDefs: SchemaSource,
    resolvers?: ResolverMap,
    gormOpts?: GremlinOrmOptions = { dialect: 'janusgraph' }
  ) {
    super(typeDefs, resolvers)

    this[ORM_OPTS] = gormOpts
    this[ORM] = this.createOrmInstance()
    this[REMOTE_TYPES] = {}
    this[ORM_SCHEMA] = this.buildORMSchema()

    this.defineRemoteSchemas()
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
  createOrmInstance(gormOpts: GremlinOrmOptions) {
    const { dialect, port, url, options } = gormOpts || this[ORM_OPTS]

    return Object.assign(new GOrm(dialect, port, url, options), {
      get [Symbol.toStringTag]() { return 'GremlinOrmOptions' }
    })
  }

  get remoteTypes(): Object {
    return this[REMOTE_TYPES]
  }

  set remoteTypes(value: Object) {
    this[REMOTE_TYPES] = value
  }

  /**
   * Retrieves the instance's `gremlin-orm` Gorm instance
   *
   * @return {Gorm} the internal instance of Gorm, exported by the
   * `gremlin-orm` library.
   */
  get orm(): Gorm {
    return this[ORM]
  }

  /**
   * Sets a new instance of the `gremlin-orm` for this instance of
   * Schremlin.
   *
   * @param  {Gorm} value a new instance of the Gorm class exported by the
   * `gremlin-orm` library.
   */
  set orm(value: Gorm) {
    this[ORM] = value
  }

  /**
   * Retrieves the calculated schema that is usable by gremlin-orm in general.
   * 
   * @return {Object} the calculated gremlin-orm compatible schema def
   */
  get ormSchema(): Object {
    return this[ORM_SCHEMA]
  }

  set ormSchema(value: Object) {
    this[ORM_SCHEMA] = value
  }

  /**
   * This method walks a `Schemata.types` object and invokes typical Gremlin
   * style schema creation (ala JanusGraph). The keys are the names of types
   * and fields and the values are GraphQL SDL type values.
   *
   * @param  {Object} typeMap an object with keys that are the names of types
   * and fields and values that are GraphQL SDL type values.
   */
  buildORMSchema(typeMap: Object) {
    let orm = this.orm
    let types = typeMap || this.types 
    let fields = {}

    for (let type of Object.keys(types)) {
      if (/Query|Mutation|Subscription/.test(type)) { continue }

      try {
        for (let field of Object.keys(types[type])) {
          let sdlType = types[type][field].type
          let gormKey = /(\w+)/.exec(sdlType)

          if (!gormKey) { 
            continue 
          }
          else {
            gormKey = gormKey[1]
          }

          let gormType = GORM_TYPES[gormKey](orm)
          let required = /\!/.test(sdlType);

          (fields[type] = (fields[type] || {}))[field] = { 
            type: gormType, 
            required 
          }
        }

        if (Object.keys(fields).length) {
          orm.define(type, fields)
        }
        else {
          console.log(`No fields for ${type}`)
          continue
        }
      }
      catch (err) {
        console.error(err)
        continue
      }
    }

    return fields
  }

  defineRemoteSchemas(gremlinSchema: Object) {
    let ormSchema = gremlinSchema || this.ormSchema

    for (let schema of Object.keys(ormSchema)) {
      console.log(`Defining schema for ${schema}`)
      this.remoteTypes[schema] = this.orm.define(schema, ormSchema[schema])
    }
  }

  get connected() {
    console.log('Connected? ' + this.orm.client.connected)
    return this.orm.client.connected
  }

  reconnect(retries = 3) {
    if (this.orm.client.connected) {
      return true
    }
    for (let i = 0; i < retries; i++) {
      this.orm = this.createOrmInstance()
      if (this.connected) {
        this.defineRemoteSchemas()
        return true 
      }
    }

    if (!this.connected) { return false }
  }
}
