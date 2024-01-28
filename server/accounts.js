import { isRegisterEnd } from './helpers/fixtures'
import { Fixtures } from '../imports/data/collections';
import sendEmail from './helpers/sendMail';

// Define all available user roles
UserRoles = {
	admin: 'Administraator',
	regular: 'Aktiveerimata',
	registered: 'Aktiveeritud',
	deleted: 'Kustutatud'
};

// Add user roles to database
Roles.createRole(UserRoles.admin, {unlessExists: true});
Roles.createRole(UserRoles.regular, {unlessExists: true});
Roles.createRole(UserRoles.registered, {unlessExists: true});
Roles.createRole(UserRoles.deleted, {unlessExists: true});

// Add roles after initial user creation
// Requires matb33:collection-hooks

/*
	Changes to default Meteor behavior:
	1) User entries in the Meteor.users collection gain a new field named roles corresponding to the user's roles. †
	2) A new collection Meteor.roles contains a global list of defined role names. ††
	3) The currently logged-in user's roles field is automatically published to the client.
*/

Meteor.users.after.insert((userId, doc) => {
	try {
		if (doc.userProfile.email == Meteor.settings.private.BF_EMAIL) {
			Roles.addUsersToRoles(doc._id, [UserRoles.admin]);
			serverLog("Admin user created with id:" + doc._id);
		} else {
			Roles.addUsersToRoles(doc._id, [UserRoles.regular]);
			serverLog("Regular user created with id:" + doc._id);

			sendEmail(doc.userProfile.email,
				null,
				'MM2022 ennustus',
				'Tere tulemast! Oled edukalt süsteemi registreeritud. Järgmise sammuna, palun aktiveeri oma ennustus vastavalt juhendile, mille võid leida siit: https://mm.fctwister.ee/activate.',
			);
		}
	} catch (e) {
		serverError("Error adding roles to user: " + userId, e);
	}
	
});

Accounts.onCreateUser((options, user) => {
	let service = user.services;
	let userProfile;
	
	if (isRegisterEnd()) {
		throw new Meteor.Error("register-ended", "Registreerimine lõppenud");
	} else if (service.google) {
		userProfile = {
			picture: service.google.picture,
			email: service.google.email,
			name: service.google.name
		};
		serverLog("Google profile added for: " + user._id);
	} 	
	// set default team name to social network user name
	userProfile["team"] = userProfile.name;
	
	// append profile to Meteor user
	user.userProfile = userProfile;
	
	if (user.userProfile.email != Meteor.settings.private.BF_EMAIL) {
		// Create prediction fields for new user
		createUserPredictions(user);
		serverLog("Prediction data added for user: " + user._id);
	}
	return user;
});

// Disable login of new and deleted users after register end
Accounts.validateLoginAttempt(function (options) {
	if (isRegisterEnd()) {
		const user = options.user;
		
		if (!user || Roles.userIsInRole(user, 'Kustutatud')) {
			throw new Meteor.Error("register-ended", "Registreerimine lõppenud");
		}
	}
	return true;
});

createUserPredictions = ( user ) => {
	let fixtures = Fixtures.find({}, {fields: {"_id": 1}}).fetch();
	let profile = user.userProfile;

	return fixtures.forEach(fixture => {
		fixture["userPoints"] = 0;
		fixture["result"] = { 
			home_goals: "", 
			away_goals: "" 
		}

		const prediction = {
			"userId": user._id,
			"user": {
				team: profile.team,
                picture: profile.picture,
                name: profile.name,
			}, 
			"fixture": fixture
		};
		
		Predictions.insert( prediction );
	});
}