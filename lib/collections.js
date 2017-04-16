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
CardsData = new Mongo.Collection('CardDatabase');
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
CardsCollectionSimplified = new Mongo.Collection("CardsCollectionSimplified");

