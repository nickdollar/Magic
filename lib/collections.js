_Deck = new Mongo.Collection('deck');
_Event = new Mongo.Collection('event');
_CardDatabase = new Mongo.Collection('carddatabase');
_DeckCards = new Mongo.Collection('deckcards');
_MetaDate = new Mongo.Collection('metaDate');
_MetaValues = new Mongo.Collection('metaValues');

_cardData2 = new Mongo.Collection('data2');
_cardBreakDown = new Mongo.Collection('cardbreakdown');
_cardBreakDownCards = new Mongo.Collection('cardbreakdowncards');
_cardBreakDownDate = new Mongo.Collection('cardbreakdowndate');
//++++++++++++++++++++++++
//deckName               +
//++++++++++++++++++++++++

_DeckNames = new Mongo.Collection('decknames');
_DeckNamesCards = new Mongo.Collection('decknamescards');

_JoinExampleCards = new Meteor.Collection('joinExampleCards');

_DeckPlayList = new Mongo.Collection('deckplaylist');

_Images = new FS.Collection("images", {
    stores: [new FS.Store.FileSystem("images")]
});