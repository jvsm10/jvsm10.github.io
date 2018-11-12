var inc=0;
var temp2;

/*
cria os estados de acordo com a expressão reular e suas respectivas transições
Essa função gera um vetor de objetos com a estrutura necessária para a criação do automato
*/

function converter2automato(entrada){
	var posleitura = 0;
	var iniestado = [];
	iniestado.push({trans:'',dest:-1,final:true,pos:inc});
	inc++;
	var estadoatu = iniestado;
	var automato = [];
	automato.push(iniestado);
	while(posleitura < entrada.length){
		if(entrada[posleitura]=='('){
			var nova = leparenteses(entrada, posleitura+1); //elimina parenteses
			var autrec = [];
			autrec = converter2automato(nova); //cria um automato para a expressao entre parentes
			posleitura += nova.length + 2;
			var terminal = recuperarfinal(autrec); //estado final
			if(entrada[posleitura] == '*'){
				terminal.push({trans:'',dest:estadoatu[0].pos,final:terminal[0].final,pos:terminal[0].pos});
				estadoatu.push({trans:'',dest:terminal[0].pos-1,final:estadoatu[0].final,pos:estadoatu[0].pos});
				posleitura++;
			}
			estadoatu[0].final = false;
			estadoatu  = terminal;
			automato = mergestados(automato,autrec); //junta os dois automatos

			continue;
		}
		if(entrada[posleitura] == '|'){ //atualiza os estados para um "ou"
			iniestado = estadoatu = pipe(iniestado,automato);
			automato = temp2;
		}
		else if (entrada[posleitura+1] == '*') { //cria uma transição para o propio estado atual
			estadoatu.push({trans:entrada[posleitura],dest:estadoatu[0].pos,final:estadoatu[0].final,pos:estadoatu[0].pos})
			posleitura++;
		}
		else {
			var novoe = [];
			novoe.push({trans:'',dest:-1,final:true,pos:inc});
			inc++;
			estadoatu[0].final = false;
			estadoatu.push({trans:entrada[posleitura],dest:novoe[0].pos,final:estadoatu[0].final,pos:estadoatu[0].pos});
			estadoatu=novoe;
			automato.push(novoe);
		}
		posleitura++;
	}
	return automato;
}


function leparenteses(entrada,i){
	var atual = '';
	var cont = 1;
	var nova = '';
	while(true){
		atual = entrada[i];
		i++;
		if(atual == '(')
			cont++
		else if(atual == ')')
			cont--;
		if(cont == 0)
			return nova;
		nova+=atual;
	}
}


function juntarini(estatu,autrec){
	var inicial = autrec[0];
	var tam = inicial.length;
	for(var i=0; i<tam;i++){
		if(inicial[i].dest == 0){
			var tran = {trans:'',dest: estatu[0].pos,final:estatu[0].final,pos:estatu[0].pos};
			estatu.push(tran);
		}
		else{
			var tran = {trans:inicial[i].trans,dest:inicial[i].dest, final: estatu[0].final, pos: estatu[0].pos};
			estatu.push(tran);
		}
	}
	for(var i=0; i<autrec.length;i++){
		var tam = autrec[i].length;
		var temp = autrec[i];
		if(autrec[i] != null){
		for(var j=0; j<tam; i++){
			if(temp[j].dest == 0){
				temp[j].dest = estatu[0].pos;
			}
		}
		autrec[i] = temp;
	}
	}
	var temp = autrec.shift();
	return temp;
}

function recuperarfinal(autrecu){
	var tam = autrecu.length;
	for(var i=tam-1; i>=0; i--){
		var e = autrecu[i];
		if(e[0].final==true)
			return e;
	}
	return null;
}

function mergestados(automato,autrec){
	for(var i=0; i<autrec.length; i++){
		 automato.push(autrec[i]);
	}
	//console.log(automato);
	return automato;
}

function pipe(iniestado,automato){
	var novo = [];
	novo.push({trans:'',dest:-1,final:true,pos:inc});
	inc++;
	iniestado.push({trans:'',dest:novo[0].pos,final:iniestado[0].final,pos:iniestado[0].pos})
	automato.push(novo);
	temp2 = automato;
	return novo;
}

function juntarfinais(automato){
	var cont =0;
	for(var i=0;i<automato.length;i++){
		if(automato[i][0].final == true)
			cont++;
	}
	if(cont==1)
		return;
	var novofinal = [];
	novofinal.push({trans:'',dest:-1,final:true,pos:inc});
	inc++;
	for(var i=0;i<automato.length;i++){
		if(automato[i][0].final == true){
			automato[i][0].final = false;
			automato[i].push({trans:'',dest:novofinal[0].pos,final:automato[i][0].final,pos:automato[i][0].pos});
		}
	}
	automato.push(novofinal);
	return automato;
}

