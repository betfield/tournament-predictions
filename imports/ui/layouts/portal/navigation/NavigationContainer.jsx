import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Navigation from './Navigation';

export default NavigationContainer = withTracker(() => {
  const usersHandle = Meteor.subscribe('currentUser');
  const ready = usersHandle.ready();

  const pointsHandle = Meteor.subscribe('userPoints');
  const pointsReady = pointsHandle.ready();

  const currentUser = Meteor.user();

  return {
    ready,
    currentUser,
    pointsReady
  };
})(Navigation);
