import { MongoClient } from "mongodb";

const connections = {};

const makeConnection = (name, url, database, options) =>
  (connections[name] = MongoClient.connect(
    url,
    { ...options, useNewUrlParser: true }
  ).then(client => ({
    client,
    db: client.db(database)
  })));

const connect = (url, database, options) =>
  makeConnection("default", url, database, options);

const getConnection = name =>
  name in connections
    ? connections[name]
    : Promise.reject(
        new Error(`Connection '${name}' has not been initialized`)
      );

export { connect, getConnection, makeConnection };
