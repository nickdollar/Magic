// import { Cookies } from 'meteor/ostrio:cookies';


var cookies = new Cookies();

var cookiesArray = ["distance", "positionOption", "ZIP", "state"];

cookiesArray.forEach((item)=>{
    Session.set(item, cookies.get(item));
});