
/**
 * ENVIAR para outra pagina
 * @param {afd.transition} transicao 
 */
function testarchamada(transicao, finais, qual){

    var enviar = qual+"-"+transicao+"-{"+finais+"}";
    window.open("../gramatica/index.html?"+enviar, '_blank');    

}
function testarchamadaERT(transicao, finais, qual){

    var enviar = qual+"-"+transicao+"-{"+finais+"}";
    //window.location = "../regexp/index.html?"+enviar; 
    window.open('../regexp/index.html?'+enviar, '_blank');   

}