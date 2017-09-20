/**
 * Created by wmlam on 17/9/2017.
 */
var urltool ={
    extracturl:_extracturl,
    retrievemetadata:_retrievemetadata

};

function _extracturl(text){
    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);
    var matches =text.match(regex);
    if(matches) {
       return matches;
    } else {
       return false;
    }

}
function _retrievemetadata(url){


}