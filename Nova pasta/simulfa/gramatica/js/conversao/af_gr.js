/**
 * Receber valores por link
 */
function queryString() {  
    var loc = location.search.substring(1, location.search.length);   
    var inf = decodeURI(loc);
    if(inf == "") return;
    console.log(inf);
    var regra = '(afd|afnd)\\-((\\{|\\}|\\d|[a-zA-Z]|\\"|\\:|\\_|\\[|\\]|,)*)\\-\\{(([a-zA-Z]|\\d|,)*)\\}';
    var reg = new RegExp(regra);

    var decode = inf.match(reg);
    console.log(decode);

    var qual = decode[1];
    var transicao = decode[2];
    var finais = decode[4];

    testarchamada(transicao, finais, qual);
}

queryString();

var tabela;

/**
 * Tratar as transicoes
 * @param {afd.transition} transicao 
 */
function testarchamada(transicao, finais, qual){
    var tam = transicao.length;
    var transicao = transicao.substring(16, tam-2);
    
    if(transicao.charAt(2) != '0'){ //INICIAL VAZIO, NAO VALE A PENA
        return "";
    }
    console.log(finais);
    getTransicao(transicao, qual);
    tratarFim(finais);
    preencherTabela();
    criarExpressao();
}

/**
 * Modificar a string para que reste apenas as transicoes,
 * regexp ajudará a encontrar os padrões e em seguida será substituido
 * para que no fim, não reste nada da string de entrada.
 * @param {transicao com string} der 
 */

function getTransicao(der, qual){
    tabela = [];

    der = der.replace(eval('/'+'""'+'/g'),'"_"'); // RETIRAR TODAS AS ASPAS.
    der = der.replace(eval('/'+'"'+'/g'),''); // RETIRAR TODAS AS ASPAS.

    // var regra = "([a-zA-Z]|[0-1])\\:(q\\d\\d*)";
    // var reg = new RegExp(regra);
    
    var respTerminal = [];

    /**
     * while para percorrer todo o automato.
     */
    while(der != ""){
        respTerminal = getTerminal(der);
        der = respTerminal[1]; //segunda posicao, retorna a derivacao
        der = getDerivacao(der.substring(1, der.length), respTerminal[0], qual);
    }
    
}


/**
 * funcao para reconhecer e adicionar a tabela todas as transicoes
 * @param {derivacao} der 
 * @param {terminal} terminal 
 */
function getDerivacao(der, terminal, qual){
    
    switch(qual){
        case 'afnd':
            der = getDerivacaoAFND(der, terminal);
            break;
        case 'afd':
            der = getDerivacaoAFD(der, terminal);
            break;
    }
    return der.substring(1 , der.length); //retirar virgulas ou chaves
}


/**
 * Tratar os automatos deterministicos,
 * letra:naoterminal e 
 */
function getDerivacaoAFD(der, terminal){
    console.log(der);
    while(der.charAt(0) != "}"){
        var regra = "([a-zA-Z]|[0-9])\\:(q\\d\\d*)";
        var reg = new RegExp(regra);
        
        var derivacao = der.match(reg);
        der = der.replace(reg, "");
    
        //ajudar a terminal o laço de repeticao
        if(der.charAt(0) == ',' || der.charAt(0) == '{') der = der.substring(1 , der.length); 
        //console.log("charAt = " + der.charAt(0) + "  " + "gerDerivacao = " + der + "  terminal e nao terminal = " + derivacao[1] + " "+ derivacao[2]);
        
        addTabela(numParaLetra(terminal), (derivacao[1] + numParaLetra(derivacao[2])));
    }
    return der;
}

/**
 * Tratar os colchetes do afnd, letra:[todos os estados separado por ,]
 */
function getDerivacaoAFND(der, terminal){
    while(der.charAt(0) != "}"){
        /**
         * IGUAL AO FND
         */
        var regra = "([a-zA-Z]|[0-9]|_)\\:\\[";
        var reg = new RegExp(regra);
        var letra = der.match(reg);
        if(letra[1] == "_") letra[1] = "";
        der = der.replace(reg, "");
        /**
         * TRATAR COLCHETES
         */
        while(der.charAt(0) != ']'){
            regra = "([a-z][0-9][0-9]*)";
            reg = new RegExp(regra);
            var derivacao = der.match(reg);
            der = der.replace(reg, "");
            if(der.charAt(0) == ',' || der.charAt(0) == '{') der = der.substring(1 , der.length); 
            addTabela(numParaLetra(terminal), (letra[1] + numParaLetra(derivacao[0])));
        }
        der = der.substring(1 , der.length);
    }
    return der;
}

/**
 * Encontrar o terminal, lado esquerdo da gramatica
 * @param {derivacao} der 
 */
function getTerminal(der){
    var regra = "(q\\d\\d*)\\:";
    var reg = new RegExp(regra);
    var terminal = der.match(reg);
    der = der.replace(reg,"");
    return [terminal[1], der];
}


/**
 * ADICIONAR A TABELA.
 * @param {} terminal 
 * @param {*} derivacao 
 */
function addTabela(terminal, derivacao){
    console.log(terminal + "  --> " +derivacao) ;
    tabela.push([terminal, derivacao]);
}


/**
 * Codificar os nomes dos automatos em letras
 * q0 = A, q1 = B, ...
 * @param {} texto 
 */
function numParaLetra(texto){
    if(texto == "_"){
        return "";
    }
    else if(texto.length == 2){
        texto = texto.charAt(1);
        return String.fromCharCode(texto.charCodeAt(0) + 17);
    }else{
      
        if(texto.charAt(1) == "2"){
          texto = texto.charAt(texto.length-1);
            return String.fromCharCode(texto.charCodeAt(0) + 35);
        }else{
          
          	texto = texto.charAt(texto.length-1);
            return String.fromCharCode(texto.charCodeAt(0) + 26);
        }
    }
}

/**
 * Basta adicionar com derivações vazias, ja que representam o fim..,
 * @param {} fim 
 */
function tratarFim(fim){
    fim = fim.split(",");
    if(fim == "") return;
    var tam = fim.length;
    for(var i=0; i<tam ; i++){
        tabela.push([numParaLetra(fim[i]),""]);
    }
}


/**
 * Preencher tabela
 */

 function preencherTabela(){
    var tam = tabela.length;
    for(var i=0; i<tam; i++){
        addTable(tabela[i][0], tabela[i][1]);
    }
 }

 function criarExpressao(){
  var tam = tabela.length;
  var exp="$";
    for(var i=0; i<tam; i++){
      if(i>0){
          if(tabela[i][0]==tabela[i-1][0])
            exp += "|";
          else exp += ")(";
        }
        else exp += "("
          exp += tabela[i][1].substring(0,1);
        if(tabela[i][0] == tabela[i][1].substring(1))
          exp+="*";
    }
    exp += "^";
    console.log(exp);
}