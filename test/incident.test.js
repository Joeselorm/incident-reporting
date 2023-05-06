const chai = require('chai')
const chaiHttp = require('chai-http')
const { sequelize } = require('../models')
const app = require('../server')

chai.use(chaiHttp)
const { expect } = chai

describe('GET /api/incident', () => {
    before(async () => {
        await sequelize.authenticate()
    })

    // after(async () => {
    //     await sequelize.close()
    // })

    it('should return all incidents', async () => {
        const res = await chai.request(app)
            .get('/api/incident')

        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')

    })

    it('should return an empty array when there is no matching data', async () => {
        const res = await chai.request(app)
            .get('/api/incident')
            .query({ city: 'Derma' })

        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array').that.is.empty
    })

    it('should return an array of incidents when matching data found', async () => {
        const res = await chai.request(app)
            .get('/api/incident')
            .query({ city: 'Tema' })

        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')
        expect(res.body).to.have.lengthOf.at.least(1)
        expect(res.body[0]).to.have.property('city', 'Tema')
    })

    it('should return an array of incidents filtered by temparature range', async () => {
        const res = await chai.request(app)
            .get('/api/incident')
            .query({ min_temp: 290.03, max_temp: 294.69 })

        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')
        expect(res.body).to.have.lengthOf.at.least(1)
        expect(res.body[0].weather_report.main.temp).to.be.within(290.03, 294.69)
    })

    it('should return an array of incidents filtered by humidity range', async () => {
        const res = await chai.request(app)
            .get('/api/incident')
            .query({ min_humidity: 40, max_humidity: 50 })

        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')
        expect(res.body).to.have.lengthOf.at.least(1)
        expect(res.body[0].weather_report.main.humidity).to.be.within(40, 50)
    })

    it('should return an array of incidents filtered by city, temperature range and humidity range', async () => {
        const res = await chai.request(app)
            .get('/api/incident')
            .query({ city: 'Paris', min_temp: 290.03, max_temp: 294.69, min_humidity: 40, max_humidity: 70 })

        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')
        expect(res.body).to.have.lengthOf.at.least(1)
        expect(res.body[0]).to.have.property('city', 'Paris')
        expect(res.body[0].weather_report.main.temp).to.be.within(290.03, 294.69)
        expect(res.body[0].weather_report.main.humidity).to.be.within(40, 70)
    })
    
})

describe('POST /api/incident', () => {
    before(async () => {
        await sequelize.authenticate()
    })

    // after(async () => {
    //     await sequelize.close()
    // })

    it('should return a 400 error when the request body is empty', async () => {
        const res = await chai.request(app)
            .post('/api/incident')
            .send()

        expect(res).to.have.status(400)
        expect(res.body).to.have.property('message', 'Request body is missing required fields')
    })

    it('should return incidents filtered by country', async () => {
        const res = await chai.request(app)
            .post('/api/incident/Britian')

        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')
    })
    
    context('post new incident', async () => {
        it('should post a new incident and return an object of saved incident', async () => {
            const incident = {
                "client_id": 9012,
                "incident_desc": "Fire outbreak in apartment 201, London Street",
                "city": "London",
                "country": "Britian"
            }
            const res = await chai.request(app)
                .post('/api/incident')
                .send(incident)
    
            expect(res).to.have.status(201)
            expect(res.body).to.be.an('object')
            expect(res.body).to.have.property('id')
            expect(res.body).to.have.property('client_id')
            expect(res.body).to.have.property('incident_desc')
            expect(res.body).to.have.property('city')
            expect(res.body).to.have.property('country')
            expect(res.body).to.have.property('date')
            expect(res.body).to.have.property('weather_report')
            
        })
    })
    
    context('post an already reported incident', async () => {
        
        it('should try to post a new incident and return an error msg "Incident already reported"', async () => {
            const incident = {
                "client_id": 9012,
                "incident_desc": "Fire outbreak in apartment 201, London Street",
                "city": "London",
                "country": "Britian"
            }
            const res = await chai.request(app)
                .post('/api/incident')
                .send(incident)
    
            expect(res).to.have.status(409)
            expect(res.body).to.be.an('object')
            expect(res.body.message).to.be.eq('Incident already reported')
        })
    })
})