/**
 * Receber valores por link
 */
function queryString() {  
    var loc = location.search.substring(1, location.search.length);   
    var inf = decodeURI(loc);
    console.log(JSON.parse(inf));
    return inf;

}


//queryString();