/**
 * Metal Gear Saga - Scripts de Interface
 */

document.addEventListener('DOMContentLoaded', init)

function init() {
  initHeroSlider()
  initSmoothScroll()
  initConsoleMessage()
  initMarqueeFix()
  initGalleryScroll()
  initPageTransition()
}

/** Duplica conteúdo do marquee para loop infinito */
function initMarqueeFix() {
  const track = document.querySelector('.marquee-track')
  if (!track || track.dataset.duplicated) return
  track.innerHTML += track.innerHTML
  track.dataset.duplicated = 'true'
}

/** Slider automático do hero */
function initHeroSlider() {
  const SLIDE_INTERVAL = 8000
  const slides = document.querySelectorAll('.slide')
  let currentSlide = 0

  function nextSlide() {
    slides[currentSlide].classList.remove('active')
    currentSlide = (currentSlide + 1) % slides.length
    slides[currentSlide].classList.add('active')
  }

  if (slides.length > 0) {
    setInterval(nextSlide, SLIDE_INTERVAL)
  }
}

/** Rolagem suave com transição Codec */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute('href'))
      if (!target) return
      transitionTo(target)
    })
  })
}

/** Transição SVG estilo Codec */
function transitionTo(target) {
  const overlay = document.getElementById('pageTransition')
  if (!overlay) {
    target.scrollIntoView({ behavior: 'smooth' })
    return
  }

  overlay.classList.add('active')

  setTimeout(() => {
    target.scrollIntoView({ behavior: 'instant' })
  }, 400)

  setTimeout(() => {
    overlay.classList.remove('active')
  }, 1200)
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

/** Transition fade-in ao carregar a página */
function initPageTransition() {
  const overlay = document.getElementById('pageTransition')
  if (!overlay) return
  overlay.classList.add('active')
  setTimeout(() => {
    overlay.classList.remove('active')
  }, 800)
}
