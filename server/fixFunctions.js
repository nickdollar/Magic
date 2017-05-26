import Entities from "entities";

fixHtmlFromCherrios = (string)=>{
    if(!string) return string;
    string = Entities.decodeHTML(string);
    string = string.trim()
    return string;
}