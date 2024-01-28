import React from 'react';

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import LandingPage from './ui/pages/LandingPage';
import RulesPage from './ui/pages/RulesPage';
import PredictionsPage from './ui/pages/PredictionsPage';
import FixturesPage from './ui/pages/FixturesPage';
import FixturePredictionsPage from './ui/pages/FixturePredictionsPage';
import UserPredictionsPage from './ui/pages/UserPredictionsPage';
import CalendarPage from './ui/pages/CalendarPage';
import TablePage from './ui/pages/TablePage';
import LoginPage from './ui/pages/LoginPage';
import ActivatePage from './ui/pages/ActivatePage';
import UsersPage from './ui/pages/UsersPage';

getRoutes = () => 
{
    if (Meteor.settings.public.env === "Preview") {
        return (
            <Router>
                <Routes>
                    <Route exact path="/" element={<LandingPage />}/>
                    <Route exact path="/rules" element={<RulesPage />}/>
                    <Route exact path="/calendar" element={<CalendarPage />}/>
                </Routes>
            </Router>
        )
    } else {
        return (
            <Router>
                <Routes>
                    <Route exact path="/" element={<LandingPage />}/>
                    <Route exact path="/rules" element={<RulesPage />}/>
                    <Route exact path="/portal" element={ <PredictionsPage /> } />
                    <Route exact path="/predictions" element={ <PredictionsPage /> } />
                    <Route exact path="/fixtures" element={ <FixturesPage /> } />
                    <Route exact path="/calendar" element={ <CalendarPage /> } />
                    <Route exact path="/table" element={ <TablePage /> } />
                    <Route exact path="/login" element={ <LoginPage /> } />
                    <Route exact path="/logout" element={<LoginPage logout={true} /> } />
                    <Route exact path="/activate" element={ <ActivatePage /> } />
                    <Route exact path="/users" element={ <UsersPage /> } />
                    <Route path="/fixtures/:fixtureId" element={ <FixturePredictionsPage /> } />
                    <Route path="/predictions/:userId" element={ <UserPredictionsPage /> } />
                </Routes>
            </Router>
        )
    }
}

export const App = () => (
    getRoutes()    
);
