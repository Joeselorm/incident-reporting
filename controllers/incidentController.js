const db = require("../models");
const needle = require('needle')

const API_BASE_URL = process.env.API_BASE_URL
const API_KEY_NAME = process.env.API_KEY_NAME
const API_KEY_VALUE = process.env.API_KEY_VALUE

const Op = db.Sequelize.Op;
const Incident = db.incidents;

const reportincident = async (req, res) => {
  try {
    const {client_id, incident_desc, city, country} = req.body;
      
    const params = new URLSearchParams({
      [API_KEY_NAME]: API_KEY_VALUE,
      "q": city,
    })

    const weather = await needle('get', `${API_BASE_URL}?${params}`)
    const weather_data = weather.body
      
    const data = {
      client_id,
      incident_desc,
      city,
      country,
      date: new Date(),
      weather_report: weather_data,
    };

    // Save data (incident)
    const incident = await Incident.create(data);

    if (incident) {
      console.log("data", data);

      // return saved data
      return res.status(201).send(incident);
    } else {
      return res.status(409).send({"message":"Incident not saved, try agian!"});
    }
  } catch (error) {
    console.log(error);
  }
};

const filterincident = async (req, res) => {
  try {
      const { city, min_temp, max_temp, min_humidity, max_humidity } = req.query;

    const query = {
      where: {},
    };
    if (city) {
      query.where['city'] = city;
    }
    if (min_temp && max_temp) {
      query.where['weather_report.main.temp'] = { [Op.between]: [min_temp, max_temp] };
    } else if (min_temp) {
      query.where['weather_report.main.temp'] = { [Op.gte]: min_temp };
    } else if (max_temp) {
      query.where['weather_report.main.temp'] = { [Op.lte]: max_temp };
    }
    if (min_humidity && max_humidity) {
      query.where['weather_report.main.humidity'] = { [Op.between]: [min_humidity, max_humidity] };
    } else if (min_humidity) {
      query.where['weather_report.main.humidity'] = { [Op.gte]: min_humidity };
    } else if (max_humidity) {
      query.where['weather_report.main.humidity'] = { [Op.lte]: max_humidity };
    }

    const response = await Incident.findAll(query);

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error was encountered while fetching weather data.');
  }
};

const listincident = async (req, res) => {
  try {
    const incidents = await Incident.findAll();

  if (incidents) {
    return res.status(200).send(incidents);
  } else {
    return res.status(401).send("No incidence found");
  }	
  } catch (error) {
    console.log(error);
  }
};

const listincidentbasedoncountry = async (req, res) => {
    try {
		// fitler by country
        const incidents = await Incident.findAll({
            where: {
                country: req.params.country
            }
        });

		if (incidents) {
            return res.status(200).send(incidents);
		} else {
			return res.status(401).send("No incidence found");
		}	
    } catch (error) {
		console.log(error);
    }
};

module.exports = {
	reportincident,
	listincident,
    filterincident,
    listincidentbasedoncountry
};