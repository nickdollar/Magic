import React from 'react' ;
import MetaTable from "./MetaTable/MetaTable.jsx";
import MetaCards from "./MetaCards/MetaCards.jsx";
import MetaNews from "./MetaNews/MetaNews.jsx";

export default class Meta extends React.Component {
    constructor(){
        super();

    }

    componentWillReceiveProps(nextProps){
        console.log("componentWillReceiveProps");
        console.log(nextProps);
    }

    shouldComponentUpdate(nextProps, nextState){
        console.log("shouldComponentUpdate");

        console.log(nextProps);
        return true;
    }

    render(){
        return(
            <div className="MetaComponent block-body">
                    <div className="block-left block-left--meta-archetypes">
                        <MetaTable Formats_id={this.props.Formats_id} />
                    </div>
                    <div className="block-right block-right--cards-meta">
                            <MetaCards Formats_id={this.props.Formats_id} />
                    </div>
                    <div className="block-right block-right--overflow block-right--news-meta block-right--not-first">
                        <MetaNews Formats_id={this.props.Formats_id} />
                    </div>
            </div>
        );
    }
}