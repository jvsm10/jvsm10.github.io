/**
 * Modificar a string para que reste apenas as transicoes,
 * regexp ajudará a encontrar os padrões e em seguida será substituido
 * para que no fim, não reste nada da string de entrada.
 * @param {transicao com string} der 
 */

 /**
 * Receber valores por parametros
 */
function queryString() {  
    var loc = location.search.substring(1, location.search.length);   
    var inf = decodeURI(loc);
    if(inf == "") return;
    var regra = '(afd|afnd)\\-((\\{|\\}|\\d|[a-zA-Z]|\\"|\\:|\\_|\\[|\\]|,)*)\\-\\{(([a-zA-Z]|\\d|,)*)\\}';
    var reg = new RegExp(regra);

    var decode = inf.match(reg);

    var qual = decode[1];
    var transicao = decode[2];
    var finais = decode[4];

    testarchamada(transicao, finais, qual);
}

var variavel = queryString();

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
    getTransicao(transicao, qual);
    tratarFim(finais);
    criarExpressao(finais);
}

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
    }
    return der.substring(1 , der.length); //retirar virgulas ou chaves
}


/**
 * Tratar os automatos deterministicos,
 * letra:naoterminal e 
 */
function getDerivacaoAFD(der, terminal){
    while(der.charAt(0) != "}"){
        var regra = "([a-zA-Z]|[0-9])\\:(q\\d\\d*)";
        var reg = new RegExp(regra);
        
        var derivacao = der.match(reg);
        der = der.replace(reg, "");
    
        //ajudar a terminal o laço de repeticao
        if(der.charAt(0) == ',' || der.charAt(0) == '{') der = der.substring(1 , der.length); 
        
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

/*
* Cria uma expressoa regular a partir de um automato finito
* Utiliza algoritmo de Transitive Closure Method
*/

function criarExpressao(fim){
  var n = pegarTam();
  var temp = "";
  var R = Criararray3d(n);
  for(var i=0;i<n;i++){
    for(var j=0;j<n;j++){
      if(i!=j)
        if(pegarTransi(65+i,65+j)!="")
          R[i][j][0] = pegarTransi(65+i,65+j);
        else R[i][j][0] = 'v';
      else if(i==j){
        if(pegarTransi(65+i,65+i)!="")
          R[i][i][0]= String.fromCharCode(1013) + "|" + pegarTransi(65+i,65+i);
        else R[i][i][0] = 'v';
      }
    }
  }
  for(var k=1;k<n+1; k++){
    for(var i=0; i<n; i++){
      for(var j=0; j<n; j++){
        temp = R[i][j][k-1] + "|" + R[i][k-1][k-1]+"("+ R[k-1][k-1][k-1]+")*"+R[k-1][j][k-1];
        R[i][j][k] = simplificarEx(temp);
      }
    }
  }
  var finais=arrumafim(fim);
  var final = "";
  for(var p=0;p<finais.length;p++){
    if(p>0){
      final+="|";
    }
    final += simplificarEx(R[0][finais[p]][n]); 
  }
  document.getElementById("expr").value = "^("+final+")$";
}

function pegarTam(){
  var n=1;
  var tam = tabela.length;
  for(var i=1; i<tam; i++){
    if(tabela[i][0]!=tabela[i-1][0])
      n++;
  }
  return n;
}

function pegarTransi(code1,code2){
  var trans="";
  var aux = 0;
  for(var i=0;i<tabela.length;i++){
    if(String.fromCharCode(code1)==tabela[i][0] && String.fromCharCode(code2)==tabela[i][1].substring(1)){
      if(aux>0 && tabela[i][1]!=""){
      trans+="|";
    }
      trans += tabela[i][1].substring(0,1);
      aux = 1;
    }
  }
  return trans;
}

function Criararray3d(n){
  var r = new Array(n);
  for(var i=0;i<n;i++){
    r[i] = new Array(n);
    for(var j=0; j<n; j++){
        r[i][j] = new Array(n+1);
      }
    }
  return r;
}
/*
* Simplifica a expressão gerada pelo algoritmo anterior
*/

function simplificarEx(final){
  var temp="";
  var flag = 0;
  var flag2 = 1;
  for(var i=0; i<final.length;i++){
    if(final[i] != 'v' && final[i] != String.fromCharCode(1013)){
      temp += final[i];
    }
    else if(final[i] == 'v'){
      while(i<final.length-1 && (final[i+1]!=')' && final[i+1]!='|') || flag2==0){
        if(final[i]=='('){
          flag++;
          flag2=0;
        }
        i++;
        if(flag > 0 && final[i+1]==')'){
          i++;
          flag--;
          if(flag==0)
            flag2++;
        }
      }
      flag=0;
      flag2=1;
    }
    else if(final[i] == String.fromCharCode(1013))
      i++;
  }
  var tam =temp.length;
  if(temp[tam-1]=='|')
    temp = temp.substring(0,tam-1);
  temp+='';
  return temp;
}

function arrumafim(fim){
  var finais = [];
  for(var i=0;i<fim.length;i+=3){
    finais.push(fim[i+1]);
  }
  return finais;
}