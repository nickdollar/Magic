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

        var archetypeName = replaceTokenWithDash(this.props.archetype.name);

        return(

            <div className="DecksNamesListComponent">
                <div className="js-owl-deckOption owl-carousel owl-theme">
                    {this.props.decksNames.map((deckName)=>{
                        var fixedDeckName = replaceTokenWithDash(deckName.name);
                        return  <div className="deckBox" key={deckName._id}>
                                    <a href={"/decks/" +  this.props.archetype.format + '/' + archetypeName + '/' + fixedDeckName} >
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