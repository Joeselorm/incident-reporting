// Incident Model
module.exports = (sequelize, DataTypes) => {
    const Incident = sequelize.define( "incidents", {
        client_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        incident_desc: {
            type: DataTypes.STRING,
            allowNull: false
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        weather_report: {
            type: DataTypes.JSONB,
            allowNull: false,
        },
    }, {timestamps: true}, )
    return Incident
}
