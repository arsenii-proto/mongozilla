import { connect, getConnection, makeConnection } from "@/src/Connection";

const dbConfig = {
  url: "mongodb://admin:5Wg959RRHJbv7b4@ds247171.mlab.com:47171/arsenii-proto",
  database: "arsenii-proto",
  name: "test"
};

describe("connect", () => {
  it("should be exported", () => {
    expect(connect).toBeDefined();
  });

  it("should return promise", () => {
    const result = connect(
      dbConfig.url,
      dbConfig.database
    );

    expect(result).toBeInstanceOf(Promise);
  });

  it("should resolve connection client with db", done => {
    const result = connect(
      dbConfig.url,
      dbConfig.database
    );

    expect(result).toBeInstanceOf(Promise);

    result
      .then(({ client, db }) => {
        expect(client).toBeDefined();
        expect(db).toBeDefined();
      })
      .then(done, done);
  });
});

describe("getConnection", () => {
  it("should be exported", () => {
    expect(getConnection).toBeDefined();
  });

  it("should return promise", () => {
    const result = getConnection(dbConfig.name).catch(() => {});

    expect(result).toBeInstanceOf(Promise);
  });

  it("should reject promise when connection was not initialized", done => {
    getConnection(dbConfig.name)
      .then(() => {
        done(new Error());
      })
      .catch(() => {
        done();
      });
  });

  it("should resolve promise after makeConnection with same name", done => {
    makeConnection(dbConfig.name, dbConfig.url, dbConfig.database)
      .then(() => {
        getConnection(dbConfig.name)
          .then(() => done())
          .catch(done);
      })
      .then(() => done())
      .catch(done);
  });
});
