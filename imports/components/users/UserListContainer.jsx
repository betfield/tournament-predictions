import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import UserList from './UserList';

export default UserListContainer = withTracker(() => {
    const usersHandle = Meteor.subscribe('allUsers');
    const users = Meteor.users.find({}).fetch();

    return {
        usersHandle,
        users
    };
})(UserList);