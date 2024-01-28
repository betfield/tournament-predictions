import {firstRoundFixtureDates, getActiveMatchday, orderByDate, isRegisterEnd} from '../helpers/fixtures'
import { Fixtures } from '../../imports/data/collections';
import decimalToRoman from '../helpers/roman';
import sendEmail from '../helpers/sendMail';

Meteor.methods({
    getFirstRoundFixtureDates: () => {
        return firstRoundFixtureDates;
    },
    getActiveMatchday: () => {
        return getActiveMatchday();
	},
	getActiveMatchdayRoman: () => {
		const round = getActiveMatchday().round;

		// If matchday 1 then return current round, otherwise return previous round to default to relevant predictions
		if (round <= 1) {
			return decimalToRoman(round);
		} else {
			return decimalToRoman(round - 1);
		}
	},
	getPreviousMatchday: () => {
		const md = getActiveMatchday().round;
		
		if (md > 1) {
			return firstRoundFixtureDates[md-2];
		} 
	},
	isRegisterEnd: () => {
		return isRegisterEnd();
	},
    updateFixtureLockedStatuses: function() {
		const md = getActiveMatchday();
		let currentDate = new Date();

		if (Meteor.settings.public.INVALID_TEST_TIME !== "") {
			currentDate = new Date(Meteor.settings.public.INVALID_TEST_TIME);
		}
        
		serverLog("Current date: " + currentDate.toISOString());
		serverLog("Current matchday: " + md.round);
		serverLog("Current round deadline: " + md.ts);
		serverLog("FixturesLocked array:");
		serverLog(FixturesLocked.toString());
		
		let isFirstRun = false;

		if (FixturesLocked[1] === undefined) {
			isFirstRun = true;
		}

		firstRoundFixtureDates.forEach(fd => {
			if (fd.round < md.round) {
				if (!FixturesLocked[fd.round]) {
					serverLog("Running fixture lock update for round: " + fd.round);
					Fixtures.update({"round": fd.round}, {$set: {"locked": true}}, {multi: true});
					FixturesLocked[fd.round] = true;
					
					// Send round locked mail for all users, unless it is first run on startup
					if (!isFirstRun) {
						// Check if last round is locked and send email accordingly
						if (FixturesLocked[firstRoundFixtureDates.length - 1]) {
							sendRoundLockedMail(fd.round, null);
						} else {
							sendRoundLockedMail(fd.round, md.ts);
						}
					}
				}
			} else {
				FixturesLocked[fd.round] = false;
			}
		})
	},
	updateFixtureTeam: (fixtureId, team, isHome) => {
		const userId = Meteor.userId();

		// Only allow method to be called when logged in as admin
		if (Roles.userIsInRole(userId, ['Administraator'])) {
			if (isHome) {
				Fixtures.update({"_id": fixtureId}, {$set: { "home_team": team }});
			} else {
				Fixtures.update({"_id": fixtureId}, {$set: { "away_team": team }});
			}
			serverLog("Fixture " + fixtureId + " updated with team " + team.name + ", isHome: " + isHome);
		} else { // If not admin throw error
			serverLog("Fixture update not permitted as user not admin. Currently logged in user: " + userId);
			throw new Meteor.Error("not-permitted", "Fixture update not permitted as user not admin. Currently logged in user: " + userId);
		}
	}
});

sendRoundLockedMail = (closedRound, nextDate) => {
	// Get all registered users
	const users = Roles.getUsersInRole('Aktiveeritud').fetch();
	const to = 'FC Twister Admin <admin@fctwister.ee>';
	const subject = 'Ennustusvoor suletud';
	let text = decimalToRoman(closedRound) + ' ennustusvoor on nüüd suletud.';
	
	if (nextDate) {
		text += ' Järgmise ennustusvooru tähtaeg: ' + formatRoundDate(nextDate);
	}
	
	// Create an array with each user email included
	let userEmails = [];
        
	users.forEach(user => {
		userEmails.push(user.userProfile.email);
	})
	serverLog("Sending Round locked email to all registered users");
	
	sendEmail(to, userEmails, subject, text)
}

formatRoundDate = (roundDate) => {
	result = new Date(roundDate);
	const monthNames = ["jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"];
	// Add 3h to UTC time for Estonia TZ
	result.setMinutes(result.getMinutes() + Meteor.settings.private.UTC_MIN_OFFSET);
	
	return 	"" + 
		result.getUTCDate() + ". " + 
		monthNames[result.getUTCMonth()] + " kell " + 
		result.getUTCHours() + ":" + 
		(result.getUTCMinutes() < 10 ? '0' : '') + result.getUTCMinutes();
}
