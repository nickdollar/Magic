Events = new Mongo.Collection("Events");
DecksData = new Mongo.Collection("DecksData");
DecksArchetypes = new Mongo.Collection("DecksArchetypes");
Images = new FS.Collection("Images", {
    stores: [new FS.Store.FileSystem("Images")]
});
DecksDataUniqueWithoutQty = new Mongo.Collection("DecksDataUniqueWithoutQuantity");
Meta = new Mongo.Collection("Meta");
MetaCards = new Mongo.Collection("MetaCards");
MetaLastAddition = new Mongo.Collection("MetaLastAddition");
MetaLastDaysAdditions = new Mongo.Collection("MetaLastDaysAdditions");
EventsCalendar = new Mongo.Collection("EventsCalendar");
LGS = new Mongo.Collection('LGS');
LGSEvents = new Mongo.Collection('LGSEvents');
ZipCodes = new Mongo.Collection('ZipCodes');
Formats = new Mongo.Collection('Formats');
UsersCollection = new Mongo.Collection("UsersCollection");
UsersDecks = new Mongo.Collection("UsersDecks");
EventsTypes = new Mongo.Collection("EventsTypes");
Errors = new Mongo.Collection("Errors");
Cards = new Mongo.Collection("Cards");
Sets = new Mongo.Collection("Sets");
Gatherer = new Mongo.Collection("Gatherer");
AllCards = new Mongo.Collection("AllCards");
Temp = new Mongo.Collection("Temp");
TokensList = new Mongo.Collection("TokensList");
EmblemsList = new Mongo.Collection("EmblemsList");
CardsSimple = new Mongo.Collection("CardsSimple");
TCGPrices = new Mongo.Collection("TCGPrices");
CardsUnique = new Mongo.Collection("CardsUnique");



