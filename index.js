/**
 * Metal Gear Saga - Scripts de Interface
 */
/* global DriftWall */

document.addEventListener('DOMContentLoaded', init)

function init() {
  initSmoothScroll()
  initConsoleMessage()
  initGalleryScroll()
  initHeroDriftWall()
  initHeroStartMenu()
}

/**
 * Converte o CTA START em um seletor de seções controlado por teclado.
 * Após o clique, as setas ↑ e ↓ alternam os nomes exibidos no próprio botão.
 */
function initHeroStartMenu() {
  const control = document.querySelector('.hero-start')
  if (!control) return

  const sections = [
    'INÍCIO',
    'HISTÓRIA',
    'LINHA DO TEMPO',
    'JOGOS',
    'PERSONAGENS',
    'METAL GEAR',
    'ORGANIZAÇÕES',
  ]
  let activeIndex = 0
  let isNavigationActive = false

  const renderSelection = () => {
    control.textContent = sections[activeIndex]
    control.dataset.navigationActive = 'true'
    control.setAttribute('aria-label', `Seção selecionada: ${sections[activeIndex]}`)
  }

  control.addEventListener('click', (event) => {
    event.preventDefault()
    isNavigationActive = true
    activeIndex = 0
    renderSelection()
    control.focus()
  })

  document.addEventListener('keydown', (event) => {
    if (!isNavigationActive || document.activeElement !== control) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      activeIndex = (activeIndex + 1) % sections.length
      renderSelection()
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      activeIndex = (activeIndex - 1 + sections.length) % sections.length
      renderSelection()
    }
  })
}

/** Mural animado do React Bits, adaptado para JavaScript sem React. */
function initHeroDriftWall() {
  const element = document.querySelector('#hero-drift-wall')
  if (!element || typeof DriftWall === 'undefined') return

  const items = [
    {
      image: 'src/assets/images/capas_game/cp1.webp',
      title: 'Metal Gear',
    },
    {
      image: 'src/assets/images/capas_game/cp2.webp',
      title: 'Metal Gear 2: Solid Snake',
    },
    {
      image: 'src/assets/images/capas_game/cp3.webp',
      title: 'Metal Gear Solid',
    },
    {
      image: 'src/assets/images/capas_game/cp4.webp',
      title: 'Metal Gear Solid: Integral',
    },
    {
      image: 'src/assets/images/capas_game/cp5.webp',
      title: 'Metal Gear: Solid Snake',
    },
    {
      image: 'src/assets/images/capas_game/cp6.webp',
      title: 'Metal Gear Solid 2',
    },
    {
      image: 'src/assets/images/capas_game/cp7.webp',
      title: 'Sons of Liberty',
    },
    {
      image: 'src/assets/images/capas_game/cp8.webp',
      title: 'Metal Gear Solid 2: Substance',
    },
    {
      image: 'src/assets/images/capas_game/cp9.webp',
      title: 'Metal Gear Solid 3: Snake Eater',
    },
    {
      image: 'src/assets/images/capas_game/cp10.webp',
      title: 'Metal Gear Solid: Portable Ops',
    },
    {
      image: 'src/assets/images/capas_game/cp11.webp',
      title: 'Portable Ops Plus',
    },
    {
      image: 'src/assets/images/horiz_slider/mgs_peace_walker1.jpeg',
      title: 'Metal Gear Solid: Peace Walker',
    },
    {
      image: 'src/assets/images/horiz_slider/mgs_peace_walker2.jpeg',
      title: 'Peace Walker HD Edition',
    },
    {
      image: 'src/assets/images/horiz_slider/mgs_guns_of_patriots.jpeg',
      title: 'Metal Gear Solid 4',
    },
    {
      image: 'src/assets/images/horiz_slider/mgs_guns_of_patriots.webp',
      title: 'Guns of the Patriots',
    },
    {
      image: 'src/assets/images/horiz_slider/mgs_ground_zeroes.jpeg',
      title: 'Metal Gear Solid V: Ground Zeroes',
    },
    {
      image: 'src/assets/images/horiz_slider/mgs_ground_zeroes2.jpeg',
      title: 'Ground Zeroes: Definitive Edition',
    },
    {
      image: 'src/assets/images/horiz_slider/mgsv_the_phantom_pain.jpeg',
      title: 'Metal Gear Solid V: The Phantom Pain',
    },
    {
      image: 'src/assets/images/horiz_slider/mgsv_the_phantom_pain2.jpeg',
      title: 'The Phantom Pain: Definitive Edition',
    },
    {
      image: 'src/assets/images/horiz_slider/mg_rising.webp',
      title: 'Metal Gear Rising: Revengeance',
    },
  ]

  new DriftWall(element, {
    items,
    columns: 5,
    tileWidth: 200,
    tileHeight: 132,
    gap: 18,
    tilt: 16,
    turn: -14,
    perspective: 1200,
    depth: 120,
    speed: 42,
    direction: 'up',
    variance: 0.45,
    parallax: 0.6,
    lift: 64,
    fade: 0.6,
    dim: 0.82,
    overlayColor: '#060010',
  })
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
