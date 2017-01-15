import React from 'react' ;
import ModalFirstPage from '/client/dumbReact/Modal/ModalFirstPage.jsx';
import DeckEditContainer from '/client/dumbReact/DeckEdit/DeckEditContainer.jsx' ;


export default class FixDecksWithoutNames extends React.Component{
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
                {title: "colors", data: "colors", render : (data, type, row, meta)=>{
                    var colors = getCssManaFromDeck(data);
                    var colorsStrings = "";
                    colors.forEach(function(obj){
                        colorsStrings += '<div class="mana ' + obj +'"></div>';
                    });
                    return colorsStrings;
                }},

            ],
            "drawCallback" : function(){
                if(!that.state.eventCheck){
                    var table = $(that.refs["ObjectsTable"]).DataTable();

                    $(that.refs["ObjectsTable"]).find("tbody").off('click');
                    $(that.refs["ObjectsTable"]).find("tbody").on('click', 'td.js-select_id', function () {
                        var DecksData_id = $(this).attr("data-_id");
                        var format = $(this).attr("data-format");
                        that.setState({
                            DecksData_id : DecksData_id,
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
                        <DeckEditContainer DecksData_id={this.state.DecksData_id} />
                    </ModalFirstPage>
                </div>
            </div>
        )
    }
}
