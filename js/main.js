function start() {
    $(".inicio").hide();

    $(".fundoGame").append("<div class='jogador anima1'></div>");
    $(".fundoGame").append("<div class='inimigo1 anima2'></div>");
    $(".fundoGame").append("<div class='inimigo2'></div>");
    $(".fundoGame").append("<div class='amigo anima3'></div>");
    $(".fundoGame").append("<div class='placar'></div>");
    $(".fundoGame").append("<div class='energia'></div>");


    //Principais variaveis do jogo

    var game = {}

    game.pressionou = [];

    var tecla = {
        W: 87,
        S: 83,
        D: 68
    }

    var podeAtirar = true;

    var velHeli = 5;
    var velCam = 3;
    var velAmig = 1;

    var posicaoY = parseInt(Math.random() * 334);

    var fimdejogo = false;

    var pontos = 0;
    var salvos = 0;
    var perdidos = 0;

    var energiaAtual = 3

    var somDisparo = document.querySelector(".somDisparo");
    var somExplosao = document.querySelector(".somExplosao");
    var musica = document.querySelector(".musica");
    var somGameover = document.querySelector(".somGameover");
    var somPerdido = document.querySelector(".somPerdido");
    var somResgate = document.querySelector(".somResgate");

    //Placar

    function placar() {
        $(".placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");
    }

    //Energia

    function energia() {
        if(energiaAtual === 3) {
            $(".energia").css("background-image", "url(./imgs/energia3.png)");
        }
        if(energiaAtual === 2) {
            $(".energia").css("background-image", "url(./imgs/energia2.png)");
        }
        if(energiaAtual === 1) {
            $(".energia").css("background-image", "url(./imgs/energia1.png)");
        }
        if(energiaAtual === 0) {
            $(".energia").css("background-image", "url(./imgs/energia0.png)");
            gameOver();
        }
    }

    //Musica de fundo

    musica.addEventListener("ended", function() {musica.currentTime = 0; musica.play();}, false);
    musica.play();
    
    //Verifica se o usuário pressionou alguma tecla

    $(document).keydown(function(e) {
        game.pressionou[e.which] = true;
    });

    $(document).keyup(function(e) {
        game.pressionou[e.which] = false;
    });
     

    //Game Loop

    game.timer = setInterval(loop,30);

    function loop() {
        movefundo();
        movejogador();
        moveinimigo1();
        moveinimigo2();
        moveamigo();
        colisao();
        placar();
        energia();
    }

    //Movimentação do fundo do jogo

    function movefundo() {
        esquerda = parseInt($(".fundoGame").css("background-position"));
        $(".fundoGame").css("background-position", esquerda-1);
    }


    //Movimentação do jogador

    function movejogador() {
        if(game.pressionou[tecla.W]) {
            var topo = parseInt($(".jogador").css("top"));
            $(".jogador").css("top",topo-10);

                if(topo<=0) {
                    $(".jogador").css("top",topo+10);
                }
        }
    
        if(game.pressionou[tecla.S]) {
            topo = parseInt($(".jogador").css("top"));
            $(".jogador").css("top",topo+10);

                if(topo>=434) {
                    $(".jogador").css("top",topo-10);
                }
        }
    
        if(game.pressionou[tecla.D]) {
            disparo();
        }
        }

    //Movimento do Helicoptero inimigo

    function moveinimigo1() {
        var posicaoX = parseInt($(".inimigo1").css("left"));
        $(".inimigo1").css("left", posicaoX - velHeli);
        $(".inimigo1").css("top", posicaoY);

            if(posicaoX <= 0) {
                posicaoY = parseInt(Math.random() * 334);
                $(".inimigo1").css("left", 694);
                $(".inimigo1").css("top", posicaoY);
            }
    }

    //Movimento do Caminhao inimigo

    function moveinimigo2() {
        let posicaoX = parseInt($(".inimigo2").css("left"));
        $(".inimigo2").css("left", posicaoX - velCam);

            if(posicaoX <= 0) {
                $(".inimigo2").css("left", 775)
            }
    }

    //Movimento do Amigo

    function moveamigo() {
        posicaoX = parseInt($(".amigo").css("left"));
        $(".amigo").css("left", posicaoX + velAmig);

            if(posicaoX > 906) {
                $(".amigo").css("left", 0);
            }

    }

    //Disparo

    function disparo() {
        if (podeAtirar === true) {

            podeAtirar = false;

            topo = parseInt($(".jogador").css("top"));
            posicaoX = parseInt($(".jogador").css("left"));
            let tiroX = posicaoX + 190;
            let topoTiro = topo + 40;

            $(".fundoGame").append("<div class='disparo'></div>");
            $(".disparo").css("top", topoTiro);
            $(".disparo").css("left", tiroX);

            tempoDisparo = window.setInterval(executaDisparo, 30);

            somDisparo.play();
        }

    function executaDisparo() {
        posicaoX = parseInt($(".disparo").css("left"));
        $(".disparo").css("left", posicaoX + 15);

            if(posicaoX > 900) {
                window.clearInterval(tempoDisparo);
                tempoDisparo = null;
                $(".disparo").remove();
                podeAtirar = true;
            }
        }
    }

    //Colisao
    
    function colisao(){
        var colisao1 = ($(".jogador").collision($(".inimigo1")));
        var colisao2 = ($(".jogador").collision($(".inimigo2")));
        var colisao3 = ($(".disparo").collision($(".inimigo1")));
        var colisao4 = ($(".disparo").collision($(".inimigo2")));
        var colisao5 = ($(".jogador").collision($(".amigo")));
        var colisao6 = ($(".inimigo2").collision($(".amigo")));

    //Colisao Jogador x Inimigo1

            if(colisao1.length > 0) {

                energiaAtual--;

                inimigo1X = parseInt($(".inimigo1").css("left"));
                inimigo1Y = parseInt($(".inimigo1").css("top"));
                explosao1(inimigo1X, inimigo1Y);

                posicaoY = parseInt(Math.random() * 334);
                $(".inimigo1").css("left", 694);
                $(".inimigo1").css("top", posicaoY);

                somExplosao.play()
            }
    //Colisao Jogador x Inimigo2

            if(colisao2.length > 0) {

                energiaAtual--;

                inimigo2X = parseInt($(".inimigo2").css("left"));
                inimigo2Y = parseInt($(".inimigo2").css("top"));
                explosao2(inimigo2X, inimigo2Y);

                $(".inimigo2").remove();

                reposicionaInimigo2();

                somExplosao.play()
            }
    //Colisao Disparo x inimigo1

            if(colisao3.length > 0) {

                pontos = pontos + 100;
                velHeli = velHeli+0.3;

                inimigo1X = parseInt($(".inimigo1").css("left"));
                inimigo1Y = parseInt($(".inimigo1").css("top"));

                explosao1(inimigo1X, inimigo1Y);
                $(".disparo").css("left", 950);

                posicaoY = parseInt(Math.random() * 334);
                $(".inimigo1").css("left", 694);
                $(".inimigo1").css("top", posicaoY);

                somExplosao.play()
            }
    //Colisao Disparo x inimigo2

            if(colisao4.length > 0) {

                pontos = pontos + 50;

                inimigo2X = parseInt($(".inimigo2").css("left"));
                inimigo2Y = parseInt($(".inimigo2").css("top"));
                $(".inimigo2").remove();

                explosao2(inimigo2X, inimigo2Y);
                $(".disparo").css("left", 950);

                reposicionaInimigo2();

                somExplosao.play()
            }
    //Colisao Jogador x Amigo

            if(colisao5.length > 0) {

                salvos++;

                reposicionaAmigo();
                $(".amigo").remove();

                somResgate.play();
            }

    //Colisao Inimigo2 x Amigo

            if(colisao6.length > 0) {

                perdidos++;

                amigoX = parseInt($(".amigo").css("left"));
                amigoY = parseInt($(".amigo").css("top"));
                explosao3(amigoX, amigoY);
                $(".amigo").remove();

                reposicionaAmigo();

                somPerdido.play();
            }
        
    }

    //Explosao 1

    function explosao1(inimigo1X, inimigo1Y) {
        $(".fundoGame").append("<div class='explosao1'></div>");
        $(".explosao1").css("background-image", "url(./imgs/explosao.png)");
        var div = $(".explosao1");
        div.css("top", inimigo1Y);
        div.css("left", inimigo1X);
        div.animate({width:200, opacity:0}, "slow");

        var tempoExplosao = window.setInterval(removeExplosao, 1000);

            function removeExplosao() {
                div.remove();
                window.clearInterval(tempoExplosao);
                tempoExplosao = null;
            }
    }

    //Explosao 2

    function explosao2(inimigo2X, inimigo2Y) {
        $(".fundoGame").append("<div class='explosao2'></div>");
        $(".explosao2").css("background-image", "url(./imgs/explosao.png)");
        var div2 = $(".explosao2");
        div2.css("top", inimigo2Y);
        div2.css("left", inimigo2X);
        div2.animate({width: 200, opacity: 0}, "slow");

        var tempoExplosao2 = window.setInterval(removeExmplosao2, 1000);

            function removeExmplosao2() {
                div2.remove();
                window.clearInterval(tempoExplosao2);
                tempoExplosao2 = null;
            }
    }

    //Explosao 3

    function explosao3(amigoX, amigoY) {
        $(".fundoGame").append("<div class='explosao3 anima4'></div>");
        $(".explosao3").css("top", amigoY);
        $(".explosao3").css("left", amigoX);

        var tempoExplosao3 = window.setInterval(resetaExplosao3, 1000);

        function resetaExplosao3() {
            $(".explosao3").remove();
            window.clearInterval(tempoExplosao3);
            tempoExplosao3 = null;
        }
    }

    //Reposicionamento do Inimigo 2

    function reposicionaInimigo2() {
        var tempoColisao4 = window.setInterval(reposiciona4, 5000);

            function reposiciona4() {
                window.clearInterval(tempoColisao4);
                tempoColisao4 = null;

                    if(fimdejogo === false) {
                        $(".fundoGame").append("<div class='inimigo2'></div>")
                    }
            }
    }

    //Reposicionamento do Amigo

    function reposicionaAmigo() {
        var tempoAmigo = window.setInterval(reposiciona6, 6000);

            function reposiciona6() {
                window.clearInterval(tempoAmigo);
                tempoAmigo = null;

                if(fimdejogo === false) {
                    $(".fundoGame").append("<div class='amigo anima3'></div>");
                }
            }
    }

    //Game Over

    function gameOver() {
        fimdejogo = true;
        musica.pause();
        somGameover.play();

        window.clearInterval(game.timer);
        game.timer = null;

        $(".jogador").remove();
        $(".inimigo1").remove();
        $(".inimigo2").remove();
        $(".amigo").remove();

        $(".fundoGame").append("<div class='fim'></div>");

        $(".fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos + "</p>" + "<div class='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente<h/3></div>");
    }
}

    //Reinicia o Jogo

    function reiniciaJogo() {
        var somGameover = document.querySelector(".somGameover");
        somGameover.pause();
        $(".fim").remove();
        start();
    }

