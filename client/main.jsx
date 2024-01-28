import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { App } from '../imports/Routes';
import '@fortawesome/fontawesome-free'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

Meteor.startup(() => {

  window.onerror = function (msg, url, lineNo, columnNo, error) {
    try {
      // Send unhandled exception to Loggly
      Logger.error({
        "message": msg, 
        "error": error.stack
      });

      // Report error also to server
      Meteor.call("clientErrorUnhandled", msg, Meteor.userId(), error );
    } catch (e) {
      console.error(e);
    }
    
    return false;
  }

  render(<App/>, document.getElementById('app'));
});
