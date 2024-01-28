Meteor.methods({
    registeredUsersCount: () => {
        return Roles.getUsersInRole('Aktiveeritud').count();
    }
});