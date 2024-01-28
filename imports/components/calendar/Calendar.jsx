import React, { Component } from 'react';

import Splash from '../loading/Splash';

import '../../../client/vendor/fullcalendar/fullcalendar';

export default class Calendar extends Component {

	getCalendarFixtures = () => {
		let tsStart, tsEnd;
		const fixtures = this.props.fixtures;
		const calendar_fixtures = [];

		if (fixtures.length !== 0) {
			fixtures.forEach(function (fixture){

				tsStart = new Date(fixture.ts);		
				tsEnd = new Date(fixture.ts);
				tsStart.setHours(tsStart.getHours());
				tsEnd.setHours(tsStart.getHours()+2); // set fixture end date 2h later than start
				
				let title;
				let score;
				
				if (fixture.result && fixture.result.home_goals && fixture.result.away_goals) {
					score = " (" + fixture.result.home_goals + ":" + fixture.result.away_goals + ")";
				} else {
					score = "";
				}

				if (fixture.home_team.name == null) {
					title = fixture.home_team + " vs " + fixture.away_team + score;
				} else {
					title = fixture.home_team.name + " vs " + fixture.away_team.name + score;
				}

				calendar_fixtures.push({
					id: fixture._id,
					title: title,
					start: tsStart,
					end: tsEnd,
					allDay: false,
					url: "fixtures/" + fixture._id
				});

			}); // end of for
		}

		return calendar_fixtures;
	}
	
	getFirstFixtureDate = (date) => {
		const today = new Date();
		
		if (date && date > today) {
			return date;
		} else {
			return today;
		}
	}

	componentDidUpdate() {

		if (this.props.fixturesHandle.ready()) {

			const calendar_fixtures = this.getCalendarFixtures();
			const firstFixtureDate = calendar_fixtures[0];
			let defaultView = 'agendaWeek';

			if ($(window).width() < 769) {
				defaultView = 'agendaDay';
			}


			$('#calendar').fullCalendar({
				schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
				header: {
					left: 'prev,next today',
					center: 'title',
					right: 'month,agendaWeek,agendaDay'
				},
				allDayDefault: false,
				views: {
					agendaWeek: {
						allDaySlot: false,
						slotLabelFormat: 'HH:mm',
						titleFormat: 'D MMMM YYYY',
						columnFormat: 'ddd D.MM'
					},
					agendaDay: {
						allDaySlot: false,
						slotLabelFormat: 'HH:mm',
						titleFormat: 'D MMMM YYYY'
					}
				},
				eventTextColor: 'white',
				editable: false,
				droppable: false, // this allows things to be dropped onto the calendar
				events: calendar_fixtures,
				minTime: '12:00:00',
				aspectRatio: 'auto', // ratio of width-to-height - larger numbers make smaller heights
				timeFormat: 'HH:mm', // uppercase H for 24-hour clock
				timezone: 'local',
				firstDay: 1,
				defaultDate: this.getFirstFixtureDate(firstFixtureDate.start),
				defaultView: defaultView,
				monthNames: [
						TAPi18n.__('month_jan'),
						TAPi18n.__('month_feb'),
						TAPi18n.__('month_mar'),
						TAPi18n.__('month_apr'),
						TAPi18n.__('month_may'),
						TAPi18n.__('month_jun'),
						TAPi18n.__('month_jul'),
						TAPi18n.__('month_aug'),
						TAPi18n.__('month_sep'),
						TAPi18n.__('month_oct'),
						TAPi18n.__('month_nov'),
						TAPi18n.__('month_dec')
				], 
				monthNamesShort: [
						TAPi18n.__('month_jan_s'),
						TAPi18n.__('month_feb_s'),
						TAPi18n.__('month_mar_s'),
						TAPi18n.__('month_apr_s'),
						TAPi18n.__('month_may_s'),
						TAPi18n.__('month_jun_s'),
						TAPi18n.__('month_jul_s'),
						TAPi18n.__('month_aug_s'),
						TAPi18n.__('month_sep_s'),
						TAPi18n.__('month_oct_s'),
						TAPi18n.__('month_nov_s'),
						TAPi18n.__('month_dec_s')
				], 
				dayNames: [
						TAPi18n.__('day_sun'),
						TAPi18n.__('day_mon'),
						TAPi18n.__('day_tue'),
						TAPi18n.__('day_wed'),
						TAPi18n.__('day_thu'),
						TAPi18n.__('day_fri'),
						TAPi18n.__('day_sat')
				], 
				dayNamesShort: [
						TAPi18n.__('day_sun_s'),
						TAPi18n.__('day_mon_s'),
						TAPi18n.__('day_tue_s'),
						TAPi18n.__('day_wed_s'),
						TAPi18n.__('day_thu_s'),
						TAPi18n.__('day_fri_s'),
						TAPi18n.__('day_sat_s')
				],
				buttonText: {
					today: TAPi18n.__('today'),
					month: TAPi18n.__('month'),
					week: TAPi18n.__('week'),
					day: TAPi18n.__('day')
				}
			});
		}
	}

	componentWillUnmount() {
		this.props.fixturesHandle.stop();
	}

    render() {
		if (this.props.fixturesHandle.ready()) {
			return (
				<div id="calendar"></div>
			)
		} else {
			return <Splash/>
		}
        
	}
}