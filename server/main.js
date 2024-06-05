import { Meteor } from 'meteor/meteor';
import { logger } from './helpers/logger';
import decimalToRoman from './helpers/roman';
import { isRegisterEnd } from './helpers/fixtures';
import { fixtures } from '../imports/data/fixtures';

import './config';
import './accounts';

import '../server/publish/users';
import '../server/publish/fixtures';
import '../server/publish/points';
import '../server/publish/predictions';

import './methods/fixtures';
import './methods/logger';
import './methods/mail';
import './methods/points';
import './methods/predictions';
import './methods/users';


/**
 * Improvements / Suggestions
 * 
 * 1) Implement TODO items listed in code
 * 2) Add info about app usage (e.g. how to view other peoples predictions) and reminder about entering scores (not to leave fields blank) 
 * 3) Add automatic email reminders 1 day before round and register end dates
 * 4) Add statistics per fixture (how many people predicted same score) and include prediction?
 * 5) Implement message board
 * ...
 *  
 */


Meteor.startup(() => {
  process.env.MAIL_URL = Meteor.settings.private.MAIL_URL;

	//Define logger object
	Log = logger;
	serverLog("Mongo url: " + process.env.MONGO_URL);
	serverLog("MAIL url: " + process.env.MAIL_URL);
	
	//Define array for storing matchday locked statuses
	FixturesLocked = [];

  if (Fixtures.find({competition:'euro2024'}).count() === 0 ){
		fixtures.forEach(function(fixture){
			let f = {
				competition:fixture.competition,
				day:fixture.day,
				date:fixture.date,
				time:fixture.time,
				ts:fixture.ts,
				home_team:fixture.home_team,
				away_team:fixture.away_team,
				stadium:fixture.stadium,
				city:fixture.city,
				group:fixture.group,
				round:fixture.round,
				roundRoman: decimalToRoman(fixture.round),
				result: {
					home_goals: "",
					away_goals: ""
				},
				status: "NS",
				locked: false
			}

			//Add team flag image locations
			f.home_team.imgSrc = getFlagImage(f.home_team.code);
			f.away_team.imgSrc = getFlagImage(f.away_team.code);

			Fixtures.insert(f);
		}); // end of foreach Fixtures
		
		serverLog("Startup Fixtures: " + Fixtures.find().count());
	
	} // end of if

	Meteor.setInterval(() => {
		Meteor.call("updateFixtureLockedStatuses");
		// TODO: remove automatic process for next time and only delete users manually to avoid issues with late arrivals
		checkRegisterStatus(isRegisterEnd());
	}, 60 * 1000);

});

//TODO: ImgSrc to be updated automatically on KO teams
getFlagImage = (teamCode) => {
	return Meteor.settings.public.FOLDER_FLAGS + String(teamCode).toLowerCase() + ".png";
}

checkRegisterStatus = (isRegisterEnd) => {
	if (isRegisterEnd) {
		serverLog("Register ended. Running check for unregistered users");
		// Get list of all inactive users
		const users = Roles.getUsersInRole('Aktiveerimata').fetch();

		if (users.length > 0) {
			serverLog("Starting to remove unregistered users");
			serverLog("Unregistered users: ");
			serverLog(users);

			// Add deleted status to all inactive users...
			Roles.addUsersToRoles(users, 'Kustutatud');

			// ...and remove inactive role for these
			Roles.removeUsersFromRoles(users, 'Aktiveerimata');

			// Delete all user predictions and login access tokens
			users.forEach(user => {
				Predictions.remove({"userId": user._id});
				serverLog("Predictions removed for user: " + user._id);

				Meteor.users.update({"_id": user._id}, { $set: { "services": {} }});
				serverLog("Removed login service for user with id: " + user._id);
			});

			serverLog("Unregistered users removed. Count: " + users.length);
		} else {
			serverLog("Check completed. Unregistered users count: " + users.length);
		}
	}
}