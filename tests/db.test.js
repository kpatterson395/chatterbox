const { MongoClient } = require("mongodb");
const dbUrl = "mongodb://localhost:27017/";

describe("insert", () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db("chatbox");
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should insert a message into collection", async () => {
    const messages = db.collection("messages");

    const mockMessage = { _id: "1234", body: "test" };
    await messages.insertOne(mockMessage);

    const insertedMessage = await messages.findOne({ _id: "1234" });
    expect(insertedMessage).toEqual(mockMessage);
  });

  it("should insert a user into collection", async () => {
    const users = db.collection("users");

    const mockUser = { _id: "1234", email: "test@test.com" };
    await users.insertOne(mockUser);

    const insertedUser = await users.findOne({ _id: "1234" });
    expect(insertedUser).toEqual(mockUser);
  });
  it("should insert a comment into collection", async () => {
    const comments = db.collection("comments");

    const mockComment = { _id: "1234", body: "test comment" };
    await comments.insertOne(mockComment);

    const insertedComment = await comments.findOne({ _id: "1234" });
    expect(insertedComment).toEqual(mockComment);
  });
});

describe("delete", () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db("chatbox");
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should delete a message into collection", async () => {
    const messages = db.collection("messages");

    const deleted = await messages.deleteOne({ _id: "1234" });
    expect(deleted.deletedCount).toEqual(1);
  });

  it("should delete a user into collection", async () => {
    const users = db.collection("users");

    const deleted = await users.deleteOne({ _id: "1234" });
    expect(deleted.deletedCount).toEqual(1);
  });
  it("should delete a comment into collection", async () => {
    const comments = db.collection("comments");

    const deleted = await comments.deleteOne({ _id: "1234" });
    console.log(deleted);
    expect(deleted.deletedCount).toEqual(1);
  });
});
