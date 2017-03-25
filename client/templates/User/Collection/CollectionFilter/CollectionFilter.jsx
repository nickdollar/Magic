import React from 'react' ;

export default class CollectionFilter extends React.Component {
    constructor(){
        super();

    }

    render(){
        return(
            <div className="CollectionFilterComponent">
                <h3>Filters</h3>
                <div className="form-group">
                    <label htmlFor="name">Cards Starting With:</label>
                    <input onChange={(event)=>this.props.updateCardsStartingWith(event.target)} type="text" className="form-control" id="name" placeholder="Cards Starting With:"/>
                </div>
                <div>
                    {this.props.filter.colors.map((color, index)=>{
                        return <label key={color.value} className="checkbox-inline">
                                <input type="checkbox" role="checkbox" value={color.value} onChange={(temp)=>this.props.updateColors(temp.target, index)} checked={color.checked}/>
                                <span className={`mana ${color.css}`}></span>
                            </label>
                    })}
                    <label className="checkbox-inline">
                        <input type="checkbox" role="checkbox"
                               onChange={(temp)=>this.props.updateColorless(temp.target)}
                               checked={this.props.filter.colorless}/>Colorless
                    </label>
                </div>
                {this.props.filter.colorsQueryType.map((containMatch, index)=>{
                    return  <div key={containMatch.value} className="radio">
                        <label><input type="radio" name="optionsRadio" value={containMatch.value} onChange={(element)=>this.props.updateColorsQueryType(element.target, index)} checked={containMatch.checked} />{containMatch.text}</label>
                    </div>
                })}
                <div className="">
                <button className="btn btn-default" onClick={this.props.submitFilter}>Update/Refresh</button>
                </div>
            </div>
        );
    }
}