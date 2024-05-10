// Round end (actually start!) dates, e.g. dates for first fixture of each round -1h (in UTC)
const firstRoundFixtureDates = Meteor.settings.private.ROUND_END_DATES;

//Register end date (in UTC)
const registerEnd = Meteor.settings.private.REGISTER_END;

// Return the active matchday 
const getActiveMatchday = () => {

    let currentDate = new Date();
    
    if (Meteor.settings.public.INVALID_TEST_TIME !== "") {
        currentDate = new Date(Meteor.settings.public.INVALID_TEST_TIME);
    }

    let roundElem = { round: 0 };

    firstRoundFixtureDates.some(elem => {
        roundElem = elem;
        return currentDate.toISOString() < elem.ts
    });

    return roundElem;
}

// Return true in case register deadline has passed
const isRegisterEnd = () => {

    let currentDate = new Date();
    
    if (Meteor.settings.public.INVALID_TEST_TIME !== "") {
        currentDate = new Date(Meteor.settings.public.INVALID_TEST_TIME);
    }

    const registerDate = new Date(registerEnd)

    return registerDate.getTime() < currentDate.getTime();
}

orderByDate = (arr, dateProp) => {
    return arr.slice().sort(function (a, b) {
        return a[dateProp] < b[dateProp] ? -1 : 1;
    });
}

export { firstRoundFixtureDates, getActiveMatchday, isRegisterEnd, orderByDate }