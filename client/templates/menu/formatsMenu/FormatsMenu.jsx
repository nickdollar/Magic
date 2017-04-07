import React from 'react' ;

export default class TypeMenu extends React.Component {
    constructor(){
        super();
    }

    render(){
        return(
            <div className="TypeMenuComponent">
                <div className="typeMenu">
                    <nav className="navbar navbar-static-top navbar-height">
                        <div className="collapse navbar-collapse navbar-inner">
                            <ul className="nav navbar-nav selected">
                                {Formats.find().map(format =>{
                                    return <li><a key={format._id} href={FlowRouter.path(FlowRouter.getRouteName(), {format : format.name})}>{format.name}</a></li>
                                })}
                            </ul>
                        </div>
                    </nav>
                </div>


            </div>
        );
    }
}