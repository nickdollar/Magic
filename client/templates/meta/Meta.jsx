import React from 'react' ;
import MetaTable from "./MetaTable/MetaTable.jsx";
import MetaCards from "./MetaCards/MetaCards.jsx";
import MetaNews from "./MetaNews/MetaNews.jsx";

export default class Meta extends React.Component {
    constructor(){
        super();

    }

    render(){
        return(
            <div className="MetaComponent">
                    <div className="col-xs-8">
                        <div className="row">
                            <MetaTable format={this.props.format} />
                        </div>
                    </div>
                    <div className="col-xs-4">
                        <div className="row">
                            <MetaCards format={this.props.format} />
                        </div>
                        <div className="row">
                            <MetaNews format={this.props.format} />
                        </div>
                    </div>
            </div>
        );
    }
}