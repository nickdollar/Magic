import React from 'react' ;
import AddCardToCollection from './AddCardToCollection/AddCardToCollection.jsx';
import CardsTable from './CardsTable/CardsTables.jsx';
import CollectionFilter from "./CollectionFilter/CollectionFilter.jsx";
import ModalFirstPage from "/client/dumbReact/Modal/ModalFirstPage.jsx";
import ImportOptions from "./ImportOptions/ImportOptions.jsx";

export default class Collection extends React.Component {
    constructor() {
        super();
        this.state = {
            showOptionsModal : false,
            qty: 0,
            itemsCountPerPage : 40,
            activePage : 1,
            cards: [],
            filter: {
                colors: [
                    {value: "b", css: "sb", checked: true},
                    {value: "g", css: "sg", checked: true},
                    {value: "r", css: "sr", checked: true},
                    {value: "u", css: "su", checked: true},
                    {value: "w", css: "sw", checked: true},
                ],
                colorless: true,
                colorsQueryType : [
                    {value: "one", text: "Cards with at least one.", checked: true},
                    {value: "only", text: "Cards only Contains", checked: false},
                    {value: "all", text: "Each Card Contains all.", checked: false}
                ]
            },
            sort : {key : "name", value : 1},
            page : 0,
            cardsStartingWith : ""
        }
    }

    getSort(){
        var sort = Object.assign({}, this.state.sort);
        var sortObj = {};
        sortObj[sort.key] = sort.value;
        return sortObj;
    }

    getActivePage(){
        return this.state.activePage - 1;
    }

    getItemsCountPerPage(){
        return this.state.itemsCountPerPage;
    }

    getColors(){
        var colors = [];
        this.state.filter.colors.forEach((color)=>{
            if(color.checked){
                colors.push(color.value);
            }
        })
        var indexColorsQueryType = this.state.filter.colorsQueryType.findIndex(colorQueryType => colorQueryType.checked == true)
        var colorsQueryType = this.state.filter.colorsQueryType[indexColorsQueryType].value;

        var $match = {};
        if(colorsQueryType=="one"){
            $match = {colorIdentity : {$in : colors}};
        }else if(colorsQueryType=="only") {

            var allColors = ["B","G", "R", "U", "W"];
            var difference = _.difference(allColors, colors);
            $match = {$and : [{colorIdentity : {$nin : difference}}, {colorIdentity : {$exists : true}}]};
        }else{
            $match = {colorIdentity : {$all : colors}};
        }
        if(this.state.filter.colorless){
            $match = Object.assign({}, {$or : [$match, {colorIdentity : {$exists : false}}]})
        }
        return $match;
    }

    updateColorless(element){
        var filter = Object.assign({}, this.state.filter);
        filter.colorless = element.checked;
        this.setState({filter : filter});
    }

    getCollectionCards(){
        var queryObj = {};
        queryObj.sort = this.getSort();
        queryObj.colorsMatch = this.getColors();
        queryObj.page = this.getActivePage();
        queryObj.itemsCountPerPage = this.getItemsCountPerPage();
        queryObj.cardsStartingWith = this.state.cardsStartingWith;
        Meteor.call("getCollectionCardsMethod", queryObj, (err, response)=>{

            this.setState({cards : response.cards, qty : response.qty});
        });
    }

    componentDidMount(){
        this.getCollectionCards();
    }

    submitFilter(){
        this.getCollectionCards();
    }

    updateColors(element, index){
        var filter = Object.assign(this.state.filter);
        filter.colors[index].checked = element.checked;
        this.setState({filter : filter});
    }

    updateColorsQueryType(element, index){
        var filter = Object.assign(this.state.filter);
        for(var i = 0; i < filter.colorsQueryType.length; i++){
            filter.colorsQueryType[i].checked = false;
        }
        filter.colorsQueryType[index].checked = true;
        this.setState({filter : filter});
    }


    sortByHeader(value){
        var sort = Object.assign({}, this.state.sort);
        if(sort.key == value){
            sort.value = -sort.value;
        }else{
            sort = {key : value, value : 1}
        }

        this.state.sort = sort;
        this.getCollectionCards();
    }

    paginationOnChangeHandler(activePage){
        this.state.activePage = activePage;
        this.setState({activePage : activePage});
        this.getCollectionCards();
    }

    updateCardsStartingWith(target){
        this.state.cardsStartingWith = target.value;
    }

    removeCard(card, index){
        Meteor.call("removeCardFromCollectionMethod", card);
        var cards = this.state.cards.concat();

        cards.splice(index, 1);
        this.setState({cards : cards});
    }

    handlerHideImportCollectionModal(){
        this.setState({showOptionsModal : false})
    }

    openModal(){
        this.setState({showOptionsModal : true})
    }

    downloadFile(){
        Meteor.call("exportCollectionMethod", {}, (err, response)=>{
            var cardsCSV = `${response.keys.toString()}\r\n`;
            cardsCSV += ConvertToCSV(response.cardsAggregate);
            var a         = document.createElement('a');
            a.href        = 'data:attachment/csv,' +  encodeURIComponent(cardsCSV);
            a.target      = '_blank';
            a.download    = 'myCollection.csv';
            document.body.appendChild(a);
            a.click();
        })
    }

    render(){
        return(
            <div className="CollectionComponent">
                {/*<h3>Your Collection</h3>*/}
                    <div className="content-wrapper">
                    <h3>Export/Import</h3>
                    <div className="btn-group" role="group" aria-label="Basic example">
                        <button type="button" className="btn btn-default" onClick={this.downloadFile}>Export</button>
                        <button type="button" className="btn btn-default" onClick={this.openModal.bind(this)}>Import</button>
                    </div>
                    <h3>Add Card To Collection</h3>
                    <ModalFirstPage handleHideModal={this.handlerHideImportCollectionModal.bind(this)}
                                showModal={this.state.showOptionsModal}
                    >
                            <ImportOptions/>
                    </ModalFirstPage>
                    <AddCardToCollection getCollectionCards={this.getCollectionCards.bind(this)}/>
                    <CollectionFilter filter={this.state.filter}
                                      updateColors={this.updateColors.bind(this)}
                                      submitFilter={this.submitFilter.bind(this)}
                                      updateColorsQueryType={this.updateColorsQueryType.bind(this)}
                                      updateColorless={this.updateColorless.bind(this)}
                                      updateCardsStartingWith={this.updateCardsStartingWith.bind(this)}
                    />
                    <CardsTable cards={this.state.cards}
                                qty={this.state.qty}
                                itemsCountPerPage={this.state.itemsCountPerPage}
                                activePage={this.state.activePage}
                                sortByHeader={this.sortByHeader.bind(this)}
                                paginationOnChangeHandler={this.paginationOnChangeHandler.bind(this)}
                                removeCard={this.removeCard.bind(this)}
                    />
                </div>
            </div>
        );
    }
}