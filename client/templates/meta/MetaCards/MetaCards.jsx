import React from 'react' ;
import MetaCardsOptions from "./MetaCardsOptions/MetaCardsOptions.jsx"
import MetaCardsValues from "./MetaCardsValues/MetaCardsValues.jsx"


export default class NewsMetaValues extends React.Component {
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

        Meteor.call("getMetaCardsMethod", {Formats_id, Formats_id, options : options, LGS_ids : LGS_ids}, (err, response)=>{
            this.setState({tableData : response.cards, totalDecks : response.totalDecks});
        });
    }

    registerOptions(options){
        this.state.options = options;
        this.updateValues(options, this.props.Formats_id);
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