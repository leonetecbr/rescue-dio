const START_DIVS = [
  '<div id="inimigo-1" class="anima-2"></div>',
  '<div id="inimigo-2"></div>',
  '<div id="amigo" class="anima-3"></div>',
  '<div id="jogador" class="anima-1"></div>',
  '<div id="placar"></div>',
  '<div id="maior-pontuacao"></div>',
  '<div id="energia"></div>',
  '<div id="som"></div>'
]

const VOLUME_ON = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-volume-up-fill" viewBox="0 0 16 16"><path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z" /><path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z" /><path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z" /></svg>'
const VOLUME_OFF = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-volume-mute-fill" viewBox="0 0 16 16"><path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z" /></svg>'

const TECLA = {
  W: 87,
  S: 83,
  D: 68
}

let somDisparo = $('#somDisparo')
let somExplosao = $('#somExplosao')
let musica = $('#musica')
let somGameover = $('#somGameover')
let somPerdido = $('#somPerdido')
let somResgate = $('#somResgate')

let jogo = {}, velocidade = 5, posicaoY, posicaoX, podeAtirar, tempoDisparo, fimdejogo, pontos, salvos, perdidos, energiaAtual, highscore, podeMusica

function start() {
  pontos = 0
  salvos = 0
  perdidos = 0
  $('#inicio').hide()
  $('#fundo-game').append(START_DIVS.join(''))

  jogo.timer = setInterval(loop, 30)
  jogo.pressionou = []
  posicaoY = parseInt(Math.random() * 334)
  fimdejogo = false
  energiaAtual = 3
  podeAtirar = true
  highscore = Number(localStorage.getItem('highscore'))
  $('#maior-pontuacao').html(`<h2>Maiores pontos: ${highscore}</h2>`)

  podeMusica =localStorage.getItem('music')

  if (podeMusica === undefined) podeMusica = true
  else podeMusica = Boolean(podeMusica)

  botaoMusica()
  iniciarMusica()

  $(document).keydown(function (e) {
    jogo.pressionou[e.which] = true
  })


  $(document).keyup(function (e) {
    jogo.pressionou[e.which] = false
  })

  function botaoMusica(){
    if (podeMusica) $('#som').html(VOLUME_ON)
    else $('#som').html(VOLUME_OFF)
    
    $('#som').on('click', () => {
      podeMusica = !podeMusica
      localStorage.setItem('music', podeMusica)
      if (podeMusica){
        $('#som').html(VOLUME_ON)
        iniciarMusica()
      }
      else{
        $('#som').html(VOLUME_OFF)
        paraMusica()
      }
    })
  }

  function loop() {
    moveFundo()
    moveJogador()
    moveInimigo1()
    moveInimigo2()
    moveAmigo()
    colisao()
    placar()
    energia()
  }

  function moveFundo() {
    esquerda = parseInt($('#fundo-game').css('background-position'))
    $('#fundo-game').css('background-position', esquerda - 1)
  }

  function moveJogador() {
    if (jogo.pressionou[TECLA.W]) {
      let topo = parseInt($('#jogador').css('top'))
      if (!(topo <= 0)) {
        $('#jogador').css('top', topo - 10)
      }
    }

    if (jogo.pressionou[TECLA.S]) {
      let topo = parseInt($('#jogador').css('top'))
      if (!(topo >= 434)) {
        $('#jogador').css('top', topo + 10)
      }
    }

    if (jogo.pressionou[TECLA.D]) {
      disparo()
    }

  }

  function moveInimigo1() {
    posicaoX = parseInt($('#inimigo-1').css('left'))
    $('#inimigo-1').css({
      'left': posicaoX - velocidade,
      'top': posicaoY
    })

    if (posicaoX <= 0) {
      posicaoY = parseInt(Math.random() * 334)
      $('#inimigo-1').css({
        'left': 694,
        'top': posicaoY
      })
    }
  }

  function moveInimigo2() {
    posicaoX = parseInt($('#inimigo-2').css('left'))
    $('#inimigo-2').css('left', posicaoX - 3)

    if (posicaoX <= 0) {
      $('#inimigo-2').css('left', 775)
    }
  }

  function moveAmigo() {
    posicaoX = parseInt($('#amigo').css('left'))
    $('#amigo').css('left', posicaoX + 1)

    if (posicaoX > 906) {
      $('#amigo').css('left', 0)
    }
  }

  function disparo() {
    if (podeAtirar) {
      somDisparo.trigger('play')
      podeAtirar = false

      topo = parseInt($('#jogador').css('top'))
      posicaoX = parseInt($('#jogador').css('left'))
      tiroX = posicaoX + 190
      topoTiro = topo + 40
      $('#fundo-game').append('<div id="disparo"></div>')
      $('#disparo').css({
        'top': topoTiro,
        'left': tiroX
      })

      tempoDisparo = setInterval(executaDisparo, 30)
    }

    function executaDisparo() {
      posicaoX = parseInt($('#disparo').css('left'))
      $('#disparo').css('left', posicaoX + 15)

      if (posicaoX > 900) {

        clearInterval(tempoDisparo)
        tempoDisparo = null
        $('#disparo').remove()
        podeAtirar = true
      }
    }
  }

  function iniciarMusica(){
    if (podeMusica){
      if (!fimdejogo){
        musica.on('ended', () => musica.trigger('play'))
        musica.trigger('play')
      } else{
        musica.trigger('pause')
        somGameover.trigger('play')
      }
    }
  }

  function paraMusica(){
    if (!fimdejogo) {
      musica.trigger('pause')
    } else {
      somGameover.trigger('pause')
    }
  }

  function colisao() {
    let colisao1 = ($('#jogador').collision($('#inimigo-1')))
    let colisao2 = ($('#jogador').collision($('#inimigo-2')))
    let colisao3 = ($('#disparo').collision($('#inimigo-1')))
    let colisao4 = ($('#disparo').collision($('#inimigo-2')))
    let colisao5 = ($('#jogador').collision($('#amigo')))
    let colisao6 = ($('#inimigo-2').collision($('#amigo')))

    if (colisao1.length > 0) {
      explosao(1)

      posicaoY = parseInt(Math.random() * 334)
      $('#inimigo-1').css({
        'left': 694,
        'top': posicaoY
      })
    }

    if (colisao2.length > 0) {
      explosao(2)
      $('#inimigo-2').remove()

      setTimeout(reposiciona4, 5000)

      function reposiciona4() {
        if (fimdejogo == false) {
          $('#fundo-game').append(START_DIVS[1])
        }
      }
    }

    if (colisao3.length > 0) {
      pontos += 100

      explosao(1, false)
      $('#disparo').css('left', 950)

      posicaoY = parseInt(Math.random() * 334)
      $('#inimigo-1').css({
        'left': 694,
        'top': posicaoY
      })
    }

    if (colisao4.length > 0) {
      pontos += 50

      explosao(2, false)
      $('#inimigo-2').remove()
      $('#disparo').css('left', 950)

      reposicionaInimigo2()
    }

    if (colisao5.length > 0) {
      somResgate.trigger('play')
      salvos++
      pontos += 25
      reposicionaAmigo()
      $('#amigo').remove()
    }

    if (colisao6.length > 0) {
      somPerdido.trigger('play')
      perdidos++
      if (pontos > 25) pontos -= 25
      explosao3()
      $('#amigo').remove()

      reposicionaAmigo()
    }
  }

  function reposicionaAmigo() {

    setTimeout(reposiciona6, 6000)

    function reposiciona6() {
      if (fimdejogo === false) {
        $('#fundo-game').append(START_DIVS[2])
      }
    }
  }

  function explosao(index, erro = true) {
    if (erro) energiaAtual--
    else velocidade += 0.3

    inimigoX = parseInt($(`#inimigo-${index}`).css('left'))
    inimigoY = parseInt($(`#inimigo-${index}`).css('top'))

    somExplosao.trigger('play')
    $('#fundo-game').append(`<div id="explosao-${index}"></div>`)
    let div = $(`#explosao-${index}`)
    div.css({
      'background-image': 'url(imgs/explosao.png)',
      'top': inimigoY,
      'left': inimigoX
    })
    div.animate({ width: 200, opacity: 0 }, 'slow')

    setTimeout(removeExplosao, 1000)

    function removeExplosao() {
      div.remove()
    }
  }

  function explosao3() {
    amigoX = parseInt($('#amigo').css('left'))
    amigoY = parseInt($('#amigo').css('top'))

    $('#fundo-game').append('<div id="explosao-3" class="anima-4"></div>')
    $('#explosao-3').css({
      'top': amigoY,
      'left': amigoX
    })
    setTimeout(resetaExplosao3, 1000)

    function resetaExplosao3() {
      $('#explosao-3').remove()
    }
  }

  function reposicionaInimigo2() {
    setTimeout(reposiciona4, 5000)

    function reposiciona4() {
      if (fimdejogo === false) {
        $('#fundo-game').append(START_DIVS[1])
      }
    }
  }

  function placar() {
    if (pontos > highscore){
      highscore = pontos
      $('#maior-pontuacao').html(`<h2>Maiores pontos: ${highscore}</h2>`)
      localStorage.setItem('highscore', highscore)
    }
    $('#placar').html(`<h2> Pontos: ${pontos} Salvos: ${salvos} Perdidos: ${perdidos}</h2>`)
  }

  function energia() {
    $('#energia').css('background-image', `url(imgs/energia${energiaAtual}.png)`)
    
    if (energiaAtual == 0) {
      gameOver()
    }
  }

  function gameOver() {
    fimdejogo = true
    iniciarMusica()

    clearInterval(jogo.timer)

    jogo.timer = null

    $('#jogador').remove()
    $('#inimigo-1').remove()
    $('#inimigo-2').remove()
    $('#amigo').remove()

    $('#fundo-game').append('<div id="fim"></div>')

    $('#fim').html(`<h1> Game Over </h1><p class="bolder">Sua pontuação foi: ${pontos} pontos</p><div id="reinicia" onClick="reiniciaJogo()"><h3>Jogar Novamente</h3></div>`)
  }
}

function reiniciaJogo() {
  if (podeMusica) somGameover.trigger('pause')
  $('#som').remove()
  $('#fim').remove()
  $('#placar').remove()
  $('#energia').remove()
  start()
}