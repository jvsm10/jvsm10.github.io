var newTransitions;  
var newStates;
var newAcceptStates;

function AFNDtoAFD(transitions,estadosfinais){


newTransitions = {};
newStates = {};
newAcceptStates = [];
var caracteres = [];

$.each(transitions, function(state){
    $.each(transitions[state], function(caracter){
        if(!caracteres.includes(caracter) || !caracteres) caracteres.push(caracter);
    });
});



 var arr = Object.keys(transitions);
 var continua = true;  
 let temp;
 this.newStates['q0'] = ['q0'];

var c = 0; //index carcteres
var arrNew = null;
var q;
var estadosTransitivos = Object.keys(transitions);
for(var i = 0; i< Object.keys(this.newStates).length; i++){ //estados criados

    while(c<caracteres.length){ //caracteres 
    for (var e = 0; e  <  this.newStates['q'+i].length; e++) { //estados q preciso checar
      if(estadosTransitivos.includes(this.newStates['q'+i][e])){ // verifica se existe transição daquele estado q precisa checar
       temp = transitions[ this.newStates['q'+i][e] ][ caracteres[c] ] ;
       if( temp != undefined){
        (arrNew === null) ? arrNew = temp : arrNew = _.union(arrNew,temp);
      }
    }
  }
  if(arrNew != null){
    arrNew = arrNew.sort();
    q = checaNovoEstado(arrNew); //retorna a posicao do novo estado criado, caso nao exista inda
    if(q){
      if(!newTransitions['q'+i]) newTransitions['q'+i] =  {};
        newTransitions['q'+i][caracteres[c]]= [];
        newTransitions['q'+i][caracteres[c]].push(q);
     

      if(verFinais(arrNew,estadosfinais)) this.newAcceptStates.push(q);
    };
  };
  c++;
  arrNew = null;
};
c=0;

};

console.log('NOVOS ESTADOS');
console.log(newStates);
console.log('NOVA TRANSICAO');
console.log(newTransitions);
console.log('ESTADOS FINAIS');
console.log(newAcceptStates);

return(serializeAFNDtoAFD());
};

function checaNovoEstado(arr){
  let temp = Object.values(this.newStates);
  for (var i = 0 ; i < temp.length; i++) {
    if(compare(temp[i],arr)){
      return false;
    }
  }
  this.newStates['q'+i] = arr;
  return 'q'+i;
}

function compare(arr1,arr2){
  if(arr1.length != arr2.length) return false;
  for (let i =  0; i < arr1.length; i++) {
    if(arr1[i] != arr2[i]) return false;
  }
  return true;
}

function verFinais(arr,finais){
  for (var i = 0; i< finais.length; i++) {
    if(arr.includes(finais[i])) return true;
  }
  return false;
}

function serializeAFNDtoAFD() {
      // Converte para um formato serializado

      var model = {};

      model.type = 'AFND';
      model.afnd = {transitions: this.newTransitions, startState: 'q0', acceptStates: this.newAcceptStates};
      model.states = {};
      model.transitions = [];
      $.each(model.afnd.transitions, function(stateA, transition) {
        model.states[stateA] = {};
        $.each(transition, function(character, states) {
          $.each(states, function(index, stateB) {
          model.states[stateB] = {};
          model.transitions.push({stateA:stateA, label:(character), stateB:stateB});
        });
        });
      });
      var i = 1;
      $.each(model.states, function(index) {
       
        if(model.afnd.acceptStates.includes(index)){
          model.states[index].isAccept = true;
        };
          model.states[index].top = 55 + i * 31;
          model.states[index].left = 55 + i * 31;
          i++;
      });
      model.states['q0'] =  {};
            console.log('mode');
      console.log(model);
      return model;

}
// function removeVazios(transitions,estados,estadosfinais,caracteres){
//   var transitionsSemVazio = {};
//   var arr = Object.keys(transitions);
//     var i=0;
//     while(i<estados.length){
//       var prox = transitions[arr[i]][''];
//        if(prox != undefined){

//         for (var j = 0; j < caracteres.length; j++) {
//           transitionsSemVazio[j] = transitions[prox];      
//         }
//       };
//         i++;
//     }


//   console.log(arr);
//   console.log(arr1);
// }
/*
q0: {
  a: [q0, q1, ... ] -> transitions
}

Object.entries retorna a key e value (q0, a)
  
  // NOVOS ESTADOS 
  q0: ['q1','q2']  quais estados esse novo estado foi formado
  
  //
  -----
  Automato convertido
  q0: {
    a: ['q1']
    b: ['q2']
   
  }
--------


*/  

