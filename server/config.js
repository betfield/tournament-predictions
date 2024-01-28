ServiceConfiguration.configurations.remove({
	service:'google'
});

ServiceConfiguration.configurations.insert({
	service:'google',
	clientId:'964360777763-renqptfapvdduvmrul2dcved8usq0dq7.apps.googleusercontent.com',
  	secret: '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'
});

console.log("Google login configuration inserted");