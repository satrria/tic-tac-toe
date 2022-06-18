var playState = true;
var player;
var comp;
var difficulty;
var playerType;
var tie = 0;
var playCount = 0;
var grid = [['','',''],
            ['','',''],
            ['','','']]
var Winner;
var n;
$(document).ready(function(){
  //Welcome Screen.
  setTimeout(function(){
    $("#welcomeScreen").animate({opacity: 0},2000,function(){
      $('#welcome').html('Tic-Tac-Toe');
      $(this).animate({opacity: 0.9},2000,function(){
        $(this).animate({opacity: 0},2000,function(){
          $("#welcomeScreen").css('z-index','-2');
          $("#notificationForm").animate({opacity: 0.9},1000,);
        }) 
      })      
    });
  },1000);
  
  //Submit the game setting.Obtaining settings data.
  $('#btnSubmit').on('click',function(){
    getData();
    $("table").animate({opacity: 1},2000,);    
  });
  
  //Reset Game.
  $('#reset').on('click',function(){
    resetGame();
    $("#notificationForm").css('z-index','1');
    $("#notificationForm").animate({opacity: 0.9},1000,);
    $("#reset").css('visibility','hidden');
    $("table").animate({opacity: 0},500,);
  });
  
  //Start the gameplay.  
  $('td').on('click',function(event){
    //Taking the td id on click.
    var x = '#' + (event.target.id);   
    if (($(x).text() == ' ') && (playState == true)){
        //Switching to next player(Avoiding a player playing many times in a row)
        playState = !playState;
        //Updating the UI accordingly.
        $(x).text(player);
        //Updating the grid accordingly.
        grid[x.charAt(2)][x.charAt(3)] = player;
        //check game status on each step.
        var state = checkGameState(grid);
        if (state != false){
          $(n.toString()).css(neon);
          setTimeout(function(){xtz(state);},500);  
        }else if (state == false){
          //Select next move based on the one/two player setup.
          if (playerType == 'Two'){
            if (player == 'X'){player = 'O'}else if (player == 'O'){player = 'X'};
            if (tie != -1){playState = !playState;};
          }else if (playerType == 'One'){
              playCount += 1;
                if (difficulty == 'Easy'){
                  setTimeout(dumbAI,1000);  
                }else if (difficulty == 'Hard'){
                  setTimeout(expertAI,1000);
                } 
          }
        }      
    }      
  })  
});

function dumbAI() {
      
    //Generate random TD ids - Dumb AI :)
      if ((playCount < 9) &&(playState == false)){
        
          while (true) {
            var a = '#c' + (Math.floor(Math.random() * 3)).toString() + (Math.floor(Math.random() * 3)).toString();
            if ($(a).text() == ' '){            
                $(a).text(comp);
                grid[a.charAt(2)][a.charAt(3)] = comp;
                var state = checkGameState(grid);
                if (state != false){
                  $(n.toString()).css(neon);
                  setTimeout(function(){xtz(state);},500);     
                } 
                playCount += 1;
                break;
            }
          }
        playState = !playState;
       }
}


//Expert AI.
function expertAI(){
  var gridArray= minmax(grid,0,comp);
  var gridLocation = ('#c' + gridArray[0] + gridArray[1]);
  $(gridLocation).text(comp);
  grid[gridArray[0]][gridArray[1]] = comp;
  var state = checkGameState(grid);
  if (state != false){
    $(n.toString()).css(neon);
    setTimeout(function(){xtz(state);},500); 
  }
  playState = !playState;
}

//Minmax algorithm
function minmax(newGrid,depth,playTurn){
  const gameState = checkGameState(newGrid);
  
  // console.log(gameState);
  if (gameState == false){
    const values = [];    
    for(var i = 0; i < 3; i++){      
        for(var j = 0; j < 3; j++){
          const gridCopy = _.cloneDeep(newGrid);
          if (gridCopy[i][j] !== '') continue;
            gridCopy[i][j] = playTurn;
            const value = minmax(gridCopy, depth+1 , (playTurn === player) ? comp : player);
            values.push({
              score : value,
              location : [i,j]
            });
          
        }
     }
     if (playTurn === comp){
       const max = _.maxBy(values, (v) =>{
         return v.score;
       });       
       if (depth === 0){
         return max.location;         
       }else{
         return max.score;
       }
       
     }else{
       const min = _.minBy(values, (v) =>{
         return v.score;
       });
       // console.log(min);
       if (depth === 0){
         return min.location;
       }else{
         return min.score;
       }           
     }
    
  }else if (gameState === player){
    return depth - 100;
  }else if (gameState === comp){
    return 100 - depth;
  }else if (gameState === null){
    return 0;
  }
}

