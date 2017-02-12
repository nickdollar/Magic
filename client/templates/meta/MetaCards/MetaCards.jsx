import React from 'react' ;
import MetaCardsOptions from "./MetaCardsOptions/MetaCardsOptions.jsx"
import MetaCardsValues from "./MetaCardsValues/MetaCardsValues.jsx"


export default class NewsMetaValues extends React.Component {
    constructor(props){
        super();
        this.state = {tableData : [], totalDecks : 0};

    }

    componentWillReceiveProps(nextProps){
        console.log(nextProps);
    }

    registerOptions(options, format){
        Meteor.call("getMetaCards", format, options, (err, data)=>{
            this.setState({tableData : data.cards, totalDecks : data.totalDecks});
        });
    }

    render(){
        return(
            <div className="MetaCardsComponent">
                <MetaCardsOptions registerOptions={this.registerOptions.bind(this)}
                                  format={this.props.format}
                />
                <MetaCardsValues tableData={this.state.tableData}
                                 totalDecks={this.state.totalDecks}
                />

            </div>
        );
    }
}