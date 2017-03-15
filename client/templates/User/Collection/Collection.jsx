import React from 'react' ;
import AddCardToCollection from './AddCardToCollection/AddCardToCollection.jsx';
import CardsTable from './CardsTable/CardsTables.jsx';
import CollectionFilter from "./CollectionFilter/CollectionFilter.jsx";

export default class Collection extends React.Component {
    constructor() {
        super();
        this.state = {
            qty: 0,
            itemsCountPerPage : 10,
            activePage : 1,
            cards: [],
            filter: {
                colors: [
                    {value: "B", css: "sb", checked: true},
                    {value: "G", css: "sg", checked: true},
                    {value: "R", css: "sr", checked: true},
                    {value: "U", css: "su", checked: true},
                    {value: "W", css: "sw", checked: true},
                ],
                colorless: true,
                colorsQueryType : [
                    {value: "one", text: "Cards with at least one.", checked: true},
                    {value: "only", text: "Cards only Contains", checked: false},
                    {value: "all", text: "Each Card Contains all.", checked: false}
                ]
            },
            sort : [{key : "_id", value : 1}],
            page : 0
        }
    }

    getSort(){
        var sort = this.state.sort.concat();
        var sortObj = {};
        for(var i = 0; i < sort.length; i++){
            sortObj[sort[i].key] = sort[i].value;
        }
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
            $match = {"colors" : {$in : colors}};
        }else if(colorsQueryType=="only") {

            var allColors = ["B","G", "R", "U", "W"];
            var difference = _.difference(allColors, colors);
            $match = {$and : [{"colors" : {$nin : difference}}, {colors : {$exists : true}}]};
        }else{
            $match = {"colors" : {$all : colors}};
        }
        if(this.state.filter.colorless){
            $match = Object.assign({}, {$or : [$match, {colors : {$exists : false}}]})
        }
        return $match;
    }

    updateColorless(element){
        var filter = Object.assign({}, this.state.filter);
        filter.colorless = element.checked;
        this.setState({filter : filter});
    }

    getCollectionCards(){
        var sort = this.getSort();
        var colorsMatch = this.getColors();
        var page = this.getActivePage();
        var itemsCountPerPage = this.getItemsCountPerPage();
        Meteor.call("getCollectionCards", colorsMatch, sort, page, itemsCountPerPage, (err, {qty, cards})=>{
            this.setState({cards : cards, qty : qty});
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
        var sort = Object.assign(this.state.sort);
        if(sort[value] == 1){
            sort[value] = -1;
        }else{
            sort[value] = 1;
        }
        this.setState({sort : sort});
    }

    paginationOnChangeHandler(activePage){
        this.state.activePage = activePage;
        this.setState({activePage : activePage});
        this.getCollectionCards();

    }

    render(){
        return(
            <div className="CollectionComponent">
                <button onClick={()=>Meteor.call("importCollectionMethod")}> import collection</button>
                <AddCardToCollection/>
                <CollectionFilter filter={this.state.filter}
                                  updateColors={this.updateColors.bind(this)}
                                  submitFilter={this.submitFilter.bind(this)}
                                  updateColorsQueryType={this.updateColorsQueryType.bind(this)}
                                  updateColorless={this.updateColorless.bind(this)}

                />
                <CardsTable cards={this.state.cards}
                            qty={this.state.qty}
                            itemsCountPerPage={this.state.itemsCountPerPage}
                            activePage={this.state.activePage}
                            sortByHeader={this.sortByHeader.bind(this)}
                            paginationOnChangeHandler={this.paginationOnChangeHandler.bind(this)}

                />
            </div>
        );
    }
}