import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import UserRoundPredictions from './UserRoundPredictions';

export default UserPredictionsContainer = withTracker(( {userId} ) => {
    const predictionsHandle = Meteor.subscribe('userActiveRoundPredictions', userId);
    const fixtureHandle = Meteor.subscribe('currentMatchdayFixtures');
    const userHandle = Meteor.subscribe('specificUser', userId);

    const fixturesReady = fixtureHandle.ready();
    const predictionsReady = predictionsHandle.ready();
    const userReady = userHandle.ready();

    const predictions = Predictions.find({"userId": userId}).fetch();
    const roundFixtures = Fixtures.find({}).fetch();
    const user = Meteor.users.findOne({"_id": userId});

    return {
        roundFixtures,
        fixturesReady,
        userReady,
        predictionsReady,
        predictions,
        user
    };
})(UserRoundPredictions);