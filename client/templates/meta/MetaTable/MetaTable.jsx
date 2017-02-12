import React from 'react' ;
import MetaTableOptions from './MetaTableOptions/MetaTableOptions.jsx';
import MetaTableValues from './MetaTableValues/MetaTableValues.jsx';



export default class NewsReactTable extends React.Component {
    constructor(){
        super();
        this.state = {tableData : [], totalDecks : 0};

    }

    registerOptions(options, format){
        console.log(format);
        Meteor.call("getMetaAllArchetypes", format, options, (err, data)=>{
            var totalDecks = data.reduce((a, b)=>{
                return  a + b.quantity;
            },0);
            this.setState({tableData : data, totalDecks : totalDecks});
        });
    }

    render(){
        return(
            <div className="MetaTableComponent">
                <MetaTableOptions registerOptions={this.registerOptions.bind(this)}
                                  format={this.props.format}/>
                <MetaTableValues tableData={this.state.tableData}
                              totalDecks={this.state.totalDecks}
                />
            </div>
        );
    }
}