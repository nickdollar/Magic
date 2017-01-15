
AdminConfig = {
    name : "Magic",
    adminEmails: ['ivelacc@gmail.com'],
    collections: {
        DecksArchetypes: {
            tableColumns : [
                {label : "_id", name : "_id"},
                {label : "Name", name : "name"}
            ],
            templates: {
                new: {
                    name: 'AdminDecksArchetypesNew'
                },
                edit: {
                    name: 'AdminDecksArchetypesEdit'
                }
            }
        },
        DecksNames: {
            tableColumns : [
                {label : "Name", name : "name"}
            ],
            routes : {
                view : {
                    waitOn : function(){
                        return Meteor.subscribe("DecksNames")
                    }
                },
                new : {
                    waitOn : function(){
                        return [
                            Meteor.subscribe("DecksNames"),
                            Meteor.subscribe("DecksArchetypes")
                        ]
                    }
                },
                edit : {
                    waitOn : function(){
                        return [
                            Meteor.subscribe("DecksNames"),
                        ]
                    }
                }
            },
            templates: {
                new: {
                    name: 'AdminDecksNamesNew'
                },
                edit: {
                    name: 'AdminDecksNamesEdit',
                    data: {
                        post: Meteor.isClient && Session.get('admin_doc')
                    }
                }
            }
        },
        DecksData: {
            routes : {
                view : {
                    waitOn : function(){
                        return Meteor.subscribe("DecksNames")
                    }
                },
                edit : {
                    waitOn : function(){
                        return [
                            Meteor.subscribe("DecksDataCardsDataByDecksdata_id", FlowRouter.getParam("_id")),
                            Meteor.subscribe("DecksNames"),
                            Meteor.subscribe("DecksArchetypes")
                        ]
                    }
                }
            },
            tableColumns : [
                {label: '_id', name: '_id'},
                {label: 'DecksNames_id', name: 'DecksNames_id'},
                {label: 'DecksName', name: 'DecksNames_id', template: 'AdminDecksDataViewAllDecksNamesName'}
            ],
            templates: {
                new: {
                    name: 'AdminDecksDataNew'
                },
                edit: {
                    name: 'AdminDecksDataEdit',
                    data: {
                        post: Meteor.isClient && Session.get('admin_doc')
                    }
                },
                delete: {
                    name: 'AdminDecksDataNew'
                }
            }
        },
        Events: {
            routes : {
                view : {

                },
                edit : {
                    waitOn: function () {
                        return [
                            Meteor.subscribe("DecksNames"),
                            Meteor.subscribe("DecksArchetypes"),
                        ]
                    }
                }
            },
            tableColumns : [
                {label : "_id", name : "_id"},
                {label : "decks", name : "decks"},
                {label : "validation", name : "validation", template: 'EventsIsDone'},
                {label : "format", name : "format"},
                {label : "data", name : "date", template : "EventDateFormated"},
                {label : "eventType", name : "eventType"},
            ],
            templates: {
                new: {
                    name: "AdminEventsNew"
                },
                edit: {
                    name: 'AdminEventsEdit',
                    data: {
                        post: Meteor.isClient && Session.get('admin_doc')
                    },
                    waitOn: function () {
                        return [
                            Meteor.subscribe("DecksNames"),
                            Meteor.subscribe("DecksArchetypes"),
                        ]
                    }
                }
            }
        },
        EventsCalendar: {

        },
        CardsData: {
            routes : {
                view : {

                },
                edit : {

                }
            },
            tableColumns : [
                {label: '_id', name: '_id'},
                {label: 'name', name: 'name'}
            ],
            templates: {
                new: {
                    name: "AdminCardsDataNew"
                },
                edit: {
                    name: 'AdminCardsDataEdit',
                    // data: {
                    //     post: Meteor.isClient && Session.get('admin_doc')
                    // }
                }
            }
        },
        MetaCards : {
            templates: {
                new: {
                    name: "AdminMetaCardsNew"
                },
                edit: {
                    // name: 'AdminCardsDataEdit',
                    // data: {
                    //     post: Meteor.isClient && Session.get('admin_doc')
                    // }
                }
            },
        },
        DecksNamesPlaylists : {

        },
        Meta : {
            templates: {
                new: {
                    name: "AdminMetaNew"
                },
                edit: {
                    // name: 'AdminCardsDataEdit',
                    // data: {
                    //     post: Meteor.isClient && Session.get('admin_doc')
                    // }
                }
            },
        },
        MetaNewest : {
            templates: {
                new: {
                    name: "AdminMetaNewestNew"
                },
                // edit: {
                    // name: 'AdminCardsDataEdit',
                    // data: {
                    //     post: Meteor.isClient && Session.get('admin_doc')
                    // }
                // }
            },
        },
        DecksDataUniqueWithoutQuantity : {
            templates: {
                new: {
                    name: 'AdminDecksDataUniqueWithoutQuantityEdit'
                },
                edit: {
                    name: 'AdminDecksDataUniqueWithoutQuantityEdit'
                }
            }
        },
        CardsFullData : {
            templates: {
                new: {
                    name: 'AdminDecksDataUniqueWithoutQuantityEdit'
                },
                edit: {
                    name: 'AdminDecksDataUniqueWithoutQuantityEdit'
                }
            }
        }
    }
};