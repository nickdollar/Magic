import React from 'react' ;

export default class Footer extends React.Component {
    constructor(){
        super();

    }

    render(){
        return(
            <div className="FooterComponent">
                    <div className="row">
                        <div className="col-xs-2">
                            <h3 className="logo">CrowdMTG</h3>
                        </div>
                        <div className="col-xs-2">
                            <h5>Get started</h5>
                            <ul>
                                <li><a href="/">Home</a></li>
                                {/*<li><a href="#">Sign up</a></li>*/}
                            </ul>
                        </div>
                        <div className="col-xs-3">
                            <h5>About us</h5>
                            <ul>
                                <li><a href={FlowRouter.path("CompanyInformation")}>Company Information</a></li>
                                {/*<li><a href="#">Contact us</a></li>*/}
                                {/*<li><a href="#">Reviews</a></li>*/}
                            </ul>
                        </div>
                        <div className="col-xs-2">
                            <h5>Support</h5>
                            <ul>
                                <li><a href={FlowRouter.path("FAQ")}>FAQ</a></li>
                                <li><a href={FlowRouter.path("FAQ")}>Privacy</a></li>

                                {/*<li><a href="#">Help desk</a></li>*/}
                                {/*<li><a href="#">Forums</a></li>*/}
                            </ul>
                        </div>
                        <div className="col-xs-3">
                            <h5>Find Us</h5>
                            <div className="social-networks">
                                <a href="https://twitter.com/crowdmtg" className="twitter"><i className="fa fa-twitter"></i></a>
                                {/*<a href="https://www.facebook.com/Crowdmtg-305651193194295/" className="facebook"><i className="fa fa-facebook"></i></a>*/}
                                <a href="https://www.twitch.tv/crowdmtg/" className="twitch"><i className="fa fa-twitch"></i></a>
                                <a href="https://trello.com/b/B94mZBXv/crowdmtg" className="trello"><i className="fa fa-trello"></i></a>
                                <a href="https://discordapp.com/channels/313876240496984066/313876240496984066" className="discord"><img src="/img/Discord-Logo-White.svg" alt="discord"/></a>
                            </div>
                            {/*<button type="button" className="btn btn-default">Contact us</button>*/}
                        </div>
                    </div>
                    <div className="footer-copyright">
                        <p>   This site is beta development. Magic: the Gathering and its respective properties are copyright of Wizards of the Coast.
                            CrowdMTG have no Affiliation with Wizards of the Coast and no Affiliation with Any Local Game Store.</p>
                    </div>
                </div>


        );
    }
}