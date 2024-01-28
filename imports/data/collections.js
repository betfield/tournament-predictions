// Collection containing all competitions
Fixtures = new Mongo.Collection("fixtures");

// Collection containing all predictions
Predictions = new Mongo.Collection("predictions");

// Collection containing user points
Points = new Mongo.Collection("points");

export { Fixtures, Predictions, Points };
