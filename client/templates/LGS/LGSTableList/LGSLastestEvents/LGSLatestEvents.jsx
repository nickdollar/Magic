import React from "react";

class LGSLatestEvents extends React.Component{
    constructor() {
        super();
        this.state = {
            inputValue : false
        }
    }
    render() {
        return (
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Event</th>
                            <th>Store</th>
                            <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>


                </table>
            </div>
        )
    }
}

export default LGSLatestEvents;