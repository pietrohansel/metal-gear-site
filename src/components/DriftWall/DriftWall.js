/**
 * DriftWall — adaptação JavaScript do componente React Bits JS-CSS.
 * Mantém a mesma API visual, mas não exige React neste projeto estático.
 */
class DriftWall {
  constructor(element, options = {}) {
    this.element = element
    this.options = {
      items: [],
      columns: 5,
      tileWidth: 200,
      tileHeight: 132,
      gap: 18,
      radius: 14,
      tilt: 16,
      turn: -14,
      roll: 0,
      perspective: 1200,
      depth: 120,
      speed: 42,
      direction: 'up',
      variance: 0.45,
      parallax: 0.6,
      pauseOnHover: false,
      lift: 64,
      fade: 0.6,
      dim: 0.55,
      grayscale: false,
      overlayColor: '#060010',
      ...options,
    }

    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    this.offsets = []
    this.velocities = []
    this.tracks = []
    this.columnHeights = []
    this.pointer = { x: 0, y: 0 }
    this.pointerDamped = { x: 0, y: 0 }
    this.hoveredColumn = -1
    this.activeTile = null
    this.lastTime = null
    this.animationFrame = null

    this.render()
    this.bindEvents()
    this.animate = this.animate.bind(this)
    this.animationFrame = requestAnimationFrame(this.animate)
  }

  columnFactor(index) {
    const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1
    return 1 + this.options.variance * pseudo
  }

  setVariables() {
    const { options, element } = this
    element.style.setProperty('--dw-tile-w', `${options.tileWidth}px`)
    element.style.setProperty('--dw-tile-h', `${options.tileHeight}px`)
    element.style.setProperty('--dw-gap', `${options.gap}px`)
    element.style.setProperty('--dw-radius', `${options.radius}px`)
    element.style.setProperty('--dw-perspective', `${options.perspective}px`)
    element.style.setProperty('--dw-lift', `${options.lift}px`)
    element.style.setProperty('--dw-dim', options.dim)
    element.style.setProperty('--dw-gray', options.grayscale ? 1 : 0)
    element.style.setProperty('--dw-overlay', options.overlayColor)
    element.style.setProperty('--dw-edge', `${Math.max(0, (1 - options.fade) * 100)}%`)
  }

  renderTile(item, columnIndex) {
    const tile = document.createElement(item.href ? 'a' : 'div')
    tile.className = 'drift-wall__tile'
    tile.dataset.column = columnIndex
    tile.tabIndex = 0

    if (item.href) {
      tile.href = item.href
      tile.target = '_blank'
      tile.rel = 'noreferrer noopener'
    } else {
      tile.setAttribute('role', 'button')
    }

    tile.setAttribute('aria-label', item.title || 'Tile')
    tile.innerHTML = `
      <span class="drift-wall__inner">
        <img src="${item.image}" alt="${item.title || ''}" loading="lazy" decoding="async" draggable="false" />
        <span class="drift-wall__overlay" aria-hidden="true"></span>
      </span>
    `

    tile.addEventListener('focus', () => this.activateTile(tile, columnIndex))
    tile.addEventListener('blur', () => this.releaseTile(tile))
    return tile
  }

  render() {
    const { items, columns, tileHeight, gap } = this.options
    if (!items.length) return

    this.element.replaceChildren()
    this.element.classList.add('drift-wall')
    this.setVariables()

    this.plane = document.createElement('div')
    this.plane.className = 'drift-wall__plane'
    this.element.append(this.plane)

    const unit = tileHeight + gap
    const copies = Math.max(2, Math.ceil((this.element.clientHeight * 1.6) / unit) + 1)

    this.tracks = []
    this.columnHeights = []
    this.offsets = []
    this.velocities = []

    for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
      const columnItems = items.filter((_, itemIndex) => itemIndex % columns === columnIndex)
      const tiles = columnItems.length ? columnItems : items.slice(0, 1)
      const column = document.createElement('div')
      const track = document.createElement('div')
      const copyHeight = Math.max(unit, tiles.length * unit)

      column.className = 'drift-wall__col'
      track.className = 'drift-wall__track'

      for (let copy = 0; copy < copies; copy++) {
        tiles.forEach((item) => track.append(this.renderTile(item, columnIndex)))
      }

      column.append(track)
      this.plane.append(column)
      this.tracks.push(track)
      this.columnHeights.push(copyHeight)
      this.offsets.push(copyHeight * ((columnIndex * 0.37) % 1))
      this.velocities.push(0)
    }

