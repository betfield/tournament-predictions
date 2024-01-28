import { Points } from '../../imports/data/collections'

// Publish all users' points
Meteor.publish('points', function () {
	let self = this;
	let userId = this.userId;
	
	if (userId) {
		let subHandle = Points.find({}, {fields: {"user.email": 0, "user.name": 0}}).observeChanges({
			added: function(id, fields) {
				self.added("points", id, fields);
			},
			changed: function(id, fields) {
				self.changed("points", id, fields);
			},
			removed: function(id) {
				self.removed("points", id);
			}
		});

		self.onStop(function () {
			subHandle.stop();
		});
	}

	self.ready();
});

// Publish all current user's points
Meteor.publish('userPoints', function () {
	let self = this;
	let userId = this.userId;
	
	if (userId) {
		let subHandle = Points.find({"user._id": userId}).observeChanges({
			added: function(id, fields) {
				self.added("points", id, fields);
			},
			changed: function(id, fields) {
				self.changed("points", id, fields);
			},
			removed: function(id) {
				self.removed("points", id);
			}
		});

		self.onStop(function () {
			subHandle.stop();
		});
	}

	self.ready();
});
