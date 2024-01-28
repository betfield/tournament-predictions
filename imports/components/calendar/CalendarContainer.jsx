import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Calendar from './Calendar';
import '../../data/collections';

export default CalendarContainer = withTracker(() => {
    const fixturesHandle = Meteor.subscribe('fixtures');
    const fixtures = Fixtures.find({}).fetch();

    return {
        fixturesHandle,
        fixtures
    };
})(Calendar);