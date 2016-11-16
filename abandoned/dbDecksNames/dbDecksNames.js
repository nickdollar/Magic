// Template.dbDecksNames.onCreated(function(){
//     var that = this;
//     that.deckName = new ReactiveVar;
//     that.deckPercentage = new ReactiveVar;
//     that.DecksData_id = new ReactiveVar;
//     that.autorun(function(){
//         if(that.DecksData_id.get()){
//             that.subscribe("deckSelectedID", that.DecksData_id.get());
//         }
//     });
//
//     that.autorun(function(){
//         if(that.deckName.get()){
//             that.subscribe("DecksNamesById", that.deckName.get()._id);
//         }
//     });
// });
//
// Template.dbDecksNames.helpers({
//     deckName : function(){
//         return Template.instance().deckName.get();
//     },
//     decksPercentageTableCardsPercentageSchema : function(){
//         return Schemas.decksPercentageTableCardsPercentage;
//     },
//     DecksData_idValue(){
//         return Template.instance().DecksData_id.get();
//     },
//     DecksData_formatValue(){
//         return Template.instance().deckName.get().format;
//     },
//     DeckNames_name(){
//         var decks = DecksNames.find({}).map(function(obj){
//             return {label : obj.name, value : obj.name};
//         });
//         return decks;
//     },
//     cardType : function(){
//         var blocks = ["artifact", "creature", "enchantment", "instant", "planeswalker", "sorcery", "land"];
//         var types = [];
//
//         for(var i = 0; i< blocks.length; i++){
//             var quantity = getQuantity3(blocks[i], false, Template.instance().DecksData_id.get());
//             if(quantity > 0){types.push({name : capitalizeFirstLetter(blocks[i]), quantity : quantity, block : blocks[i]});}
//         }
//         return types;
//     },
//     cards : function(block){
//         var cardNames = CardsData.find(typeOptions[block]).map(function(p) { return p.name });
//         var deck = DecksData.findOne({_id : Template.instance().DecksData_id.get()});
//
//         var newArray = deck.main.filter(function(obj1){
//             return cardNames.find(function(obj2){
//                 return obj1.name == obj2;
//             });
//         });
//
//         return newArray;
//     },
//     cardPercentage : function(){
//         var that = this;
//         var card = DecksNames.findOne({_id : Template.instance().deckName.get()._id}).main.find(function(obj){
//             return that.name == obj.name;
//         });
//
//
//         var quantity = DecksNames.findOne({_id : Template.instance().deckName.get()._id}).decks;
//
//
//         return card.decksQuantity/quantity;
//     },
//     percentage : function(){
//         return Template.instance().percentage.get();
//     }
//
// });
//
// Template.dbDecksNames.events({
//     "click .js-DecksNames_id" : function(){
//         var row = $(event.target).closest('tr').get(0);
//         var dataTable = $(event.target).closest('table').DataTable();
//         var rowData = dataTable.row(row).data();
//         if (!rowData) return; // Won't be data if a placeholder row is clicked
//         $('#decksIdsPercentage').DataTable().clear();
//         Template.instance().deckName.set();
//         Template.instance().deckPercentage.set();
//         Template.instance().DecksData_id.set();
//         var that = Template.instance();
//         $('#decksIdsPercentage').DataTable().clear();
//         Meteor.setTimeout(function(){
//             that.deckName.set(rowData);
//             Meteor.call("methodGetDeckNamePercentage", rowData, function(error, data){
//                 if (error) {
//                     console.log(error);
//                     return;
//                 }
//                 that.deckPercentage.set(data);
//                 $('#decksIdsPercentage').DataTable().rows.add(data).draw();
//             });
//         }, 5);
//     },
//     "click .js-DecksData_id" : function(event, template){
//         var row = $(event.target).closest('tr').get(0);
//         var dataTable = $(event.target).closest('table').DataTable();
//         var rowData = dataTable.row(row).data();
//         Template.instance().DecksData_id.set();
//         var thatTemplate = Template.instance();
//         Meteor.setTimeout(function(){
//             thatTemplate.DecksData_id.set(rowData[0]);
//         }, 5);
//     }
// });
//
// Template.dbDecksNames.onRendered(function(){
//     if (! $.fn.dataTable.isDataTable('#example')){
//         $('#decksIdsPercentage').DataTable({
//             data: null,
//             columns : [
//                 {title : "_id", render : function(data, type, row, meta){
//                     return "<div class='js-DecksData_id'>" + data + "</div>";
//                 }},
//                 {title : "result", render : function(data, type, row, meta){
//                     return prettifyPercentage(data);
//                 }}
//             ]
//         });
//     }
// });
//
// if (typeof Schemas === 'undefined' || Schemas === null) {
//     Schemas = {};
// }
//
// Schemas.decksPercentageTableCardsPercentage = new SimpleSchema({
//     DeckName: {
//         type: String,
//         autoform: {
//             type: "selectize",
//             label : "Deck Name",
//             selectizeOptions: {
//                 create: true
//             }
//         }
//     },
//     DecksData_id : {
//         type : String
//     },
//     format : {
//         type : String
//     }
// });
//
//
// // Template.decksPercentageTable.onRendered(function(){
// //     if (! $.fn.dataTable.isDataTable('#example')){
// //         var data = Template.currentData().decksPercentage;
// //         $('#example').DataTable({
// //             data: data,
// //             columns : [
// //                 {title : "_id", render : function(data, type, row, meta){
// //                     return "<div class='js-selectDeck_id'>" + data + "</div>";
// //                 }},
// //                 {title : "result", render : function(data, type, row, meta){
// //                     return prettifyPercentage(data);
// //                 }}
// //             ]
// //         });
// //     }
// // });
//
// // Template.decksPercentage.onCreated(function(){
// //     var that = this;
// //     this.deckPercentage = new ReactiveVar;
// //     this.autorun(function(){
// //         this.deckPercentage = new ReactiveVar;
// //         var deckName = Template.currentData().deckName;
// //         Meteor.call("methodGetDeckNamePercentage", deckName, function(error, data){
// //             if (error) {
// //                 console.log(error);
// //                 return;
// //             }
// //             that.deckPercentage.set(data);
// //         });
// //     });
// // });
// //
// // Template.decksPercentage.helpers({
// //     decksPercentage : function(){
// //         return Template.instance().deckPercentage.get();
// //     },
// //     isDecksPercentage : function(){
// //         return !!Template.instance().deckPercentage.get();
// //     }
// //
// // });
// //
// // //decksPercentageTable
// //
// // Template.decksPercentageTable.onCreated(function(){
// //     this.selectedDeck_id = new ReactiveVar;
// // });
// //
// // Template.decksPercentageTable.helpers({
// //     selectedDeck_id : function(){
// //         return Template.instance().selectedDeck_id.get();
// //     }
// // });
// //
// // Template.decksPercentageTable.events({
// //     "click .js-selectDeck_id" : function(event, template){
// //         var row = $(event.target).closest('tr').get(0);
// //         var dataTable = $(event.target).closest('table').DataTable();
// //         var rowData = dataTable.row(row).data();
// //         Template.instance().selectedDeck_id.set();
// //         var thatTemplate = Template.instance();
// //         Meteor.setTimeout(function(){
// //             thatTemplate.selectedDeck_id.set(rowData[0]);
// //         }, 5);
// //     }
// // });
// //
// // Template.decksPercentageTable.onRendered(function(){
// // console.log(Template.currentData().decksPercentage);
// //
// //     if (! $.fn.dataTable.isDataTable( '#example' ) ) {
// //         var data = Template.currentData().decksPercentage;
// //         $('#example').DataTable({
// //             data: data,
// //             columns : [
// //                 {title : "_id", render : function(data, type, row, meta){
// //                     return "<div class='js-selectDeck_id'>" + data + "</div>";
// //                 }},
// //                 {title : "result", render : function(data, type, row, meta){
// //                     return prettifyPercentage(data);
// //                 }}
// //             ]
// //         });
// //     }
// // });
// //
// // Template.decksPercentageTableCardsPercentage.onCreated(function(){
// //     var that = this;
// //     this.deckPercentage = new ReactiveVar;
// //     that.percentage = new ReactiveVar;
// //     Meteor.subscribe("deckSelectedID", that.data.selectedDeck_id);
// //     Meteor.subscribe("DecksNamesReturnFromID", that.data.deckName3._id);
// //
// //     this.autorun(function(){
// //         Meteor.call('methodFindDeckComparison', that.data.selectedDeck_id, function(error, result){
// //             if(error){
// //                 alert(error);
// //             }else{
// //                 that.percentage.set(result);
// //             }
// //         });
// //     });
// //
// // });
// //
// // Template.decksPercentageTableCardsPercentage.helpers({
// //     cardType : function(){
// //         var blocks = ["artifact", "creature", "enchantment", "instant", "planeswalker", "sorcery", "land"];
// //         var types = [];
// //
// //         for(var i = 0; i< blocks.length; i++){
// //             var quantity = getQuantity3(blocks[i], false, Template.instance().data.selectedDeck_id);
// //             if(quantity > 0){types.push({name : capitalizeFirstLetter(blocks[i]), quantity : quantity, block : blocks[i]});}
// //         }
// //         return types;
// //     },
// //     cards : function(block){
// //         var cardNames = CardsData.find(typeOptions[block]).map(function(p) { return p.name });
// //         var deck = DecksData.findOne({_id : Template.instance().data.selectedDeck_id});
// //
// //         var newArray = deck.main.filter(function(obj1){
// //             return cardNames.find(function(obj2){
// //                 return obj1.name == obj2;
// //             });
// //         });
// //
// //         return newArray;
// //     },
// //     decksPercentageTableCardsPercentageSchema : function(){
// //         return Schema.decksPercentageTableCardsPercentageAddNameToDeck;
// //     },
// //     options : function () {
// //         var decks = DecksNames.find({}).map(function(obj){
// //             return {label : obj.deckName, value : obj.deckName};
// //         });
// //
// //         return decks;
// //     },
// //     cardPercentage : function(){
// //         var that = this;
// //         var card = DecksNames.findOne({_id : Template.instance().data.deckName3._id}).main.find(function(obj){
// //             return that.name == obj.name;
// //         });
// //
// //         var quantity = DecksNames.findOne({_id : Template.instance().data.deckName3._id}).decks;
// //
// //
// //         return card.decksQuantity/quantity;
// //     },
// //     percentage : function(){
// //         return Template.instance().percentage.get();
// //     }
// // });
// //
// // Template.decksPercentageTableCardsPercentage.events({
// //     "mousemove .js-nameMouseOver" : function(evt, template){
// //         var mouseX = evt.pageX;
// //         var mouseY = evt.pageY;
// //
// //         // console.log(mouseX + " " + mouseY);
// //         $('#DivToShow').css({'top':mouseY,'left':mouseX}).fadeIn('slow');
// //
// //     }
// // });
// //
// //
// // Template.decksPercentageTableCardsPercentage.events({
// //     "click .js-confirmDeck" : function(evt, template){
// //         Meteor.call('methodAddNameToDeck', {deckName : this.deckName, deck_id : Template.instance().data.selectedDeck_id}, function(err, data){
// //             var temp = template.parentTemplate(3).deckName.get();
// //             template.parentTemplate(3).deckName.set();
// //             Meteor.setTimeout(function(){
// //                 template.parentTemplate(3).deckName.set(temp);
// //             }, 100);
// //         });
// //     }
// // })
//
//
