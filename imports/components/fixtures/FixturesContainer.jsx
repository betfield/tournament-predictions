import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import FixturesList from './FixturesList';

export default FixturesContainer = withTracker(( {fixtureId} ) => {
    const fixturesHandle = Meteor.subscribe('currentMatchdayFixtures');
    const fixtures = Fixtures.find({}).fetch();

    return {
        fixtures
    };
})(FixturesList);