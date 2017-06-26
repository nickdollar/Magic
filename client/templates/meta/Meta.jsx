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
            <div className="MetaComponent">
                    <div className="col-xs-8">
                        <div className="row">
                            <MetaTable Formats_id={this.props.Formats_id} />
                        </div>
                    </div>
                    <div className="col-xs-4">
                        <div className="row">
                            <MetaCards Formats_id={this.props.Formats_id} />
                        </div>
                        <div className="row">
                            <MetaNews Formats_id={this.props.Formats_id} />
                        </div>
                    </div>
            </div>
        );
    }
}