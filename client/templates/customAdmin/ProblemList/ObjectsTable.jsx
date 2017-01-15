import React from 'react' ;

export default class ObjectsTable extends React.Component {
    constructor(){
        super();
    }


    componentWillReceiveProps(nextProps){
        $(this.refs["ObjectsTable"]).DataTable()
            .clear()
            .rows.add(nextProps.ObjectsWithProblems)
            .draw();
    }
    componentDidMount(){
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
                // createdCell : function(td, cellData, rowData, row, col){
                //     $(td).addClass("details-control");
                //     $(td).attr("data-_id", rowData._id);
                // }
            },
                {
                    orderable : false, targets : "_all"
                }],
            columns: [
                {width : "200px", title: "_id", data: "_id"},
                {title: "eventType", data: "eventType"},
                {title: "format", data: "format"},
                {title: "state", data: "state"},
            ]
        });

    }


    render() {
        return (
            <div>
                <table ref="ObjectsTable" className="table table-sm" cellSpacing="0" width="100%"></table>
            </div>
        )
    }
}
