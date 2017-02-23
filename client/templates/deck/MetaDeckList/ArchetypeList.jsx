import React from "react";

class ArchetypeList extends React.Component{
    constructor() {
        super();
        this.state = {
            inputValue : false
        }
    }

    componentWillReceiveProps(nextProps){
        var table = $('#archetypeListTable').DataTable();

        if(this.props.typeOptions != nextProps.typeOptions){
            this.typesSearch(nextProps, table);
        }

        if(this.props.colors != nextProps.colors || this.props.containMatch != nextProps.containMatch){
            this.colorsSearch(nextProps, table);
        }

        if(this.props.cards != nextProps.cards){
            this.cardsSearch(nextProps, table);
        }
        if(this.props.format != nextProps.format) {
            this.formatChange(nextProps, table)
        }
    }

    formatChange(props, table){
            table.clear()
                .rows.add(DecksArchetypes.find({format : props.format}).fetch())
                .draw();
    }
    
    typesSearch(props, table){
        var typeOptionsRegex = props.typeOptions.join("|");
        if(typeOptionsRegex==""){
            typeOptionsRegex = "^$";
        }
        var filteredData = table
            .column( 3 )
            .search(typeOptionsRegex, true)
            .draw();
    }

    cardsSearch(props, table){
        var archetypes;
        if(props.cards.length == 0){
            archetypes = "";
        }else{
            var decks = DecksNames.find({"main.name" : { $all : props.cards}}).fetch();

            if(decks.length == 0){
                archetypes = "^$";
            }else{
                var decksUnique = Array.from(new Set(decks.map(a =>{
                    return a.DecksArchetypes_id;
                })));

                var archetypes = decksUnique.join("|");
                if(archetypes==""){
                    archetypes = "";
                }
            }
        }

        table
            .column(0)
            .search(archetypes, true)
            .draw();
    }

    colorsSearch(props, table){
        var colorsRegex = "";
        var quantity = props.colors.length;

        if(props.containMatch == "contain") {
            var colorsRegex = "(";
            colorsRegex += props.colors.join("|");
            colorsRegex += ")";
        }else{
            props.colors.forEach((color)=>{
                colorsRegex += "(?=.*" + color + ")";
            })
            colorsRegex += "(?=\\b\\w{"+ quantity +"}\\b)" + colorsRegex;
        }

        if(quantity==0){
            colorsRegex = "^$";
        }

        table
            .column(2)
            .search(colorsRegex, true)
            .draw();
    }

    formatDeckArchetypes(DecksArchetypes_id) {
        console.log("formatDeckArchetypes");
        var decksArchetypesQuery = DecksArchetypes.findOne({_id : DecksArchetypes_id});
        var decksNameQuery = DecksNames.find({DecksArchetypes_id : DecksArchetypes_id}).fetch();

        var html = '<table class="table table-sm childTable">';
        decksNameQuery.forEach(function(decksNamesObj){
            html += '<tr>'+
                '<td></td>'+
                '<td class="tableName"><a href="/decks/' + FlowRouter.getParam("format") + '/' + DecksArchetypes.findOne({_id : DecksArchetypes_id}).name+'/'+ decksNamesObj.name +'">'+decksNamesObj.name+'</a></td>'+
                '<td class="tableMana">';

            var manas = getCssManaByNumberFromDeckNameById(decksNamesObj._id);
            manas.forEach(mana =>{
                html += "<div class='mana " + mana.mana + "'></div>";
            });
            html += '</td>'+
                '<td class="tableType">' + decksArchetypesQuery.type +'</td>';
            html += '</tr>';
        });
        html += "</table>";
        return html;
    }
    
    componentDidMount(){
        $('#archetypeListTable').DataTable({
            pageLength: 20,
            data: DecksArchetypes.find({format : FlowRouter.getParam("format")}).fetch(),
            order: [[ 1, "asc" ]],
            pagingType: "simple",
            rowId : "_id",
            dom :"<'row'<'col-sm-12'f>>" +
                 "<'row'<'col-sm-12 tableHeight'tr>>" +
            "<'row'<'col-sm-6'i><'col-sm-6'p>>",
            columnDefs : [{
                targets : 0,
                createdCell : function(td, cellData, rowData, row, col){
                    $(td).addClass("details-control");
                    $(td).attr("data-_id", rowData._id);
                }
            },
                {
                    orderable : false, targets : "_all"
                }],
            columns: [
                {
                    width : "10px", data : function(row, type, val, meta){
                    if (type === 'filter') {
                        return row._id;
                    }
                    return "";
                    }
                },
                {
                    width : "200px",title: "name", data: "name", render : function(data, type, row, meta){

                    if (type === 'filter') {
                        return data;
                    }
                    else if (type === 'display') {
                        var html = '<span><a href="/decks/' + FlowRouter.getParam("format") + '/' + replaceTokenWithDash(row.name) + '">'+ row.name + '</a></span>';
                        return html;
                    }


                    // 'sort', 'type' and undefined all just use the integer
                    return data;

                },
                    createdCell: function (td, cellData, rowData, row, col) {

                    }
                },
                {
                    title: "colors", render : function(data, type, row, meta){
                    if (type === 'display') {
                        return getHTMLColorsFromArchetypes(row._id);
                    }
                    return getColorsFromArchetypes(row._id);
                }},
                {
                    title: "Type", data: "type"
                }
            ]
        });


        var table = $("#archetypeListTable").DataTable();

        $('#archetypeListTable tbody').on('click', 'td.details-control', e => {
            var decksArchetypes_id = $(e.target).attr("data-_id");
            var tr = $(e.target).closest('tr');
            var row = table.row(tr);
            if (row.child.isShown()) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            } else {
                // Open this row
                row.child($(this.formatDeckArchetypes(decksArchetypes_id))).show();
                tr.addClass('shown');
            }
        });
        this.typesSearch(this.props, table);
    }

    render() {
        return (
            <div className="archetypeListTable row">
                <table id="archetypeListTable" className="table table-sm" cellSpacing="0" width="100%"></table>
            </div>
        )
    }
}

export default ArchetypeList;