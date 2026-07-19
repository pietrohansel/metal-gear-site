/**
 * Metal Gear Saga - Scripts de Interface
 */

document.addEventListener('DOMContentLoaded', init)

function init() {
  initSmoothScroll()
  initConsoleMessage()
  initGalleryScroll()
}

/** Rolagem suave com transição Codec */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute('href'))
      if (!target) return
    })
  })
}

/** Transforma cada .horizontal-scroll em carrossel com loop automático */
function initGalleryScroll() {
  document.querySelectorAll('.horizontal-scroll').forEach((container) => {
    const track = document.createElement('div')
    track.className = 'scroll-track'
    track.innerHTML = container.innerHTML + container.innerHTML
    container.innerHTML = ''
    container.appendChild(track)
    container.classList.add('scrolling')
  })
}

/** Mensagem no console */
function initConsoleMessage() {
  console.log(
    '%c[SISTEMA iDROID]: Conexão estabelecida. Arquivos da Saga carregados.',
    'color:#e11d48;font-weight:bold;font-size:12px;'
  )
}

// preloader

const preloader = document.getElementById('preloader')
const numbersEl = document.getElementById('numbers')

function randomDigits(n) {
  let s = ''
  for (let i = 0; i < n; i++) s += Math.floor(Math.random() * 10)
  return s
}

const numbersInterval = setInterval(() => {
  numbersEl.textContent = randomDigits(4)
}, 90)

window.addEventListener('load', () => {
  setTimeout(() => {
    preloader.classList.add('loaded')

    setTimeout(() => {
      clearInterval(numbersInterval)
      preloader.classList.add('hidden')
    }, 900)
  }, 500)
})

const wrapper = document.getElementById('wrapper')
const track = document.getElementById('track')

function updateScroll() {
  const wrapperRect = wrapper.getBoundingClientRect()
  const wrapperHeight = wrapper.offsetHeight
  const viewportHeight = window.innerHeight

  // distância total que o wrapper "percorre" atrás do sticky
  const scrollableDistance = wrapperHeight - viewportHeight

  // progresso de 0 a 1 baseado em quanto do wrapper já passou
  let progress = -wrapperRect.top / scrollableDistance
  progress = Math.min(Math.max(progress, 0), 1)

  // quanto o track precisa andar para a esquerda no total
  const maxTranslate = track.scrollWidth - window.innerWidth

  track.style.transform = `translateX(-${progress * maxTranslate}px)`
}

window.addEventListener('scroll', updateScroll)
window.addEventListener('resize', updateScroll)
updateScroll()
