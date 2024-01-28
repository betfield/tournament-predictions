import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PredictionList from './PredictionList';
import '../../data/collections';

export default PredictionsContainer = withTracker(() => {
    const predictionsHandle = Meteor.subscribe('predictions');
    const predictionsReady = predictionsHandle.ready();
    const predictions = Predictions.find({}).fetch();

    const fixturesHandle = Meteor.subscribe('fixtures');
    const fixturesReady = fixturesHandle.ready();
    const fixtures = Fixtures.find({}).fetch();

    return {
        predictionsReady,
        predictions,
        fixturesReady,
        fixtures
    };
})(PredictionList);