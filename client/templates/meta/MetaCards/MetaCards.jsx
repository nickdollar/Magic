import React from 'react' ;
import MetaCardsOptions from "./MetaCardsOptions/MetaCardsOptions.jsx"
import MetaCardsValues from "./MetaCardsValues/MetaCardsValues.jsx"


export default class NewsMetaValues extends React.Component {
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
            return LGSObj._id;
        })

        Meteor.call("getMetaCardsMethod", {format, format, options : options, LGS_ids : LGS_ids}, (err, data)=>{
            this.setState({tableData : data.cards, totalDecks : data.totalDecks});
        });
    }

    registerOptions(options){
        this.state.options = options;
        this.updateValues(options, this.props.format);
    }

    render(){
        return(
            <div className="MetaCardsComponent">
                <MetaCardsOptions registerOptions={this.registerOptions.bind(this)}
                />
                <MetaCardsValues tableData={this.state.tableData}
                                 totalDecks={this.state.totalDecks}
                />

            </div>
        );
    }
}