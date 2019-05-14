// objeto contendo as direções 
Direction = {
    LEFT: "left",
    RIGHT: "right",
    UP: "up",
    DOWN: "dow"
  };

  //Inicia as variaveis necessarias para resolução das heuristicas
function Heuristicas() {
    this.tiles = [];
    this.path = [];
    this.lastMove = null;
    for (var i = 0; i < 3; i++) {
        this.tiles.push([]);
        for (var j = 0; j < 3; j++) {
            if (i == 3 - 1 && j == 3 - 1) {
                this.tiles[i].push(0);
            } else {
                this.tiles[i].push(3 * i + j + 1);
            }
        }
    }
  };

  //atualiza os quadrados quando são embaralhados
  Heuristicas.prototype.filltiles = function(pos){
    for(var i=0;i<pos.length;i++){
        switch(pos[i]){
            case 0: this.tiles[0][0] = i;break;
            case 1: this.tiles[0][1] = i;break;
            case 2: this.tiles[0][2] = i;break;
            case 3: this.tiles[1][0] = i;break;
            case 4: this.tiles[1][1] = i;break;
            case 5: this.tiles[1][2] = i;break;
            case 6: this.tiles[2][0] = i;break;
            case 7: this.tiles[2][1] = i;break;
            case 8: this.tiles[2][2] = i;break;
        }
    } 
  };


  // pega a posição do espaço vazio
Heuristicas.prototype.getBlankSpacePosition = function() {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (this.tiles[i][j] == 0) {
                return [i, j];
            }
        }
    }
  };
  
  // faz troca de quadrados
  Heuristicas.prototype.swap = function(i1, j1, i2, j2) {
    var temp = this.tiles[i1][j1];
    this.tiles[i1][j1] = this.tiles[i2][j2];
    this.tiles[i2][j2] = temp;
  }

  // retorna a direção que um quadrado pode ser movido
  Heuristicas.prototype.getMove = function(tile) {
    var blankSpacePosition = this.getBlankSpacePosition();
    var line = blankSpacePosition[0];
    var column = blankSpacePosition[1];
    if (line > 0 && tile == this.tiles[line-1][column]) {
        return Direction.DOWN;
    } else if (line < 3 - 1 && tile == this.tiles[line+1][column]) {
        return Direction.UP;
    } else if (column > 0 && tile == this.tiles[line][column-1]) {
        return Direction.RIGHT;
    } else if (column < 3 - 1 && tile == this.tiles[line][column+1]) {
        return Direction.LEFT;
    }
  };
  
  // move um quadrado e retorna a direção a qual ele se moveu
  Heuristicas.prototype.move = function(tile) {
    var move = this.getMove(tile);
    if (move != null) {
        var blankSpacePosition = this.getBlankSpacePosition();
        var line = blankSpacePosition[0];
        var column = blankSpacePosition[1];
        switch (move) {
        case Direction.LEFT:
            this.swap(line, column, line, column + 1);
            break;
        case Direction.RIGHT:
            this.swap(line, column, line, column - 1);
            break;
        case Direction.UP:
            this.swap(line, column, line + 1, column);
            break;
        case Direction.DOWN:
            this.swap(line, column, line - 1, column);
            break;
        }
        if (move != null) {
            this.lastMove = tile;
        }
        return move;
    }
  };

  // verifica se chegou na solução
  Heuristicas.prototype.checkSolution = function() {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            var tile = this.tiles[i][j];
            if (tile != 0) {
                var line = Math.floor((tile - 1) / 3);
                var column = (tile - 1) % 3;
                if (i != line || j != column) return false;
            }
        }
    }
    return true;
  };

  // retorna os movimentos possiveis
Heuristicas.prototype.getAllowedMoves = function() {
    var allowedMoves = [];
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            var tile = this.tiles[i][j];
            if (this.getMove(tile) != null) {
                allowedMoves.push(tile);
            }
        }
    }
    return allowedMoves;
  };

  // retorna uma copia do estado atual 
