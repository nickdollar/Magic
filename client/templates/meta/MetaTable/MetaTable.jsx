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
        Meteor.call("MethodGetMetaAllArchetypes", format, options, Session.get("position"), Session.get("distance"), Session.get('positionOption'), Session.get('state'), Session.get('ZIP'), (err, data)=>{
            var totalDecks = data.reduce((a, b)=>{
                return  a + b.quantity;
            },0);

            var table = [];
            table = table.concat(data)
            table = table.concat(table)
            table = table.concat(table)
            table = table.concat(table)
            table = table.concat(table)


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