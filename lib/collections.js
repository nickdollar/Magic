_Deck = new Mongo.Collection('deck');
_Event = new Mongo.Collection('event');
_CardDatabase = new Mongo.Collection('carddatabase');
_DeckCards = new Mongo.Collection('deckcards');
_MetaDate = new Mongo.Collection('metaDate');
_MetaValues = new Mongo.Collection('metaValues');
_cardsMetaValues = new Mongo.Collection('cardsmetavalues');
_cardData2 = new Mongo.Collection('data2');
_cardBreakDown = new Mongo.Collection('cardbreakdown');
_deckCardsWeekChange = new Mongo.Collection('deckCardsWeekChange');
_cardBreakDownDate = new Mongo.Collection('cardbreakdowndate');
_cardWeekQuantity = new Mongo.Collection('cardweekquantity');
_formatsCards = new Mongo.Collection('formatsCards');
_simplifiedTables = new Mongo.Collection('simplifiedTables');
_deckArchetypes = new Mongo.Collection('deckarchetypes');
_metaOptions = new Mongo.Collection('metaoptions');

_data = new Mongo.Collection('data');


_eventDecks = new Mongo.Collection('eventdecks');
_metaCards = new Mongo.Collection('metaCards');
_futureEvents = new Mongo.Collection("futureEvents");

//+++++++++++++++++++
//deckName          +
//+++++++++++++++++++

_DeckNames = new Mongo.Collection('decknames');
_DeckNamesCards = new Mongo.Collection('decknamescards');
_JoinExampleCards = new Meteor.Collection('joinExampleCards');


Events = new Mongo.Collection("Events");
DecksData = new Mongo.Collection("DecksData");
DecksNames = new Mongo.Collection("DecksNames");
DecksArchetypes = new Mongo.Collection("DecksArchetypes");
DecksNamesPlaylists = new Mongo.Collection("DecksNamesPlaylists");
Images = new FS.Collection("Images", {
    stores: [new FS.Store.FileSystem("Images")]
});
Meta = new Mongo.Collection("Meta");
MetaCards = new Mongo.Collection("MetaCards");
MetaNewest = new Mongo.Collection("MetaNewest");
