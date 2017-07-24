import React from 'react' ;

export default class LGSPageCalendar extends React.Component {
    constructor(){
        super();

    }

    getLGSEvents(){
        Meteor.call("getLGSEventsFromId_", {LGS_id : this.props.LGS_id}, (err, response)=>{
            var calendar = this.refs["LGSCalendar"];
            $(calendar).fullCalendar("removeEvents");
            var events = response.map((event)=>{
                event.id = event._id;
                event.dow = [parseInt(event.day)]
                if(event.format == "modern"){
                    event.color = "#2E0E02";
                }else if(event.format == "standard"){
                    event.color = "#764248";
                }else if(event.format == "legacy"){
                    event.color = "#1E2D2F";
                }else if(event.format == "vintage"){
                    event.color = "#041F1E";
                }
                return event;
            });
            $(calendar).fullCalendar("addEventSource", events)
        });
    }


    componentDidMount(){
        var calendar = this.refs["LGSCalendar"];
        $(calendar).fullCalendar({
            header: false,
            views: {
                agendaFourDay: {
                    type: 'basicWeek',
                    duration: { days: 7 },
                    buttonText: '4 day',
                    titleFormat : "MMMM YYYY"
                }
            },
            firstDay : 1,
            height : 150,
            defaultView : "agendaFourDay"
        });

        this.getLGSEvents();

    }

    render(){
        return(
            <div className="LGSPageCalendarComponent">
                <div className="row-wrapper row-wrapper--white-bg ">
                    <div className="row-wrapper__title">Week Calendar</div>
                    <div ref="LGSCalendar"></div>
                </div>
            </div>
        );
    }
}