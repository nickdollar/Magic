import React from 'react' ;
import MetaTableOptions from './MetaTableOptions/MetaTableOptions.jsx';
import MetaTableValues from './MetaTableValues/MetaTableValues.jsx';



export default class MetaTable extends React.Component {
    constructor(props){
        super();
        this.state = {tableData : [], totalDecks : 0};
    }

    componentWillReceiveProps(nextProps){
        if(this.props.Formats_id != nextProps.Formats_id && this.state.options){
            this.updateValues(this.state.options, nextProps.Formats_id);
        }
    }

    updateValues(options, Formats_id){
        var LGS_ids = LGS.find({}).map((LGSObj)=>{
            return LGSObj._id;
        })

        Meteor.call("getMetaAllArchetypesMethod", {Formats_id : Formats_id, options : options, LGS_ids : LGS_ids}, (err, response)=>{
            var totalDecks = response.reduce((a, b)=>{
                return  a + b.qty;
            },0);
            var table = [];
            table = table.concat(response)
            this.setState({tableData : table, totalDecks : totalDecks});
        });
    }

    registerOptions(options){
        this.state.options = options;
        this.updateValues(options, this.props.Formats_id);
    }

    render(){
        return(
            <div className="MetaTableComponent">
                <MetaTableOptions registerOptions={this.registerOptions.bind(this)}/>
                <MetaTableValues    tableData={this.state.tableData}
                                    totalDecks={this.state.totalDecks}
                                    Formats_id={this.props.Formats_id}
                />
            </div>
        );
    }
}