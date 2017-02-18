Events = new Mongo.Collection("Events");
DecksData = new Mongo.Collection("DecksData");
DecksNames = new Mongo.Collection("DecksNames");
DecksArchetypes = new Mongo.Collection("DecksArchetypes");
DecksNamesPlaylists = new Mongo.Collection("DecksNamesPlaylists");
Images = new FS.Collection("Images", {
    stores: [new FS.Store.FileSystem("Images")]
});
DecksDataUniqueWithQuantity = new Mongo.Collection("DecksDataUniqueWithQuantity");
DecksDataUniqueWithoutQuantity = new Mongo.Collection("DecksDataUniqueWithoutQuantity");
Meta = new Mongo.Collection("Meta");
MetaCards = new Mongo.Collection("MetaCards");
MetaNewest = new Mongo.Collection("MetaNewest");
EventsCalendar = new Mongo.Collection("EventsCalendar");
EventsHtmls = new Mongo.Collection("EventsHtmls");
CardsData = new Mongo.Collection('CardDatabase');
CardsFullData = new Mongo.Collection('CardsFullData');
LGS = new Mongo.Collection('LGS');
LGSEvents = new Mongo.Collection('LGSEvents');
ZipCodes = new Mongo.Collection('ZipCodes');
Formats = new Mongo.Collection('Formats');


tempCollection = new Mongo.Collection("temp");

