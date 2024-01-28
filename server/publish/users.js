// Get current user object
Meteor.publish('currentUser', function () {
	let self = this;
    
    //Delay the publication to test loading spinner
    //Meteor._sleepForMs(2000);
    let userId = this.userId;
	
	if (userId) {
        let subHandle = Meteor.users.find({"_id": userId}, 
            { 
                fields: {  
                    "userProfile.team": 1,
                    "userProfile.picture": 1,
                    "userProfile.name": 1
                }
            } 
        ).observeChanges({
            added: function(id, fields) {
                self.added("users", id, fields);
            },
            changed: function(id, fields) {
                self.changed("users", id, fields);
            },
            removed: function(id) {
                self.removed("users", id);
            }
        });

        self.onStop(function () {
            subHandle.stop();
        });
    }
    
    self.ready();
});

Meteor.publish('allUsers', function () {
    let self = this;

    if (Roles.userIsInRole(this.userId, ["Administraator"])) {

        let subHandle = Meteor.users.find({}, 
            { 
                fields: {  
                    "userProfile.team": 1,
                    "userProfile.picture": 1,
                    "userProfile.name": 1,
                    "userProfile.email": 1
                }
            } 
        ).observeChanges({
            added: function(id, fields) {
                self.added("users", id, fields);
            },
            changed: function(id, fields) {
                self.changed("users", id, fields);
            },
            removed: function(id) {
                self.removed("users", id);
            }
        });

        self.onStop(function () {
            subHandle.stop();
        });
    } 

    self.ready();
});

Meteor.publish('registeredUsers', function () {
    let self = this;

    if (Roles.userIsInRole(this.userId, ["Aktiveeritud"])) {

        
        // Find all registered user objects from the roles table
        const users = Roles.getUsersInRole('Aktiveeritud').fetch();
    
        // Create an array with each user id included
        let newUsers = [];
        
        users.forEach(user => {
            newUsers.push(user._id);
        })
        
        // Return a handle with all user objects that match the id-s in the array
        let subHandle = Meteor.users.find({"_id": { $in: newUsers }},
            { 
                fields: {
                    "_id": 1,  
                    "userProfile.team": 1,
                    "userProfile.picture": 1,
                    "userProfile.name": 1
                }
            } 
        ).observeChanges({
            added: function(id, fields) {
                self.added("users", id, fields);
            },
            changed: function(id, fields) {
                self.changed("users", id, fields);
            },
            removed: function(id) {
                self.removed("users", id);
            }
        });

        self.onStop(function () {
            subHandle.stop();
        });
    } 

    self.ready();
});

// Get specific user object
Meteor.publish('specificUser', function (id) {
	let self = this;
    let userId = this.userId;
	
	if (userId) {
        let subHandle = Meteor.users.find({"_id": id}, 
            { 
                fields: {  
                    "userProfile.team": 1,
                    "userProfile.picture": 1,
                    "userProfile.name": 1
                }
            } 
        ).observeChanges({
            added: function(id, fields) {
                self.added("users", id, fields);
            },
            changed: function(id, fields) {
                self.changed("users", id, fields);
            },
            removed: function(id) {
                self.removed("users", id);
            }
        });

        self.onStop(function () {
            subHandle.stop();
        });
    }
    
    self.ready();
});

Meteor.publish(null, function () {
    if (this.userId) {
        if (Roles.userIsInRole(this.userId, ["Administraator"])) {
            return Meteor.roleAssignment.find();
        } else return Meteor.roleAssignment.find({ 'user._id': this.userId });
    } else {
        this.ready()
    }
})

// Deny all client-side updates to user documents
Meteor.users.deny({
    update() { return true; }
});