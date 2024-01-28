import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import FixturePredictions from './FixturePredictions';

export default FixturesContainer = withTracker(( {fixtureId} ) => {
    const predictionsHandle = Meteor.subscribe('fixturePredictions', fixtureId);
    const fixtureHandle = Meteor.subscribe('fixtures');
    const usersHandle = Meteor.subscribe('registeredUsers');

    const fixturesReady = fixtureHandle.ready();
    const predictionsReady = predictionsHandle.ready();
    const usersReady = usersHandle.ready();

    const predictions = Predictions.find({"fixture._id": fixtureId}).fetch();
    const fixture = Fixtures.findOne({"_id": fixtureId});
    const users = Meteor.users.find({}).fetch();
    const allFixtures = Fixtures.find({}).fetch();

    return {
        fixture,
        allFixtures,
        fixturesReady,
        predictionsReady,
        predictions,
        users,
        usersReady
    };
})(FixturePredictions);