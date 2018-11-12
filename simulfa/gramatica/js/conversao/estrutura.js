
/**
 * @description Adicionar  transições
 */
function addTransition(stateA, character, stateB) {
    if (!transitions[stateA]) {transitions[stateA] = {};}
    if (!transitions[stateA][character]) {transitions[stateA][character] = [];}
    transitions[stateA][character].push(stateB);
    //if(!states[stateA]){states[stateA] = {};}
};



/**
 * Adcionar ao objeto que plotará os estados na tela.
 */
function addState(state){
    if(state == "q0"){ // Q0 DEVE SER VAZIO
        console.log(acceptStates);
        if(procurarFim(state)){ //ACHO QUE NUNCA CAIRÁ NESSE CONDIÇÃO, MAS PARA GARANTIR...
            states[state] ={
                "isAccept":true,
            }
        }else states[state]={};
    }else{
            //estados restantes
        if(procurarFim(state)){
            states[state] ={
                "isAccept":true,
                "top": x,
                "left": y
            }
        }else{
            states[state] ={
                "top": x,
                "left": y
            }
            
        }   
    }   

    funcao();
}


/**
 * Representa as transições dos automatos que serão plotados plotados,
 */
function addlabel( caracter, stateA, stateB){
    if(caracter == ""){
        caracter = "ϵ";
    }
    label.push({
        "stateA":stateA,
        "label": caracter,
        "stateB":stateB
    })
}


function addEstado(state){
    if(!procurarFim(state)){
        acceptStates.push(state);
    }
}

/**
 * caso o estado seja final, o valor retornado será true.
 * caso contrario, false.
 */
function procurarFim(state){
    for(var i=0; i< acceptStates.length; i++){
        if(acceptStates[i] == state){
            return true;
        }
    }
    return false;
}

/**
 * Responsavel pelo incremento dos valores de x e y que indicam onde os valores serão plotadosna tela.
 */
function funcao(){
    x=x+55;
    y=y+55;
}

