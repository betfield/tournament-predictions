Meteor.methods({
	updateUserPredictions: function(fixture,homeScore,awayScore) {
		check( fixture, String );
		check( homeScore, String );
		check( awayScore, String );
		
		// Current logged in user id
		const userId = this.userId;
		
		// Check if logged in as admin and update the actual fixture result if so
		// TODO: Is the error on updateAllUsersPredictionPoints reaching somewhere meaningful?
		if (Roles.userIsInRole(userId, ['Administraator'])) {

			// If no specific user ID provided then update actual result
			if (Meteor.settings.public.RESULT_USER_ID === "") {
				if (!isNaN(parseInt(homeScore)) && !isNaN(parseInt(awayScore))) {
					Fixtures.update({"_id": fixture}, {$set: {"result.home_goals": homeScore, "result.away_goals": awayScore, "status": "FT"}});
					return Meteor.call("updateAllUsersPredictionPointsForFixture", fixture, function(error, result){
						if (error) {
							throw new Meteor.Error("update-points-failed", "Update of points failed for user: " + userId);
						} 
					});
				}
				return;
				// If specific user ID provided then update prediction for that user
			} else {
				Predictions.update({"userId": Meteor.settings.public.RESULT_USER_ID, "fixture._id": fixture}, {$set: {"fixture.result.home_goals": homeScore, "fixture.result.away_goals": awayScore}});
				return Meteor.call("updateAllUsersPredictionPointsForFixture", fixture, function(error, result){
					if (error) {
						throw new Meteor.Error("update-points-failed", "Update of points failed for user: " + userId);
					} 
				});
			}
		} else { // If not admin, update user's prediction result
			
			//Check if fixture is locked and only update prediction if not
			const locked = Fixtures.findOne({"_id": fixture}, {fields: {"locked": 1}}).locked;
		
			if (!locked) {
				return Predictions.update({"userId": userId, "fixture._id": fixture}, {$set: {"fixture.result.home_goals": homeScore, "fixture.result.away_goals": awayScore}});
			} else {
				throw new Meteor.Error("fixture-locked", "Fixture " + fixture + " locked! Cannot update prediction for user " + userId);
			}
		}
	}
});	