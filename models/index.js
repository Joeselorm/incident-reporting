//inporting modules
const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize(`postgres://postgres:root@localhost:5432/incidentreport`, {dialect: "postgres"})
// const sequelize = new Sequelize("incidentreport", "postgres", "root", {dialect: "postgres", host: "localhost"})

//checking if connection is done
sequelize.authenticate().then(() => {
    console.log(`Database connected to incidentreport`)
}).catch(err => {
    console.log(err)
})

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

//connecting to model
db.users = require('./userModel') (sequelize, DataTypes)
db.incidents = require('./incidentModel') (sequelize, DataTypes)

//exporting the module
module.exports = db
