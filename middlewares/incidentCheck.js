//importing modules
const express = require("express");
const db = require("../models");
//Assigning db.users to User variable
const Incident = db.incidents;

//Function to check if username or email already exist in the database
//this is to avoid having two users with the same username and email
const incidentReported = async (req, res, next) => {
    //search the database to see if user exist
    try {
		const {client_id, incident_desc, city, country} = req.body;

      if (!client_id || !incident_desc || !city || !country) 
        return res.status(400).send({'message':'Request body is missing required fields'})

        const incident = await Incident.findOne({
            where: {
				client_id: client_id,
				incident_desc: incident_desc,
				city: city,
				country: country,
    	    },
		});
		//if username exist in the database respond with a status of 409
		if (incident) {
	    	return res.status(409).send({"message": "Incident already reported"});
		}

		//checking if email already exist
		// const emailcheck = await User.findOne({
		// 	where: {
		// 		email: req.body.email,	
		// 	},
		// });

		//if email exist in the database respond with a status of 409
		// if (emailcheck) {
		// 	return res.join(409).send("Authentication failed");
		// }

		next();
    } catch (error) {
		console.log(error);
    }
};

//exporting module
module.exports = {
    incidentReported,
};
