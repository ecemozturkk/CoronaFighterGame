
			var ctx = document.getElementById('ctx').getContext('2d');
            var asiOne = new Image();
            var asiTwo = new Image();
            var asiThree = new Image();
            var asiFour = new Image();
            var background = new Image();
            var kan = new Image();
            var sise = new Image();
            var maskeList = [];
            var virusList = [];
            var siseList = [];
            var maske = new Image();
            var virus = new Image();
            var animation = 0;
            var virusTimer = 0;
            var siseTimer = 0;
            var gameover = false;
            var intervalVar;
            var score = 0;
            var level = 100;
            var paused;
            var virusDrop = [0,50,100,150,200,250,300,350,400,450];
            var maskeObject = {
                'height':70,
                'width':70
            };
            var asi = {
                'x':100,
                'y':350,
                'width':50,
                'height':50,
                'jump':0,
                'onair':false,
                'jumpUnit':5,
                'spd':0,
                'leftPressed':false,
                'rightPressed':false,
                'gravity':10,
                'safe':true
            };
            var virusObject = {
                'height':45,
                'width':45,
                'spd':4
            };
            
            var siseObject = {
                'height':70,
                'width':70,
                'spd':3
            }  ;                                                 
            
            sound = function(src) {
                this.sound = document.createElement("audio");
                this.sound.src = src;
                this.sound.setAttribute("preload", "auto");
                this.sound.setAttribute("controls", "none");
                this.sound.style.display = "none";
                document.body.appendChild(this.sound);
                this.play = function(){
                    this.sound.play();
                }
                this.stop = function(){
                    this.sound.pause();
                }
            }
            
            var eatingSound = new sound("sound/eat.mp3");
            var droppingSound = new sound("sound/drop.mp3");			
            
            background.onload = function() {
                kan.onload = function() {
                    asiOne.onload = function() {
                        asiTwo.onload = function() {
                            asiThree.onload = function() {
                                asiFour.onload = function() {
                                    maske.onload = function() {
                                        virus.onload =function() {
                                            sise.onload = function() {
                                                ctx.drawImage(background,0,0,500,500);
                                                ctx.strokeStyle = "#1E4BB0";
                                                ctx.font = "30px Arial"
                                                ctx.strokeText("HOS GELDIN!",150,220);
                                                ctx.strokeText("Baslamak icin tikla :)",100,270);
            
                                                drawObject = function(object,x,y,width,height) {
                                                    ctx.drawImage(object,x,y,width,height);
                                                }
            
                                                document.getElementById('ctx').onmousedown = function() {
                                                    if (!gameover) {
                                                        clearInterval(intervalVar);
                                                    }
                                                    startGame();
                                                }
            
                                                document.onkeydown = function(event) {
                                                    event.preventDefault();
                                                    if (event.keyCode == 37 && asi.x > 0) {
                                                        asi.spd = -5;
                                                        asi.leftPressed = true;
                                                    }
                                                    if (event.keyCode == 39 && asi.x < 500 - asi.width) {
                                                        asi.spd = 5;
                                                        asi.rightPressed = true;
                                                    }
                                                    if (event.keyCode == 38 && !asi.onair && asi.y== 350) {
                                                        if (!asi.onair) {
                                                            asi.jump = 100;
                                                            asi.onair = true;
                                                        }
                                                    }
                                                    if (event.keyCode == 32) {
                                                        if (paused)
                                                            paused = false;
                                                        else
                                                            paused = true;
                                                    }
            
                                                }
            
                                                document.onkeyup = function(event) {
                                                    if (event.keyCode == 37) {
                                                        asi.leftPressed = false;
                                                    }
                                                    if (event.keyCode == 39) {
                                                        asi.rightPressed = false;
                                                    }
                                                }
            
                                                virus_asi_collision = function(f) {
                                                    return ((f.x < asi.x + asi.width) &&
                                                        (asi.x < f.x + virusObject.width) &&
                                                        (f.y < asi.y + asi.height) &&
                                                        (asi.y < f.y + virusObject.height));
                                                }
                                                
                                                sise_asi_collision = function(f) {
                                                    return ((f.x < asi.x + asi.width) &&
                                                        (asi.x < f.x + siseObject.width) &&
                                                        (f.y < asi.y + asi.height) &&
                                                        (asi.y < f.y + siseObject.height));
                                                }
            
                                                virus_maske_collision = function(f,t) {
                                                    return ((f.x < t.x + maskeObject.width) &&
                                                        (t.x < f.x + virusObject.width) &&
                                                        (f.y < t.y + maskeObject.height) &&
                                                        (t.y < f.y + virusObject.height));	
                                                }
            
                                                asi_maske_collision = function(t) {
                                                    return ((asi.x <= t.x + maskeObject.width) &&
                                                        (t.x <= asi.x + asi.width) &&
                                                        (asi.y + asi.height <= t.y));
                                                }
            
                                                jump = function() {
                                                    if (asi.jump > 0 && asi.onair) {
                                                        asi.y -= asi.jumpUnit;
                                                        asi.jump -= asi.jumpUnit;
                                                    }
                                                    if (asi.jump <= 0 && asi.jump > -100 && asi.onair) {
                                                        asi.y += asi.jumpUnit;
                                                        asi.jump -= asi.jumpUnit;
                                                    }
                                                    if (asi.jump <= -100 && asi.onair) {
                                                        asi.onair = false;
                                                    }
                                                }
            
                                                updateAsiPosition = function() {
                                                    if (asi.leftPressed && asi.x > 0) {
                                                        asi.x += asi.spd;
                                                    }
                                                    if (asi.rightPressed && asi.x < 500 - asi.width) {
                                                        asi.x += asi.spd;	
                                                    }
                                                    if (asi.y >= 450) {
                                                        asi.y = 450;
                                                        gameover = true;
                                                        droppingSound.play();
                                                    }
                                                }
            
                                                updateSisePosition = function() {
                                                    for(var i in siseList) {
                                                        if (siseList[i].y > 500) { 
                                                            siseList.splice(i,1);
                                                        }
                                                        else {
                                                            siseList[i].y += siseObject.spd;
                                                        }
                                                    }
                                                }
                                                
                                                updateVirusPosition = function() {
                                                    for(var i in virusList) {
                                                        if (virusList[i].y > 500) { 
                                                            virusList.splice(i,1);
                                                        }
                                                        else {
                                                            virusList[i].y += virusObject.spd;
                                                        }
                                                    }
                                                }
            
                                                gameOver = function() {
                                                    ctx.save();
                                                    ctx.globalAlpha = 0.6;
                                                    drawObject(kan,100,100,300,300);
                                                    ctx.globalAlpha = 1.0;
                                                    ctx.strokeStyle = "#2E4E5A";
                                                    ctx.font = "30px Verdana"
                                                    ctx.strokeText("Oyun Bitti!",180,200);
                                                    ctx.strokeText("Yeniden oynamak icin tiklayiniz.",10,250);
                                                    ctx.restore();
                                                    clearInterval(intervalVar);
                                                }
            
                                                updatePosition = function() {
                                                    if (!paused) {
                                                        ctx.clearRect(0,0,500,500);
                                                        ctx.drawImage(background,0,0,500,500);
                                                        drawObject(virus,440,10,20,20);
                                                        virusTimer++;
                                                        siseTimer++;
                                                        if (virusTimer>level) {
                                                            virusList.push({'x':virusDrop[Math.round(Math.random()*9)],'y':0});
                                                            virusTimer = 0;
                                                        }
                                                        if (siseTimer>3*level) {
                                                            siseList.push({'x':Math.random()*450+30,'y':-50});
                                                            siseTimer = 0;
                                                        }
                                                        
                                                        for (var i in siseList) {
                                                            if (sise_asi_collision(siseList[i])) {
                                                                droppingSound.play();
                                                                gameover = true;
                                                            }
                                                        }
                
                                                        if (gameover) {
                                                            if (asi.y>=450)
                                                                drawObject(asiThree,asi.x,asi.y+20,50,30);
                                                            else 
                                                                drawObject(asiOne,asi.x,asi.y,30,50);
                                                            gameOver();
                                                        }
            
                                                        else if (asi.onair) {
                                                            drawObject(asiFour,asi.x,asi.y,asi.width,asi.height);
                                                        }
                                                        else if (animation == 0) {
                                                            animation = 1;
                                                            drawObject(asiOne,asi.x,asi.y,asi.width,asi.height);
                                                        }
                                                        else if (animation == 1) {
                                                            animation = 0;
                                                            drawObject(asiTwo,asi.x,asi.y,asi.width,asi.height);
                                                        }
                                                        for(var i in maskeList) {
                                                            drawObject(maske,maskeList[i].x,maskeList[i].y,maskeObject.width,maskeObject.height);
                                                        }
                                                        for (var i in virusList) {
                                                            drawObject(virus,virusList[i].x,virusList[i].y,virusObject.width,virusObject.height);
                                                        }
                                                        for (var i in siseList) {
                                                            drawObject(sise,siseList[i].x,siseList[i].y,siseObject.width,siseObject.height);
                                                        }
                                                        for (var i in virusList) {
                                                            if (virus_asi_collision(virusList[i])) {
                                                                eatingSound.play();
                                                                score++;
                                                                if (score % 2 == 0) 
                                                                    level--;
                                                                virusList.splice(i,1);
                                                            }
                                                        }
                                                        
                                                        
                                                        for (var i in virusList) {
                                                            for (var j in maskeList) {
                                                                if (virus_maske_collision(virusList[i],maskeList[j])) {
                                                                    maskeList.splice(j,1);
                                                                }
                                                            }
                                                        }
                                                        if (!asi.onair) {
                                                            for (var i in maskeList) {
                                                                if (asi_maske_collision(maskeList[i])) {
                                                                    asi.safe = true;
                                                                    break;
                                                                }
                                                                asi.safe = false;
                                                            }
                                                            if (!asi.safe) { 
                                                                asi.y += asi.gravity;
                                                            }
                                                        }
            
                                                        ctx.fillStyle = "#FFFFFF";
                                                        ctx.font = "20px Calibri";
                                                        ctx.fillText(score,465,27);
                                                        ctx.fillText("Level "+(100-level+1),10,27);
                                                        updateSisePosition();
                                                        updateVirusPosition();
                                                        updateAsiPosition();
                                                        jump();
                                                    }
                                                    else {
                                                        ctx.save();
                                                        ctx.strokeStyle = "#FFFFFF";
                                                        ctx.font = "30px Calibri"
                                                        ctx.strokeText("Game Paused",165,250);
                                                        ctx.restore();
                                                    }
                                                }
            
                                                startGame = function() {
                                                    score = 0;
                                                    level = 100;
                                                    asi.y = 350;
                                                    asi.x = 100;
                                                    asi.onair = false;
                                                    asi.leftPressed = false;
                                                    asi.rightPressed = false;
                                                    asi.safe = true;
                                                    maskeList = [];
                                                    virusList = [];
                                                    siseList = [];
                                                    animation = 0;
                                                    virusTimer = 0;
                                                    siseTimer = 0;
                                                    paused = false;
                                                    gameover = false;
                                                    drawObject(asiOne,asi.x,asi.y,asi.width,asi.height);
                                                    for (var i=0;i<=9;i++) {
                                                        maskeList.push({'x':i*50,'y':400});
                                                    }
                                                    for(var i=0;i<maskeList.length;i++) {
                                                        drawObject(maske,maskeList[i].x,maskeList[i].y,maskeObject.width,maskeObject.height);
                                                    }
                                                    animation = 0;
                                                    virusList = [];
                                                    intervalVar = setInterval(updatePosition,10);
                                                }
                                            }
                                            sise.src = "images/sise.png";
                                        }
                                        virus.src = "images/virus.png";
                                    }
                                    maske.src = "images/maske.png";
                                }
                                asiFour.src = "images/asi4.png"
                            }
                            asiThree.src = "images/asi3.png";
                        }
                        asiTwo.src = "images/asi2.png";	
                    }
                    asiOne.src = "images/asi1.png";
                }
                kan.src = "images/kan.png";
            }
            background.src = "images/background.jpg";