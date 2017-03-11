import React from "react";
import LGSAddNewStore from "./LGSAddNewStore/LGSAddNewStore.jsx"
import LGSTableListContainer from "./LGSTableList/LGSTableListContainer.jsx"

export default class LGS extends React.Component{
    constructor() {
        super();
        this.state = {
            inputValue : false
        }
    }
    render() {
        return (
            <div>
                <LGSAddNewStore/>
                <LGSTableListContainer/>
            </div>
        )
    }
}