var neon = {'color':'#c0c0c0','text-shadow':'0 0 2px #fff,0 0 8px #228DFF,0 0 15px #228DFF,0 0 25px #228DFF'};

function checkGameState(val){
    // Check Horizontal 
      for(var i = 0; i < 3; i++){
         if (val[i][0] !== '' && val[i][0] === val[i][1] && val[i][0] === val[i][2]){
           n = "#c" + i + "0" + ",#c" + i + "1" + ",#c" + i + "2";
           return val[i][0];
         }
      } 
  
    // Check Vertical 
      for(var j = 0; j < 3; j++){
         if (val[0][j] !== '' && val[0][j] === val[1][j] && val[0][j] === val[2][j]){
           n = "#c" + "0" +  j + ",#c" + "1" + j + ",#c" + "2" + j;
           return val[0][j];
         }
      } 
  
    // Check Diagonal - top left > bottom right
      if (val[0][0] !== '' && val[0][0] === val[1][1] && val[0][0] === val[2][2]){
       n = "#c" + "0" +  "0" + ",#c" + "1" + "1" + ",#c" + "2" + "2"; 
       return val[0][0];
      }
  
    // Check Diagonal - bottom left > top right
      if (val[2][0] !== '' && val[2][0] === val[1][1] && val[2][0] === val[0][2]){
       n = "#c" + "2" +  "0" + ",#c" + "1" + "1" + ",#c" + "0" + "2";  
       return val[2][0];
      }
  
    //The game is On
      for(var i = 0; i < 3; i++){      
        for(var j = 0; j < 3; j++){
          if (val[i][j] == ''){
            return false;
          }          
        }
      }
    
     //Check for tie
      n = 'td';
      return null;
  
}

function resetGame(){
  $('td').css({'color':'#c0c0c0','text-shadow':'none'});
  $("#welcomeScreen").css('z-index','-2');
  playState = true;
  setTimeout(function(){
    $("#welcomeScreen").css('z-index','-2');
  },1500);
  for(var i = 0; i < 3; i++){
    for(var j = 0; j < 3; j++){
      grid[i][j] = '';
      $('td').text(' ');
      playCount = 0;
    }
  }
}

function xtz(val){
  tie = 0;
  if (val === player && playerType == 'One'){
    
    $('#welcome').html('You Won!<br><br> :)');    
    welcome();
  }else if (val === comp && playerType == 'One'){
    
    $('#welcome').html('Oops You Lost!<br><br> :(');    
    welcome();
  }else if (val === null){
    
    $('#welcome').html('It`s a Tie!<br><br> :|');    
    welcome();
  }else if (val === 'X' && playerType == 'Two'){
    
    $('#welcome').html('Player X Won!<br><br> :)');    
    welcome();    
  }else if (val === 'O' && playerType == 'Two')
    
    $('#welcome').html('Player O Won!<br><br> :)');    
    welcome();    
  }

//Obtaining data from game settings.
function getData() {
    playerType = document.querySelector('input[name=player]:checked').value;
    player = document.querySelector('input[name=token]:checked').value;
    difficulty = document.querySelector('input[name=diff]:checked').value;
    if (player == 'X'){
      comp = 'O'
    }else if (player == 'O'){
      comp = 'X'
    }
    $("#notificationForm").animate({opacity: 0},1000,function(){
      $("#notificationForm").css('z-index','-1');
      $("#reset").css('visibility','visible');
    });
}

function welcome(){
  $("table").css('opacity','0');
  $("#welcome").css('font-size','30px');
  $("#welcomeScreen").css({'z-index':'2','opacity':'0','background':'transparent'});
  $("#welcomeScreen").animate({opacity: 0.8},1000,function(){
    setTimeout(function(){
        resetGame();
        $("#welcomeScreen").animate({opacity: 0},500,);      
        setTimeout(function(){
          $("table").animate({opacity: 1},500,);
        },1000);
    },1000);
  });
}