import React from 'react' ;
import MetaTableOptions from './MetaTableOptions/MetaTableOptions.jsx';
import MetaTableValues from './MetaTableValues/MetaTableValues.jsx';



export default class MetaTable extends React.Component {
    constructor(props){
        super();
        this.state = {tableData : [], totalDecks : 0};
    }

    componentWillReceiveProps(nextProps){
        if(this.props.format != nextProps.format && this.state.options){
            this.updateValues(this.state.options, nextProps.format);
        }
    }

    updateValues(options, format){

        var LGS_ids = LGS.find({}).map((LGSObj)=>{
            return LGSObj;
        })

        Meteor.call("MethodGetMetaAllArchetypes", format, options, LGS_ids, (err, data)=>{
            var totalDecks = data.reduce((a, b)=>{
                return  a + b.quantity;
            },0);

            var table = [];
            table = table.concat(data)

            this.setState({tableData : table, totalDecks : totalDecks});
        });
    }

    registerOptions(options){
        this.state.options = options;
        this.updateValues(options, this.props.format);
    }

    render(){
        return(
            <div className="MetaTableComponent">
                <MetaTableOptions registerOptions={this.registerOptions.bind(this)}/>
                <MetaTableValues tableData={this.state.tableData}
                              totalDecks={this.state.totalDecks}
                />
            </div>
        );
    }
}