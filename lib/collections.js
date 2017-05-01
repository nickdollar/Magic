Events = new Mongo.Collection("Events");
DecksData = new Mongo.Collection("DecksData");
DecksNames = new Mongo.Collection("DecksNames");
DecksArchetypes = new Mongo.Collection("DecksArchetypes");
DecksNamesPlaylists = new Mongo.Collection("DecksNamesPlaylists");
Images = new FS.Collection("Images", {
    stores: [new FS.Store.FileSystem("Images")]
});
DecksDataUniqueWithoutQty = new Mongo.Collection("DecksDataUniqueWithoutQuantity");
Meta = new Mongo.Collection("Meta");
MetaCards = new Mongo.Collection("MetaCards");
MetaLastAddition = new Mongo.Collection("MetaLastAddition");
MetaLastDayAddition = new Mongo.Collection("MetaLastDayAddition");
EventsCalendar = new Mongo.Collection("EventsCalendar");
CardsFullData = new Mongo.Collection('CardsFullData');
LGS = new Mongo.Collection('LGS');
LGSEvents = new Mongo.Collection('LGSEvents');
ZipCodes = new Mongo.Collection('ZipCodes');
Formats = new Mongo.Collection('Formats');
MTGSets = new Mongo.Collection("MTGSets");
UsersCollection = new Mongo.Collection("UsersCollection");
UsersDecks = new Mongo.Collection("UsersDecks");
TCGPlayerCards = new Mongo.Collection("TCGPlayerCards");
TCGPlayerCardsFullData = new Mongo.Collection("TCGPlayerCardsFullData");
TCGPlayerCardsDailyPrices = new Mongo.Collection("TCGPlayerCardsDailyPrices");
EventsTypes = new Mongo.Collection("EventsTypes");
Errors = new Mongo.Collection("Errors");
Cards = new Mongo.Collection("Cards");
Sets = new Mongo.Collection("Sets");
Gatherer = new Mongo.Collection("Gatherer");
TCGSets = new Mongo.Collection("TCGSets");
TCGCards = new Mongo.Collection("TCGCards");
SCGCards = new Mongo.Collection("SCGCards");
AllCards = new Mongo.Collection("AllCards");
Temp = new Mongo.Collection("Temp");
TokensList = new Mongo.Collection("TokensList");
EmblemsList = new Mongo.Collection("EmblemsList");
CardsSimple = new Mongo.Collection("CardsSimple");


