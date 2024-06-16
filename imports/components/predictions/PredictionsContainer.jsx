import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PredictionList from './PredictionList';
import '../../data/collections';

export default PredictionsContainer = withTracker(() => {
    let predictionsHandle;
    
    if (Roles.userIsInRole(Meteor.userId(), ['Administraator']) && Meteor.settings.public.RESULT_USER_ID !== "") {
        const msg = 'Administrator logged in, user ID selected';
        Meteor.call("clientLog", msg + ": " + Meteor.settings.public.RESULT_USER_ID, Meteor.userId());
        predictionsHandle = Meteor.subscribe('userPredictions');
    } else {
        predictionsHandle = Meteor.subscribe('predictions');
    }
    
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