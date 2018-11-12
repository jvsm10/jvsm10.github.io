/**
 * ENVIAR para outra pagina
 * @param {afd.transition} transicao 
 */
function enviarGramatica(obj){
    console.log(obj);
    var enviar = JSON.stringify(obj);
    window.open("../automatos/index.html?"+enviar, '_blank');    
}


/**
 * @description Controi o objeto e passa para o automato
 * 
 */
function graf(){
    switch(getTable()){
        case "GRUD":
            alert("Apenas gramatica regular unitaria a direita!");
            break;
        case "ERROR":
            alert("Algo deu errado! verifique a gramática e tente novamente");
            break;
        case "TRUE":
            contruirObjt();
    }
}
/**
 * Valores para plotar na tela.
 */
var x;
var y;

/**
 * Estruturas auxiliares
 */
var startState;
var acceptStates;
var transitions;
var label;
var states;
var letrasdecode;
var contador;

function init(){
    contador = 0;
    letrasdecode = {};
    startState = "q0";
    acceptStates=[];
    transitions = {};
    label = [];
    states = {};
    x=0;
    y=0;
}

function contruirObjt(){

    var obj = {
        "type": "AFND",
        "afnd": 
            {
                "transitions": transitions,
                "startState": startState,
                "acceptStates": acceptStates
            },
        "states":states,
        "transitions":label
    }
    enviarGramatica(obj);
}
/**
 * Adicionar os elementos da tabela presente na interface a estrutura do JPlumb.
 */
function getTable(){
    init();
    tabelaGramatica = [];
    for(var i =1; i<table.rows.length; i++){
        table.rows[i].classList.remove('selecionado'); 
        var naoTerminal = table.rows[i].cells[0].innerHTML;
        var derivacao = table.rows[i].cells[1].innerHTML;
        //Validação e reconhecimento das entradas 
        var val = validarEntAF(naoTerminal, derivacao);
        
        if(val == "Error")  return "GRUD";  //Não é GRUD

        if(addTabelaGramatica(naoTerminal, derivacao)){ //remove valores iguais
            table.deleteRow(i);
        }else{

            var naoT= decodificarLetra(naoTerminal);
            var ultLetra = derivacao.substring(derivacao.length-1, derivacao.length);
            var ultLetraD = decodificarLetra(ultLetra);
            var letra = derivacao.substring(0,derivacao.length-1);
            
            addState(naoT);
            
            if(val != "Final"){
                if(!possuiNaoTerminal(ultLetra)) return "ERROR";
                addlabel(letra, naoT, ultLetraD);
                addTransition(naoT, letra, ultLetraD);
            }else{
                tratarEstadoFinal(naoT, derivacao);
            }
        }
        
    }
    return "TRUE";
}


/**
 * Validar entrada, uma vez que aceita apenas gramatica regular a direita e também add a um vetor
 * todos os estados finais
 */
function validarEntAF(naoTerminal, derivacao){
    var der = '^((|[a-z]|[0-9]))$';
    var reg = new RegExp(der);
    if(reg.test(derivacao)){
        return ("Final");
    }else{
        der = '^((|[a-z]|[0-9])[A-Z])$';
        reg = new RegExp(der);
        if(!reg.test(derivacao)) return ("Error");

    }
}


/**
 * Decodificar os nomes dos automatos em letras
 * q0 = A, q1 = B, ...
 * @param {} texto 
 */
function decodificarLetra(texto){
    console.log(letrasdecode[texto]);
    if(letrasdecode[texto]  == undefined){
        letrasdecode[texto] = {};
        letrasdecode[texto] = contador;
        contador++;
    }
    return "q"+letrasdecode[texto];
}

/**
 * Estados finais serão decrementados,..
 * 
 */
function tratarEstadoFinal(naoT, derivacao){
    var estado = "q"+contador;
    addEstado(estado);
    addState(estado);
    addlabel(derivacao, naoT, estado);
    addTransition(naoT, derivacao, estado);
    contador++;
}


function possuiNaoTerminal(naoT){
    for(var i=1; i<table.rows.length;i++){
        console.log(naoT +" ====" +table.rows[i].cells[0].innerHTML );
        if(naoT == table.rows[i].cells[0].innerHTML){
            return true;
        }
    }
    return false;
}

/**
*   LIXO
*/
//function decodificarLetra(texto){
//     if(texto == ""){
//         return "ϵ";
//     }
//     else if(texto.length == 1){
//         return "q"+String.fromCharCode(texto.charCodeAt(0) - 17);
//     }else{
//         if(texto.charAt(0) >= 75 && texto.charAt(0) <= 85){
//             texto = String.fromCharCode(texto.charCodeAt(0) - 35);
//             return ("q2"+texto);
//         }else{
//              texto = String.fromCharCode(texto.charCodeAt(0) - 26);
//             return ("q1"+texto);
//         }
//     }
// }