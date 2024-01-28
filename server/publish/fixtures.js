import { Fixtures } from '../../imports/data/collections';

// Publish all fixtures from the local DB
Meteor.publish('fixtures', function () {
	var self = this;
	let userId = this.userId;
	
	if (userId) {
		var subHandle = Fixtures.find({}).observeChanges({
			added: function(id, fields) {
				self.added("fixtures", id, fields);
			},
			changed: function(id, fields) {
				self.changed("fixtures", id, fields);
			},
			removed: function(id) {
				self.removed("fixtures", id);
			}
		});

		self.onStop(function () {
			subHandle.stop();
		});
	}
	self.ready();
});

// Publish all fixtures with locked status
Meteor.publish('currentMatchdayFixtures', function () {
	var self = this;
	let userId = this.userId;
	
	// Get current matchday number
	const md = Meteor.call("getActiveMatchday");

	if (userId) {
		// Get all fixtures with locked status and round number from previous matchday
		var subHandle = Fixtures.find({"locked": true, "round": md.round-1}).observeChanges({
			added: function(id, fields) {
				self.added("fixtures", id, fields);
			},
			changed: function(id, fields) {
				self.changed("fixtures", id, fields);
			},
			removed: function(id) {
				self.removed("fixtures", id);
			}
		});

		self.onStop(function () {
			subHandle.stop();
		});
	}
		
	self.ready();
});
