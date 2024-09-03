import request from "supertest";
import startServer from "../server.js";
import { initDBConnection, closeDBConnection } from "../initDBConnection.js";
import { findUser, updateUser } from "../services/authServices.js";

describe("test /api/auth/login", () => {
  let server = null;
  let user = null;

  beforeAll(async () => {
    await initDBConnection(process.env.DB_HOST_TEST);
    server = startServer();
  });

  afterAll(async () => {
    await closeDBConnection();
    server.close();
  });

  // ЦЕ НЕ ПРАЦЮЄ, але я не розумію чому :(
  afterEach(() => {
    const { _id } = user;
    updateUser({ _id }, { token: "" });
  });

  test("test login with correct data", async () => {
    const loginData = {
      email: "ana2@gmana.com",
      password: "1",
    };

    const { statusCode, body } = await request(server)
      .post("/api/users/login")
      .send(loginData);

    expect(statusCode).toBe(200);
    expect(body.token).toBeTruthy();
    expect(body.user.email).toBe(loginData.email);
    expect(body.user.subscription).toBe("starter");

    user = await findUser({ email: loginData.email });
    expect(user.token).toBeTruthy();

    //   const auth =
    //     "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDc4ZDBjOTdkNDQzNzk5OTllN2UwMCIsImlhdCI6MTcyNTQwMzUxOSwiZXhwIjoxNzI1NDg5OTE5fQ.LO59zeaxiyNsD0qHl8Oikj0h45Yx9HntuBA7EFeZskg";
    //   await request(server)
    //     .post("/api/users/logout")
    //     .set({ Authorization: auth });
  });
});
