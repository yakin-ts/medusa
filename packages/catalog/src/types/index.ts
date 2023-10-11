import {
  ModuleJoinerConfig,
  ModulesSdkTypes,
  Subscriber,
} from "@medusajs/types"

/**
 * Represents the module options that can be provided
 */
export interface CatalogModuleOptions {
  customAdapter?: {
    constructor: new (...args: any[]) => any
    options: any
  }
  defaultAdapterOptions?: ModulesSdkTypes.ModuleServiceInitializeOptions
  schema: string
}

/**
 * Represents the schema object representation once the schema has been processed
 */
export type SchemaObjectRepresentation = {
  [key: string]: {
    /**
     * The name of the type/entity in the schema
     */
    entity: string

    /**
     * All parents a type/entity refers to in the schema
     * or through links
     */
    parents: {
      /**
       * The reference to the schema object representation
       * of the parent
       */
      ref: SchemaObjectRepresentation[0]

      /**
       * When a link is inferred between two types/entities
       * we are configuring the link tree and therefore we are
       * storing the reference to the parent type/entity within the
       * schema which defer from the true parent from a pure entity
       * point of view
       */
      inConfigurationRef?: SchemaObjectRepresentation[0]

      /**
       * The property the data should be assigned to in the parent
       */
      targetProp: string

      /**
       * Are the data expected to be a list or not
       */
      isList?: boolean
    }[]

    /**
     * The default fields to query for the type/entity
     */
    fields: string[]

    /**
     * @Listerners directive is required and all listeners found
     * for the type will be stored here
     */
    listeners: string[]

    /**
     * The alias for the type/entity retrieved in the corresponding
     * module
     */
    alias: string

    /**
     * The module joiner config corresponding to the module the type/entity
     * refers to
     */
    moduleConfig: ModuleJoinerConfig
  }
}

/**
 * Represents the storage provider interface, TODO: move this to @medusajs/types once we are settled on the interface
 */
export interface StorageProvider {
  new (
    container: { [key: string]: any },
    storageProviderOptions: unknown & {
      schemaConfigurationObject: SchemaObjectRepresentation
    },
    moduleOptions: CatalogModuleOptions
  ): StorageProvider

  query(...args): unknown
  consumeEvent(configurationObject: any): Subscriber
}

export type Select = {
  [key: string]: boolean | Select | Select[]
}

export type Where = {
  [key: string]: any
}

export type OrderBy = {
  [path: string]: OrderBy | "ASC" | "DESC" | 1 | -1 | true | false
}

export type QueryFormat = {
  select: Select
  where?: Where
}

export type QueryOptions = {
  skip?: number
  take?: number
  orderBy?: OrderBy | OrderBy[]
}

export type Resultset<Select> = {
  [key in keyof Select]: Select[key] extends boolean
    ? string
    : Select[key] extends Select[]
    ? Resultset<Select[key][0]>[]
    : Select[key] extends {}
    ? Resultset<Select[key]>
    : unknown
}