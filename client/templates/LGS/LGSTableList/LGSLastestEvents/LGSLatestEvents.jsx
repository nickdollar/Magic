import React from "react";
import Moment from "moment";
import Pagination from "react-js-pagination";

class LGSLatestEvents extends React.Component{
    constructor() {
        super();
        this.state = {
            inputValue : false,
            activePage: 1,
            itemsCountPerPage: 5
        }
    }

    handlePageChange(pageNumber) {
        this.setState({activePage: pageNumber});
    }

    render() {
        var slicesEvents = this.props.Events.slice((this.state.activePage-1)*this.state.itemsCountPerPage, (this.state.activePage)*this.state.itemsCountPerPage);
        return (
            <div className="LGSLatestEvents">
                <div className="titlePaginationWrapper">
                    <div className="eventTitle">
                        <h3>Local Game Store Published Events</h3>
                    </div>
                    <div className="eventPagination">
                        <Pagination
                            activePage={this.state.activePage}
                            itemsCountPerPage={5}
                            totalItemsCount={this.props.Events.length}
                            pageRangeDisplayed={4}
                            onChange={this.handlePageChange.bind(this)}
                        />
                    </div>
                </div>
                <div className="LGSLatestEventsTable">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Event</th>
                                <th>Name</th>
                                <th>Store</th>
                                <th>Format</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                        {slicesEvents.map((event)=>{
                            var lgs = LGS.findOne({_id : event.LGS_id});
                            return  <tr key={event._id}>
                                        <td ><a href={FlowRouter.path("selectedEvent", {format : getLinkFormat(event.Formats_id), Events_id : event._id})}>Link</a></td>
                                        <td>{event.name}</td>
                                        <td>{lgs.name +" ("+ lgs.location.city +")"}</td>
                                        <td>{Formats.findOne({_id : event.Formats_id}) ? Formats.findOne({_id : event.Formats_id}).name : event.Formats_id}</td>
                                        <td>{Moment(event.date).format("L")}</td>

                                    </tr>
                        })}

                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default LGSLatestEvents;