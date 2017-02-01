import React from "react";

class GoogleAutocompleteInput extends React.Component{
    constructor() {
        super();
        this.state = {
            inputValue : "",
            optionsAddress : [],
            location : {},
            selectedAddress : ""
        }
    }

    isValid() {
        var input = this.refs["input"];
        var error = this.refs["error"];
        if (!this.state.location.formatedAddress) {
            input.classList.add('error');
            error.textContent = "Address Neeeded";
            return false;
        }
        else {
            input.classList.remove('error');
            error.textContent = "";
        }
        return true;
    }

    getCorrectedValue(){
        return {location : this.state.location};
    }

    clearInput(){
        this.setState({
            inputValue: "",
            optionsAddress: [],
            location: {},
            selectedAddress: ""
        })
    }

    handleChange(e){
        this.setState({inputValue : e.target.value});
    }

    componentDidMount() {
        if (this.props.onComponentMounted) {
            this.props.onComponentMounted(this);
        }

        var input = this.refs["input"];
        this.state.autocomplete = new google.maps.places.Autocomplete(input);

        this.state.autocomplete.addListener('place_changed', ()=> {
            var place = this.state.autocomplete.getPlace();
            if (!place) {
                return
            }
            if(!place.address_components){


                geocoder = new google.maps.Geocoder();
                //
                geocoder.geocode({address : place.name}, (result, status)=>{
                    if(result.length == 1){
                        this.setChooseComponents(result[0]);
                    }else{
                        this.setState({location : {}, optionsAddress : result});
                    }
                });
                this.isValid();
                return;
            }

            this.setChooseComponents(place);
        });
    }

    selectedFromOptions(e){
        var place = this.state.optionsAddress.find((obj)=>{
            return e.target.value == obj.place_id;
        })

        this.setChooseComponents(place);
    }

    setChooseComponents(place){

        var location = {};

        var componentForm = {
            street_number: 'short_name',
            route: 'long_name',
            locality: 'long_name',
            administrative_area_level_1: 'short_name',
            country: 'long_name',
            postal_code: 'short_name'
        };

        for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            if (componentForm[addressType]) {
                if (addressType == "street_number") {
                    location.streetNumber = place.address_components[i][componentForm[addressType]];
                } else if (addressType == "route") {
                    location.street = place.address_components[i][componentForm[addressType]];
                } else if (addressType == "locality") {
                    location.city = place.address_components[i][componentForm[addressType]];
                } else if (addressType == "administrative_area_level_1") {
                    location.state = place.address_components[i][componentForm[addressType]];
                } else if (addressType == "country") {
                    location.country = place.address_components[i][componentForm[addressType]];
                } else if (addressType == "postal_code") {
                    location.postalCode = place.address_components[i][componentForm[addressType]];
                }
            }
        }

        location.coords = {type : "Point", coordinates : [place.geometry.location.lng(), place.geometry.location.lat()]};
        location.formatedAddress = place.formatted_address;
        this.state.location = location;
        this.state.inputValue = location.formatedAddress;
        this.state.optionsAddress = [];
        this.isValid();
        this.forceUpdate();
    }


    render() {
        var optionsAddress;
        if(this.state.optionsAddress.length){
            optionsAddress = <div>
                <div>Choose From List Bellow</div>
                {this.state.optionsAddress.map((mapsAddress)=>{
                    return <div key={mapsAddress.place_id}><button value={mapsAddress.place_id} className="btn btn-xs" onClick={this.selectedFromOptions.bind(this)}>choose</button>{mapsAddress.formatted_address}</div>
                })}
            </div>
        }
        var selectedAddress;


        if(this.state.location.formatedAddress){
            selectedAddress = <div ref={"selectedAddress"}>Selected Address: {this.state.location.formatedAddress}</div>
        }

        return (
            <div className="form-group">
                <label> Address: (Pick from suggestions) </label>
                <input ref={"input"}
                       value={this.state.inputValue}
                       className='form-control'
                       onChange={this.handleChange.bind(this)}
                />
                {selectedAddress}
                {optionsAddress}
                <span ref="error" className="error"></span>
            </div>
        )
    }
}

export default GoogleAutocompleteInput;