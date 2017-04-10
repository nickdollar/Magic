import React from 'react' ;
import owlCarousel from 'owl.carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';

export default class DecksNamesList extends React.Component {
    constructor(){
        super();

    }

    componentDidMount(){
        $('.js-owl-deckOption').owlCarousel({
            items : 3,
            itemsCustom : false,
            itemsDesktop : false,
            itemsDesktopSmall : false
        });
    }

    render(){
        return(
            <div className="DecksNamesListComponent">
                <div className="js-owl-deckOption owl-carousel owl-theme">
                    {this.props.DecksNames.map((deckName)=>{
                        return  <div className="deckBox" key={deckName._id}>
                                    <a href={FlowRouter.path("ArchetypeDeckInformation", {format : getLinkFormat(deckName.Formats_id), DeckArchetype : this.props.DeckArchetype.link, DeckName : deckName.link})}>
                                        <div className="firstLine">
                                            <div className="deckName">
                                                {deckName.name}
                                            </div>
                                        </div>
                                        <div className="secondLine">
                                            <div className="deckMana" >
                                                {getHTMLColorsFromColorArray(deckName.colors)}
                                            </div>
                                        </div>
                                    </a>
                                </div>
                    })}
                </div>
            </div>
        );
    }
}

