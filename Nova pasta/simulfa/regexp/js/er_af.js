/**
 * ENVIAR para outra pagina
 * @param {afd.transition} transicao 
 */
function enviarER(obj){
    console.log(obj);
    var enviar = JSON.stringify(obj);
    window.open("../automatos/index.html?"+enviar, '_blank');    
}


/**
 * @description Controi o objeto e passa para o automato
 * 
 */
function graf(automato){
    getER(automato);
    contruirObjt();
}
/**
 * Valores para plotar na tela.
 */
var lt;
var tp;

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
    lt=0;
    tp=0;
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
    enviarER(obj);
}
/**
 * Adicionar os elementos da estrutura gerada anteriormente a estrutura do JPlumb.
 */
function getER(automato){
    init();
    var neg=0;
    var aux=0;
    if(automato[0].length <= 1){
        aux = 1;
        neg = -1;
    }
    for(var i = aux; i<automato.length; i++){
        var temp = i+neg;
        console.log(automato[i][0].final);
        addState("q"+temp,automato[i][0].final);
        addEstado("q"+temp,automato[i][0].final);
        for(var j = 1; j<automato[i].length;j++){
            if(automato[i][j].dest != -1){
                var dest = automato[i][j].dest + neg;
                addlabel(automato[i][j].trans,"q"+temp,"q"+dest);
                addTransition("q"+temp,automato[i][j].trans,"q"+dest);
            }
        }
    }
}