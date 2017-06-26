import React from 'react' ;

export default class SevenDayCalendar extends React.Component {
    constructor(){
        super();

    }

    componentDidMount(){
        $('#frontMainCalendar').fullCalendar("destroy");
        $('#frontMainCalendar').fullCalendar({

            header: false,
            views: {
                agendaFourDay: {
                    type: 'basicWeek',
                    duration: { days: 7 },
                    buttonText: '4 day'
                }
            },
            firstDay : new Date().getDay() -1,
            height : 200,
            defaultView : "agendaFourDay"
        });

        Meteor.call("GetFrontPageEvents",(err, response)=>{
            var events = response.map((event)=>{
                event.id = event._id;
                return event;
            })
            $('#frontMainCalendar').fullCalendar("addEventSource", events);
        })

    }

    render(){
        return(

            <div className="SevenDayCalendarComponent">
                <h3>Future Events</h3>
                <div className="mainCalendar">
                    <div id="frontMainCalendar"></div>
                </div>
            </div>
        );
    }
}