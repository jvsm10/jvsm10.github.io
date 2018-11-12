// const button = document.querySelector('.btn');
// const form   = document.querySelector('.form');
function myFunction() {

  myFunction2();
    var x = document.getElementById("expr");
    var y = document.getElementById("entrada");
    var regExp = new RegExp(x.value);
    var entradas = y.value;
    if (regExp.test(entradas)){
      y.style.color = "white";
        y.style.backgroundColor = "green";
    }
    else {
      y.style.backgroundColor = "red";
      y.style.color = "white";
  }
}
function myFunction2() {
    var x = document.getElementById("expr");
    var y = document.getElementById("entrada2");
    var regExp = new RegExp(x.value);
    var entradas = y.value;
    if (regExp.test(entradas)){
      y.style.color = "white";
        y.style.backgroundColor = "green";
    }
    else {
      y.style.backgroundColor = "red";
      y.style.color = "white";
  }
}

/*
Converte a expressao regular para automato
*/
function retoau(){
  var exp = document.getElementById("expr").value;
  if(exp[0] == '^')
  exp = exp.substring(1,exp.length-1);
  var automato = converter2automato(exp);
  inc = 0;
  graf(automato);
}

