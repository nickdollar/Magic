import React from 'react' ;
import ImportByUrl from './SubmitInput/ImportByUrl.jsx' ;
import ImportByFile from './SubmitInput/ImportByFile.jsx' ;
import ImportByDeckContainer from './SubmitInput/ImportByDeckContainer.jsx' ;
import DeckAndSideboardInput from './SubmitInput/DeckAndSideboardInput.jsx' ;


class SubmitDeck extends React.Component {
    constructor(){
        super();

        this.state = {
        deck : {
            main : [],
            sideboard : []
        }
        }
    }

    componentWillUnmount(){
        this.state.subscription.LGSEventsByStoreInArea.stop();
    }

    componentDidMount(){
        var calendar = this.refs["calendar"];
        $(calendar).fullCalendar({
            header: {
                left: '',
                center: 'prev title next',
                right: ''
            },
            customButtons: {
                addEvent: {
                    text: 'Add Event',
                    click: ()=> {
                        this.handleShowModalAddEvent()
                    }
                }
            },
            header: {
                left: 'prev,next today addEvent',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            fixedWeekCount : false,
            eventClick:  (event, jsEvent, view)=> {


                var when = "";
                if(event.dow){
                    var daysTemp = "";
                    for(var i = 0; i < event.dow.length; i++){
                        daysTemp += weekDays[event.dow[i]];
                        if(i <  event.dow.length - 1){
                            daysTemp += ", ";
                        };
                    }

                    when += "Every " + daysTemp+ " at "+ event.start.format("LT");
                }

                var formats = "";
                for(var i = 0; i < event.formats; i++){
                    formats += event.formats[i];
                    if(i <  event.formats.length - 1){
                        formats += ", ";
                    };
                }

                var eventObj = {
                    when : when,
                    formats : formats,
                    price : event.price,
                    rounds : event.rounds,
                    description : event.description,
                    LGS_id : event.LGS_id,
                    title : event.title

                }
                this.setState({view: {showModalEventInfo: true},
                    eventObj : eventObj});
            }
        });

        $(calendar).fullCalendar("removeEvents")

        var events = LGSEvents.find().map((event)=>{
            event.id = event._id;
            return event;
        });
        $(calendar).fullCalendar("addEventSource", events)
    }

    componentDidUpdate(){
        var calendar = this.refs["calendar"];
        $(calendar).fullCalendar("removeEvents")
        var events = LGSEvents.find().map((event)=>{
            event.id = event._id;
            return event;
        });

        $(calendar).fullCalendar("addEventSource", events)
    }

    handleShowModalAddEvent(){
        this.setState({view: {showModalAddEvent: true}})
    }
    
    setDeck(deck){
        var temp = Object.assign({}, deck);
        this.setState({deck : temp})
    }

    changeCardDeck(e){

        var cardName = e.target.getAttribute("data-name");
        var sideMain = e.target.getAttribute("data-mainside");

        if(e.target.value < 0) return;
        var deck = Object.assign({}, this.state.deck);

        var item = deck[sideMain].find((obj)=>{
            return cardName == obj.name
        });

        item.quantity = parseInt(e.target.value);
        this.setState({
            deck : deck
        })
    }

    removeCardDeck(e){

        var cardName = e.target.getAttribute("data-name");
        var sideMain = e.target.getAttribute("data-mainside");

        var deck = Object.assign({}, this.state.deck);

        var index = deck[sideMain].findIndex((obj)=>{
            return cardName == obj.name
        });

        deck[sideMain].splice(index, 1);

        this.setState({
            deck : deck
        })
    }

    addCardDeck(e){

        var cardName = e.target.previousElementSibling.value;
        var sideMain = e.target.previousElementSibling.getAttribute("data-mainSide");
        if(cardName.length == 0){
            return;
        };

        cardName = cardName.toTitleCase();

        if(this.state.deck[sideMain].findIndex((card)=>{
                return cardName == card.name
            }) != -1){
            return
        }

        var deck = Object.assign({}, this.state.deck);

        cardName = cardName.toTitleCase()

        deck[sideMain].push({name : cardName, quantity : 0});

        this.setState({
            deck : deck
        })
    }

    render() {
        return (
            <div>
                <ImportByUrl setDeck={this.setDeck.bind(this)}/>
                <ImportByFile setDeck={this.setDeck.bind(this)}/>
                <ImportByDeckContainer setDeck={this.setDeck.bind(this)}/>
                <DeckAndSideboardInput addCardDeck={this.addCardDeck.bind(this)}
                                       removeCardDeck={this.removeCardDeck.bind(this)}
                                       changeCardDeck={this.changeCardDeck.bind(this)}
                                       setDeck={this.setDeck.bind(this)}
                                       deck={this.state.deck}/>
            </div>

        )
    }
}

export default SubmitDeck;