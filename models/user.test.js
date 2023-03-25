const request = require("supertest");
const app = require('../app');
const mongoose = require('mongoose');



describe("test get response status 200 and user", () => {
    beforeAll(() => {
        console.log("befoall");
    });
    beforeEach(() => {
        console.log("befoeach");
    });

    afterAll( async () => {
        console.log("and");
        await mongoose.connection.close();
        await app.close();
    });

    it("response 200 and user and token", async () => {
        const checkData = {
            "email": "4444@gmail.com",
            "password": "4444"
        };
        const response = await request(app).post("/api/users/login").send(checkData);
        console.log(response.statusCode, response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                token: expect.any(String),
                user: expect.objectContaining({
                    email: expect.any(String),
                    subscription: expect.any(String)
                })
            }));
    });
})