    this.applyPlaneTransform(0, 0)
  }

  bindEvents() {
    this.element.addEventListener('pointermove', (event) => {
      const rect = this.element.getBoundingClientRect()
      this.pointer = {
        x: (event.clientX - rect.left) / rect.width - 0.5,
        y: (event.clientY - rect.top) / rect.height - 0.5,
      }

      const tile = event.target.closest('.drift-wall__tile')
      if (tile && tile !== this.activeTile) {
        this.activateTile(tile, Number(tile.dataset.column))
      }
    })

    this.element.addEventListener('pointerleave', () => {
      this.pointer = { x: 0, y: 0 }
      this.releaseTile()
    })

    this.resizeObserver = new ResizeObserver(() => this.render())
    this.resizeObserver.observe(this.element)
  }

  activateTile(tile, columnIndex) {
    if (tile === this.activeTile) return
    if (this.activeTile) this.activeTile.classList.remove('is-active')
    tile.classList.add('is-active')
    this.activeTile = tile
    this.hoveredColumn = columnIndex
  }

  releaseTile(tile) {
    if (tile && tile !== this.activeTile) return
    if (this.activeTile) this.activeTile.classList.remove('is-active')
    this.activeTile = null
    this.hoveredColumn = -1
  }

  applyPlaneTransform(pointerX, pointerY) {
    const { tilt, turn, roll, depth, parallax } = this.options
    const maxTilt = parallax * 8
    this.plane.style.transform = `translate(-50%, -50%) scale(1.18) rotateX(${tilt - pointerY * maxTilt}deg) rotateY(${turn + pointerX * maxTilt}deg) rotateZ(${roll}deg) translateZ(${-depth}px)`
  }

  animate(timestamp) {
    if (this.lastTime === null) this.lastTime = timestamp
    const delta = Math.min(0.05, Math.max(0, timestamp - this.lastTime) / 1000)
    this.lastTime = timestamp

    const damping = 1 - Math.exp(-delta / 0.12)
    this.pointerDamped.x += (this.pointer.x - this.pointerDamped.x) * damping
    this.pointerDamped.y += (this.pointer.y - this.pointerDamped.y) * damping
    this.applyPlaneTransform(this.pointerDamped.x, this.pointerDamped.y)

    if (!this.reducedMotion) {
      this.tracks.forEach((track, columnIndex) => {
        const direction = this.options.direction === 'up' ? 1 : -1
        const alternatingDirection = columnIndex % 2 === 0 ? 1 : -1
        const targetVelocity =
          columnIndex === this.hoveredColumn
            ? 0
            : this.options.speed * this.columnFactor(columnIndex) * direction * alternatingDirection
        const ease = 1 - Math.exp(-delta / (targetVelocity === 0 ? 0.16 : 0.28))
        this.velocities[columnIndex] += (targetVelocity - this.velocities[columnIndex]) * ease
        const height = this.columnHeights[columnIndex]
        this.offsets[columnIndex] =
          (this.offsets[columnIndex] + this.velocities[columnIndex] * delta + height) % height
        track.style.transform = `translate3d(0, ${-this.offsets[columnIndex]}px, 0)`
      })
    }

    this.animationFrame = requestAnimationFrame(this.animate)
  }
}

window.DriftWall = DriftWall
