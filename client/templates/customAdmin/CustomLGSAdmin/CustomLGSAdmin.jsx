import React from 'react' ;
import StateListContainer from "/client/dumbReact/StatesList/StateListContainer.jsx"


export default class CustomLGSAdmin extends React.Component {
    constructor(){
        super();

    }

    render(){
        return(
            <div className="CustomLGSAdminComponent">
                <StateListContainer collection="LGS"
                                    subscription="LGSStatesList"
                                    notState={[]}
                                    states={["created", "confirmed"]}
                                    format={this.props.format}
                />
            </div>
        );
    }
}