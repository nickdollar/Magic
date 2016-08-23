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
_DeckPlayList = new Mongo.Collection('deckplaylist');
_Images = new FS.Collection("images", {
    stores: [new FS.Store.FileSystem("images")]
});



_temp = new Mongo.Collection('temp');
_temp2 = new Mongo.Collection('temp2');
_temp3 = new Mongo.Collection('temp3');
