import { Predictions } from '../../imports/data/collections'

// Publish current user's predictions
Meteor.publish('predictions', function () {
	let self = this;
	let userId = this.userId;
	
	if (userId) {
		var subHandle = Predictions.find({"userId": userId}).observeChanges({
			added: function(id, fields) {
				self.added("predictions", id, fields);
			},
			changed: function(id, fields) {
				self.changed("predictions", id, fields);
			},
			removed: function(id) {
				self.removed("predictions", id);
			}
		});

		self.onStop(function () {
			subHandle.stop();
		});
	}

	self.ready();
});

// Publish specific user's predictions
Meteor.publish('userPredictions', function () {
	let self = this;
	let loggedInUserId = this.userId;

	if (Roles.userIsInRole(loggedInUserId, ['Administraator']) && Meteor.settings.public.RESULT_USER_ID !== "") {
		serverLog("userPredictions method publish, user ID: " + Meteor.settings.public.RESULT_USER_ID);
		
		var subHandle = Predictions.find({"userId": Meteor.settings.public.RESULT_USER_ID}).observeChanges({
			added: function(id, fields) {
				self.added("predictions", id, fields);
			},
			changed: function(id, fields) {
				self.changed("predictions", id, fields);
			},
			removed: function(id) {
				self.removed("predictions", id);
			}
		});

		self.onStop(function () {
			subHandle.stop();
		});
	}

	self.ready();
});

// Publish all predictions for current fixture
Meteor.publish('fixturePredictions', function (fixtureId) {
	let self = this;
	let userId = this.userId;
	
	check(fixtureId, String);

	// Return result only if user is logged in and fixture is locked for editing
	// TODO: Remove unregistered (inactive) user results
	if (userId && fixtureIsLocked(fixtureId)) {
		let subHandle = Predictions.find({"fixture._id": fixtureId}).observeChanges({
			added: function(id, fields) {
				self.added("predictions", id, fields);
			},
			changed: function(id, fields) {
				self.changed("predictions", id, fields);
			},
			removed: function(id) {
				self.removed("predictions", id);
			}
		});

		self.onStop(function () {
			subHandle.stop();
		});
	}

	self.ready();
});

// Publish all predictions for current fixture
Meteor.publish('userActiveRoundPredictions', function (selectedUserId) {
	let self = this;
	let userId = this.userId;
	
	// Return result only if user is logged in
	if (userId) {

		// Get current matchday number
		const md = Meteor.call("getActiveMatchday");

		// Get all matchday fixtures
		const roundFixtures = Fixtures.find({"locked": true, "round": md.round-1}).fetch();

		// Extract all fixture id-s to array
		let fixtures = [];
		roundFixtures.forEach(f => {
			fixtures.push(f._id);
		})
		
		let subHandle = Predictions.find({"userId": selectedUserId, "fixture._id": { $in: fixtures }}).observeChanges({
			added: function(id, fields) {
				self.added("predictions", id, fields);
			},
			changed: function(id, fields) {
				self.changed("predictions", id, fields);
			},
			removed: function(id) {
				self.removed("predictions", id);
			}
		});

		self.onStop(function () {
			subHandle.stop();
		});
	}

	self.ready();
});

// Publish status info for all fixtures' locked state
Meteor.publish('fixtureLockedStatuses', function () {
	let self = this;
	let subHandle = Fixtures.find({}, {fields: {"_id": 1, "locked": 1}}).observeChanges({
		added: function(id, fields) {
			self.added("predictions", id, fields);
		},
		changed: function(id, fields) {
			self.changed("predictions", id, fields);
		},
		removed: function(id) {
			self.removed("predictions", id);
		}
	});

	self.ready();
	
	self.onStop(function () {
		subHandle.stop();
	});
});

fixtureIsLocked = (fixtureId) => {
	return Fixtures.findOne({"_id": fixtureId}, {fields: {"locked": 1}}).locked;
}