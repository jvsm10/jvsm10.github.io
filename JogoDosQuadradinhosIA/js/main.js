// inicia o jogo
document.addEventListener("DOMContentLoaded", game);

function game() {

// Estrutura dos quadrados
var parentX = document.querySelector(".tiles").clientHeight;
var baseDistance = 34.5;
var tileMap = {
  1: {
    tileNumber: 1,
    position: 1,
    top: 0,
    left: 0
  },
  2: {
    tileNumber: 2,
    position: 2,
    top: 0,
    left: baseDistance * 1
  },
  3: {
    tileNumber: 3,
    position: 3,
    top: 0,
    left: baseDistance * 2
  },
  4: {
    tileNumber: 4,
    position: 4,
    top: baseDistance,
    left: 0
  },
  5: {
    tileNumber: 5,
    position: 5,
    top: baseDistance,
    left: baseDistance
  },
  6: {
    tileNumber: 6,
    position: 6,
    top: baseDistance,
    left: baseDistance * 2
  },
  7: {
    tileNumber: 7,
    position: 7,
    top: baseDistance * 2,
    left: 0
  },
  8: {
    tileNumber: 8,
    position: 8,
    top: baseDistance * 2,
    left: baseDistance
  },
  empty: {
    position: 9,
    top: baseDistance * 2,
    left: baseDistance * 2
  }
}

var tileMapFinal = tileMap;
var tileMapAux;

// mapa de movimentação dos quadrados
function movementMap(position) {
  if (position == 9) return [6, 8];
  if (position == 8) return [5, 7, 9];
  if (position == 7) return [4, 8];
  if (position == 6) return [3, 5, 9];
  if (position == 5) return [2, 4, 6, 8];
  if (position == 4) return [1, 5, 7];
  if (position == 3) return [2, 6];
  if (position == 2) return [1, 3, 5];
  if (position == 1) return [2, 4];
}

// ativa evento dos botões
document.querySelector('#shuffle').addEventListener('click', shuffle , true);
document.querySelector('#solve').addEventListener('click', heuristica1 , true);
document.querySelector('#solve2').addEventListener('click', heuristica2 , true);
document.querySelector('#solve3').addEventListener('click', heuristica3 , true);
document.querySelector('#solve1').addEventListener('click', buscaAleatoria , true);

// pega quadrado clicado
var tiles = document.querySelectorAll('.tile');

// disposição inicial dos quadrados
var delay = -50;
for(var i = 0; i < tiles.length; i++) {
  tiles[i].addEventListener('click', tileClicked ,true );
  var tileId = tiles[i].innerHTML;
  delay += 50;
  setTimeout(setup, delay, tiles[i]);
}

var heuristicas = new Heuristicas();

// pega as propiedades html do quadrado
function setup(tile) {
  var tileId = tile.innerHTML;
  var xMovement = parentX * (tileMap[tileId].left/100);
  var yMovement = parentX * (tileMap[tileId].top/100);
  var translateString = "translateX(" + xMovement + "px) " + "translateY(" + yMovement + "px)"
  tile.style.webkitTransform = translateString;
}

//move o quadrado clicado
function tileClicked(event) {
  var tileNumber = event.target.innerHTML;
  moveTile(event.target);
  var pos = [];
    pos.push(tileMap.empty.position-1);
    for(var i=1;i<=8;i++)
        pos.push(tileMap[i].position-1);
    heuristicas.filltiles(pos);
}

// Move o quadrado para o espaço vazio
function moveTile(tile, recordHistory = true) {
  // Checa se o quadrado pode ser movido
  var tileNumber = tile.innerHTML;
  if (!tileMovable(tileNumber)) {
    console.log("Tile " + tileNumber + " Nao pode ser movido.");
    return;
  }

  // Troca o quadrado com o espaço vazio
  var emptyTop = tileMap.empty.top;
  var emptyLeft = tileMap.empty.left;
  var emptyPosition = tileMap.empty.position;
  tileMap.empty.top = tileMap[tileNumber].top;
  tileMap.empty.left = tileMap[tileNumber].left;
  tileMap.empty.position = tileMap[tileNumber].position;

  var xMovement = parentX * (emptyLeft/100);
  var yMovement = parentX * (emptyTop/100);
  var translateString = "translateX(" + xMovement + "px) " + "translateY(" + yMovement + "px)"
  tile.style.webkitTransform = translateString;

  tileMap[tileNumber].top = emptyTop;
  tileMap[tileNumber].left = emptyLeft;
  tileMap[tileNumber].position = emptyPosition;
}


// Determina se o quadrado pode ser movido
function tileMovable(tileNumber) {
  var selectedTile = tileMap[tileNumber];
  var emptyTile = tileMap.empty;
  var movableTiles = movementMap(emptyTile.position);

  if (movableTiles.includes(selectedTile.position)) {
    return true;
  } else {
    return false;
  }
}

  function checkSolution() {
    if (tileMap.empty.position !== 9) return false;

    for (var key in tileMap) {
      if ((key != 1) && (key != "empty")) {
        if (tileMap[key].position < tileMap[key-1].position) return false;
      }
    }
    return true;
  }

  // embaralha os quadrados
shuffleTimeouts = [];
  function shuffle() {
    var num = document.getElementById('shufflenum').value;
    var tilesTiles = document.querySelectorAll('.tile');
    var shuffleDelay = 200;
    shuffleLoop();

    var shuffleCounter = 0;
    while (shuffleCounter < num-1) {
      shuffleDelay += 200;
      if(document.getElementById("anima").checked != true)
        shuffleLoop();
      else
        shuffleTimeouts.push(setTimeout(shuffleLoop, shuffleDelay));
      shuffleCounter++;
    }
  }

  var lastShuffled;

  function shuffleLoop() {
    var emptyPosition = tileMap.empty.position;
    var shuffleTiles = movementMap(emptyPosition);
    var tilePosition = shuffleTiles[Math.floor(Math.floor(Math.random()*shuffleTiles.length))];
    var locatedTile;
    for(var i = 1; i <= 8; i++) {
      if (tileMap[i].position == tilePosition) {
        var locatedTileNumber = tileMap[i].tileNumber;
        locatedTile = tiles[locatedTileNumber-1];
      }
    }
    if (lastShuffled != locatedTileNumber) {
      moveTile(locatedTile);
      lastShuffled = locatedTileNumber;
    } else {
      shuffleLoop();
    }

  }

    //faz os movimentos da busca aleatoria
  function buscaAleatoria(){
    var emptyPosition;
    emptyPosition = tileMap.empty.position;
    var aux=0;
    var aux2;
    var p=0;
    var move=0;
    while (!checkSolution()) {
      var j=1;
      for(var i=1;i<=8;i++){
        if(tileMovable(tileMap[i].tileNumber) && move != tileMap[i].tileNumber){
          var s = Math.floor(Math.floor(Math.random()*(10)));
          if(s<5){
            aux = i;
            break;
          }
          aux2 = i;
        }
        
      } 
        p++;
        if(aux2 != aux && aux!=0)
          move = aux;
        else move = aux2;
        aux = 0;
       var locatedTileNumber = tileMap[move].tileNumber;
        moveTile(tiles[locatedTileNumber-1], false);
        emptyPosition = tileMap.empty.position;
    }
    document.getElementById("moves").innerHTML = p;
    console.log(p);
  }

// pega o caminho da heuristica 1 e faz os movimento dos quadrados
  function heuristica1(){
    var pos = [];
    pos.push(tileMap.empty.position-1);
    for(var i=1;i<=8;i++)
        pos.push(tileMap[i].position-1);
    heuristicas.filltiles(pos);
    var path = heuristicas.heuristica1();
    console.log(path);
    if(document.getElementById("anima").checked == true){
    for(var i =0;i<path.length;i++){
      var num = path[i];
      setTimeout(moveTile,i*300,tiles[num-1],false);
    }
  }
  else{
    for(var i =0;i<path.length;i++){
      var num = path[i];
      moveTile(tiles[num-1],false);
    }
  }
    document.getElementById("moves").innerHTML = path.length;
  }

// pega o caminho da heuristica 2 e faz os movimento dos quadrados
  function heuristica2(){
    var pos = [];
    pos.push(tileMap.empty.position-1);
    for(var i=1;i<=8;i++)
        pos.push(tileMap[i].position-1);
    heuristicas.filltiles(pos);
    var path = heuristicas.heuristica2();
    console.log(path);
    if(document.getElementById("anima").checked == true){
      for(var i =0;i<path.length;i++){
        var num = path[i];
        setTimeout(moveTile,i*300,tiles[num-1],false);
      }
    }
    else{
      for(var i =0;i<path.length;i++){
        var num = path[i];
        moveTile(tiles[num-1],false);
      }
    }
    document.getElementById("moves").innerHTML = path.length;
  }

// pega o caminho da heuristica 3 e faz os movimento dos quadrados
  function heuristica3(){
    var pos = [];
    pos.push(tileMap.empty.position-1);
    for(var i=1;i<=8;i++)
        pos.push(tileMap[i].position-1);
    heuristicas.filltiles(pos);
    var path = heuristicas.heuristica3();
    console.log(path);
    if(document.getElementById("anima").checked == true){
      for(var i =0;i<path.length;i++){
        var num = path[i];
        setTimeout(moveTile,i*300,tiles[num-1],false);
      }
    }
    else{
      for(var i =0;i<path.length;i++){
        var num = path[i];
        moveTile(tiles[num-1],false);
      }
    }
    document.getElementById("moves").innerHTML = path.length;
  }
}