// import { Cookies } from 'meteor/ostrio:cookies';


var cookies = new Cookies();

var cookiesArray = [{ name : "distance", default : "25"}, { name : "positionOption", default : "GPS"}, { name : "ZIP", default : ""}, { name : "state", default : ""}];

cookiesArray.forEach((item)=>{
    if(cookies.get(item.name)){
        Session.set(item.name, cookies.get(item.name));
    }else{
        Session.set(item.name, item.default);
    }
});

