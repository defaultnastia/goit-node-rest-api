import "dotenv/config";
import request from "supertest";
import startServer from "../server.js";
import { initDBConnection, closeDBConnection } from "../initDBConnection.js";
import { findUser, updateUser } from "../services/authServices.js";

const loginEmail = process.env.LOGIN_TEST_EMAIL;
const loginPassword = process.env.LOGIN_TEST_PASSWORD;

describe("test /api/auth/login", () => {
  let server = null;

  beforeAll(async () => {
    await initDBConnection(process.env.DB_HOST_TEST);
    server = startServer();
  });

  afterAll(async () => {
    await closeDBConnection();
    server.close();
  });

  afterEach(async () => {
    await updateUser({ email: loginEmail }, { token: "" });
  });

  test("test login with correct data", async () => {
    const { statusCode, body } = await request(server)
      .post("/api/users/login")
      .send({ email: loginEmail, password: loginPassword });

    expect(statusCode).toBe(200);
    expect(body.token).toBeTruthy();
    expect(body.user.email).toBe(loginEmail);
    expect(body.user.subscription).toBe("starter");

    const { token } = await findUser({ email: loginEmail });
    expect(token).toBeTruthy();
  });
});
