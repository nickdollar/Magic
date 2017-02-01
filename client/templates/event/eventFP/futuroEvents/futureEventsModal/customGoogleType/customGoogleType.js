Template.customGoogleType.onCreated(function(){
    
});


Template.customGoogleType.onRendered(function(){
    
    var pac_input = document.getElementsByClassName('js-autocomplete')[0];
    var _addEventListener = (pac_input.addEventListener) ? pac_input.addEventListener : pac_input.attachEvent;

    function addEventListenerWrapper(type, listener) {
        // Simulate a 'down arrow' keypress on hitting 'return' when no pac suggestion is selected,
        // and then trigger the original listener.
        if (type == "keydown") {
            var orig_listener = listener;
            listener = function(event) {
                var suggestion_selected = $(".pac-item-selected").length > 0;
                if (event.which == 13 && !suggestion_selected) {
                    var simulated_downarrow = $.Event("keydown", {
                        keyCode: 40,
                        which: 40
                    });
                    orig_listener.apply(pac_input, [simulated_downarrow]);
                }

                orig_listener.apply(pac_input, [event]);
            };
        }

        _addEventListener.apply(pac_input, [type, listener]);
    }

    pac_input.addEventListener = addEventListenerWrapper;
    pac_input.attachEvent = addEventListenerWrapper;
});


initAutocomplete = function() {
    autocomplete = new google.maps.places.Autocomplete(
        (document.getElementsByClassName('js-autocomplete')[0]),
        {types: ['geocode']});
    // When the user selects an address from the dropdown, populate the address
    // fields in the FormValidate.
    // autocomplete.addListener('place_changed', fillInAddress);
}

returnLocation = function() {
    // Get the place details from the autocomplete object.\
    var place = autocomplete.getPlace();


    if(!place){
        return
    }
    var componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'long_name',
        postal_code: 'short_name'
    };
    var location = {};
    for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
            if(addressType == "street_number"){
                location.streetNumber = place.address_components[i][componentForm[addressType]];
            }else if (addressType == "route"){
                location.street = place.address_components[i][componentForm[addressType]];
            }else if (addressType == "locality"){
                location.city = place.address_components[i][componentForm[addressType]];
            }else if (addressType == "administrative_area_level_1"){
                location.state = place.address_components[i][componentForm[addressType]];
            }else if (addressType == "country"){
                location.country = place.address_components[i][componentForm[addressType]];
            }else if (addressType == "postal_code"){
                location.postalCode = place.address_components[i][componentForm[addressType]];
            }
        }
    }
    var coords = {};
    coords.lat = place.geometry.location.lat();
    coords.lng = place.geometry.location.lng();
    location.coords = coords;

    return location;
}

AutoForm.addInputType("googlePlaces", {
    template: "customGoogleType",
    valueOut: function() {
        console.log(returnLocation());
        return returnLocation();
    }
});

