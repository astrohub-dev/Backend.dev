import mongoose from "mongoose";
import request from "supertest"
import { createApp } from "../createApp.mjs";

describe("get /api/auth/status", () => {
    let app;
    beforeAll(() => {
        mongoose.connect('mongodb://localhost:27017/backend-dev-DB-e2e')
            .then(() => console.log('Connected to test-DataBase'))
            .catch((err) => console.log(`Error: ${err}`));
        app = createApp();
    })
    it("should return 401 if user is not authenticated", async () => {
        const response = await request(app).get("/api/auth/status");
        expect(response.status).toBe(401);
    });

    it("should return 200 if user is authenticated", async () => {
        const response = await request(app).get("/api/auth/status");
        expect(response.status).toBe(200);
    });
    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        console.log('Disconnected from test-DataBase');
    }); 
});