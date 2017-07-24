import React from 'react' ;

export default class FormatsMenu extends React.Component {
    constructor(){
        super();
        var flowRouterformat = FlowRouter.getParam("format");
        var format = "sta";
        if(flowRouterformat) {
            var FormatQuery = Formats.findOne({names: {$regex: flowRouterformat, $options: "i"}});
            if (FormatQuery) {
                Session.set("selectedMenuFormat", format.name);
                format = FormatQuery._id;
            }
        }
        this.state = {selectedFormat : format};
    }

    selectedFormat(format){
        this.setState({selectedFormat : format._id});
        Session.set("selectedMenuFormat", format.name);
    }
    render(){

        console.log(FlowRouter.getRouteName());

        return(
            <div className="FormatsMenuComponent">
                <div className="typeMenu">
                    <nav className="navbar navbar-static-top navbar-height">
                        <div className="collapse navbar-collapse navbar-inner">
                            <ul className="nav navbar-nav selected">
                                {Formats.find({active : 1}).map(format =>{
                                return <li className={this.state.selectedFormat == format._id ? "active" : ""} key={format._id}>
                                    <a onClick={()=>this.selectedFormat(format)} href={FlowRouter.getRouteName() != "LGSPage" ? FlowRouter.path(FlowRouter.getRouteName(), {format : format.name}) : null}>{format.name}</a>
                                </li>
                            })}
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
        );
    }
}