Heuristicas.prototype.getCopy = function() {
    var newHeuristicas = new Heuristicas();
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            newHeuristicas.tiles[i][j] = this.tiles[i][j];
        }
    }
    for (var i = 0; i < this.path.length; i++) {
        newHeuristicas.path.push(this.path[i]);
    }
    return newHeuristicas;
  };

  // retorna os filhos de um estado
  Heuristicas.prototype.getChildren = function() {
    var children = [];
    var allowedMoves = this.getAllowedMoves();
    for (var i = 0; i < allowedMoves.length; i++)  {
        var move = allowedMoves[i];
        if (move != this.lastMove) {
            var newInstance = this.getCopy();
            newInstance.move(move);
            newInstance.path.push(move);
            children.push(newInstance);
        }
    }
    return children;
  };

  Heuristicas.prototype.getChildrenAle = function() {
    var children = [];
    var allowedMoves = this.getAllowedMoves();
    for (var i = 0; i < allowedMoves.length; i++)  {
        var move = allowedMoves[i];
        if (move != this.lastMove) {
            var newInstance = this.getCopy();
            newInstance.move(move);
            children.push(newInstance);
        }
    }
    return children;
  };

    // resolve utilizando busca aleatoria
  Heuristicas.prototype.solveBuscaAleatoria = function() {
    var states = [];
    this.path = [];
    states.push({Heuristicas: this, scores: 0});
    var p = 0;
    while (states.length > 0) {
        var state = states.pop().Heuristicas;
        p++;
        if (state.checkSolution()) {
            return state;
        }
        var children = state.getChildrenAle();
        var i = Math.floor(Math.floor(Math.random()*(children.length-1)))
            var child = children[i];
            var f = child.g() + child.h();
            states.push({Heuristicas : child, scores: f});
    }
  };

  // resolve utilizando busca A* e heuristica de nivel 1
  Heuristicas.prototype.solveHeu1 = function() {
      //Heap para ordenar os estados por peso
    var states = new MinHeap(null, function(a, b) {
        return a.scores - b.scores;
    });
    this.path = [];
    states.push({Heuristicas: this, scores: 0});
    while (states.size() > 0) {
        var state = states.pop().Heuristicas;
        if (state.checkSolution()) {
            return state.path;
        }
        var children = state.getChildren();
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var f = child.g() + child.h();
            states.push({Heuristicas : child, scores: f});
        }
    }
  };

  // resolve Utilizando busca A* e heuristica de nivel 2
  Heuristicas.prototype.solveHeu2 = function() {
    var states = new MinHeap(null, function(a, b) {
        return a.scores - b.scores;
    });
    this.path = [];
    states.push({Heuristicas: this, scores: 0});
    while (states.size() > 0) {
        var state = states.pop().Heuristicas;
        if (state.checkSolution()) {
            return state.path;
        }
        var children = state.getChildren();
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var grandsons = child.getChildren(); // pega os netos para avaliaçao de nivel 2
            var f = [];
            for (var j = 0; j < grandsons.length; j++) {
                var grandson = grandsons[j];
                f.push(grandson.g() + grandson.h());
            }
            f = f.sort();
            var score = f[0];
            states.push({Heuristicas : child, scores: score});
        }
    }
  };

  // resolve utilizando busca A* e heuristica 3
  // a heuristica 3 avalia os netos e soma com a avaliação dos filhos 
  Heuristicas.prototype.solveHeu3 = function() {
    var states = new MinHeap(null, function(a, b) {
        return a.scores - b.scores;
    });
    this.path = [];
    states.push({Heuristicas: this, scores: 0});
    while (states.size() > 0) {
        var state = states.pop().Heuristicas;
        if (state.checkSolution()) {
            return state.path;
        }
        var children = state.getChildren();
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var scorechi = child.g() + child.h3();
            var grandsons = child.getChildren();
            var f = [];
            for (var j = 0; j < grandsons.length; j++) {
                var grandson = grandsons[j];
                f.push(grandson.g() + grandson.h3());
            }
            f = f.sort();
            var scoregs = f[0];
            var score =scoregs + scorechi;
            states.push({Heuristicas : child, scores: score});
        }
    }
  };

  Heuristicas.prototype.g = function() {
    return this.path.length;
  };

  // avaliação para as heuristicas 1 e 2
  Heuristicas.prototype.h = function() {
    var count = 0;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            var tile = this.tiles[i][j];
            if (tile != 0) {
                var line = Math.floor((tile - 1) / 3);
                var column = (tile - 1) % 3;
                if (i != line || j != column) count++;
            }
        }
    }    
    return count;
  }

  // avaliação para as heuristicas 3
  //faz a raiz quadrada da soma das distancias de cada quadrado para posição correta 
  //multiplicado pela numero de quadrados na posição correta
  Heuristicas.prototype.h3 = function() {
    var countErr = 0;
    var countDist = 0;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            var tile = this.tiles[i][j];
            if (tile != 0) {
                var line = Math.floor((tile - 1) / 3);
                var column = (tile - 1) % 3;
                countDist += Math.abs(i - line) + Math.abs(j - column);
                if (i != line || j != column) countErr++;
            }
        }
    }    
    return Math.round(Math.sqrt(countDist*countErr));
  }

  // chama a função para busca aleatoria
  Heuristicas.prototype.buscaAleatoria = function(){
    var final = this.solveBuscaAleatoria();
    return final;
}

  // chama a função para heuristica 1 
  Heuristicas.prototype.heuristica1 = function(){
      var path = this.solveHeu1();
      return path;
  }

  // chama a função para heuristica 2
  Heuristicas.prototype.heuristica2 = function(){
    var path = this.solveHeu2();
    return path;
}

  // chama a função para heuristica 3
    Heuristicas.prototype.heuristica3 = function(){
        var path = this.solveHeu3();
        return path;
}


