import React from 'react' ;
import ModalFirstPage from '/client/dumbReact/Modal/ModalFirstPage.jsx';
import EventDeckListAdminContainer from '/client/dumbReact/EventDeckListAdmin/EventDeckListAdminContainer.jsx' ;

export default class FixEventsWithDecksWithoutNames extends React.Component{
    constructor(props){
        super();
        this.state = {
            eventCheck : false,
            DecksData_id : null,
            format : null,
            showModal: false
        }
    }

    componentWillReceiveProps(nextProps){
        var nextProps_id = nextProps.ObjectsWithProblems.map((obj)=>{return  obj._id});
        var props_id = this.props.ObjectsWithProblems.map((obj)=>{return  obj._id});

        if(!nextProps_id.equals(props_id)){
            $(this.refs["ObjectsTable"]).DataTable()
                .clear()
                .rows.add(nextProps.ObjectsWithProblems)
                .draw();
        }
    }

    handleHideModal(){
        this.setState({showModal: false})
    }

    componentDidMount(){
        var that = this;
        $(this.refs["ObjectsTable"]).DataTable({
            pageLength: 5,
            data: this.props.ObjectsWithProblems,
            pagingType: "simple",
            rowId : "_id",
            dom :"<'row'<'col-sm-12'f>>" +
            "<'row'<'col-sm-12 tableHeight'tr>>" +
            "<'row'<'col-sm-6'i><'col-sm-6'p>>",

            columnDefs : [{
                targets : 0,
                createdCell : function(td, cellData, rowData, row, col){
                    $(td).addClass("js-select_id");
                    $(td).attr("data-_id", rowData._id);
                    $(td).attr("data-format", rowData.format);
                }
            }],
            columns: [
                {width : "200px", title: "_id", data: "_id"},
                {title: "eventType", data: "eventType"},
                {title: "format", data: "format"},
                {title: "state", data: "state"},
            ],
            "drawCallback" : function(){
                if(!that.state.eventCheck){
                    var table = $(that.refs["ObjectsTable"]).DataTable();

                    $(that.refs["ObjectsTable"]).find("tbody").off('click');
                    $(that.refs["ObjectsTable"]).find("tbody").on('click', 'td.js-select_id', function () {
                        var _id = $(this).attr("data-_id");
                        var format = $(this).attr("data-format");
                        console.log(_id);
                        that.setState({
                            _id : _id,
                            format : format,
                            showModal : true
                        })
                    });
                    that.state.eventCheck = true;
                }
            }

        });

    }

    render(){

        return (
            <div>
                <div>
                    <table ref="ObjectsTable" className="table table-sm" cellSpacing="0" width="100%"></table>
                    <ModalFirstPage showModal={this.state.showModal}
                                    handleHideModal={this.handleHideModal.bind(this)}

                    >
                        <EventDeckListAdminContainer _id={this.state._id} />
                    </ModalFirstPage>
                </div>
            </div>
        )
    }
}
