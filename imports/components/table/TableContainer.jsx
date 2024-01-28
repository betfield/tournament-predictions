import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import UserPointsTable from './UserPointsTable';

export default TableContainer = withTracker(() => {
    const pointsHandle = Meteor.subscribe('points');
    const ready = pointsHandle.ready();
    const points = Points.find({}).fetch();

    return {
        ready,
        points
    };
})(UserPointsTable);