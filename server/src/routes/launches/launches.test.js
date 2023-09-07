const request = require('supertest');

const app = require('../../app');
const { connectDB , mongoDisconnect } = require('../../services/mongo');

const { loadPlanetData } = require('../../models/planets.model');
// const { loadLaunchData } = require('../../models/launches.model');

describe('Launch ApI', ()=>{
    beforeAll(async()=>{
       await connectDB();
       await loadPlanetData();
    //    await loadLaunchData();
    })

    afterAll(async()=>{
        await mongoDisconnect();
    });

    describe('Test Get /launches', () => {
        test('It should respond with 200 success', async () => {
            const response = await request(app)
                .get('/v1/launches')
                .expect('Content-Type', /json/)
                .expect(200);
            // expect(response.statusCode).toBe(200);
        });
    })
    
    describe('Test Post /launch', () => {
        const completeLaunchData = {
            mission: "USS Enterprise",
            rocket: "NCC 17402-D",
            target: "Kelper-62 f",
            launchDate: "January 4, 2028"
        };
    
        const launchWithoutData = {
            mission: "USS Enterprise",
            rocket: "NCC 17402-D",
            target: "Kelper-62 f",
        };
    
        const launchWithoutDataInvalidDate = {
            mission: "USS Enterprise",
            rocket: "NCC 17402-D",
            target: "Kelper-62 f",
            launchDate: "root"
        };
    
    
        // test('It should respond with 201 success', async () => {
        //     const response = await request(app)
        //         .post('/v1/launches')
        //         .send(completeLaunchData)
        //         .expect('Content-Type', /json/)
        //         .expect(201);
    
        //     const requestDate = new Date(completeLaunchData.launchDate).valueOf();
        //     const responseDate = new Date(response.body.launchDate).valueOf();
        //     expect(responseDate).toBe(requestDate)
    
        //     expect(response.body).toMatchObject(launchWithoutData)
        // });
    
        test('It should catch missing required parameters', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchWithoutData)
                .expect('Content-Type', /json/)
                .expect(400);
    
            expect(response.body).toStrictEqual({
                error: 'Missing required launch property',
            })
        });
    
        test('It should catch invalid dates', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchWithoutDataInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400);
    
            expect(response.body).toStrictEqual({
                error: 'Invalid Launch date',
            })
        });
        
    })
    
})

