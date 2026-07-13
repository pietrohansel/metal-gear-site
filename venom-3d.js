import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const container = document.getElementById('div3dVenom')
if (!container) throw new Error('#div3dVenom not found')

// =========================================================
// AJUSTE AQUI — Posição e rotação do modelo 3D
// =========================================================
// startPosition = posição inicial (quando a seção aparece)
// endPosition   = posição final (quando a seção sai da tela)
//   x → esquerda (-) / direita (+)
//   y → baixo (-) / cima (+)
//   z → frente (+) / trás (-)
// size → valor maior = modelo maior
// Para deixar PARADO, use o mesmo valor em start e end.
// =========================================================
const MODEL_ANIMATION = {
  startPosition: new THREE.Vector3(0.0, -4, 0),
  endPosition: new THREE.Vector3(-0.8, -0.4, 0),
  startRotation: new THREE.Euler(0, 0, 0),
  endRotation: new THREE.Euler(0, 0, 0),
  size: 6.0,
}

let model3D = null
let currentProgress = 0
let targetProgress = 0

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  45,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
)
// =========================================================
// AJUSTE AQUI — Posição da CÂMERA (ponto de vista)
// =========================================================
//   x → esquerda (-) / direita (+)
//   y → baixo (-) / cima (+)
//   z → próximo (+) / distante (-)
// Quanto maior o z, mais longe a câmera fica do modelo.
// =========================================================
camera.position.set(4, 3, 7)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setSize(container.clientWidth, container.clientHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x000000, 0)
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.5
container.appendChild(renderer.domElement)

// Controles Orbit — desabilitado auto-rotate
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.08
controls.autoRotate = false
controls.minDistance = 3
controls.maxDistance = 15
controls.target.set(0, 0, 0)

// Neutral lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const keyLight = new THREE.DirectionalLight(0xffffff, 2.5)
keyLight.position.set(4, 6, 4)
scene.add(keyLight)

const fillLight = new THREE.DirectionalLight(0xffffff, 1.2)
fillLight.position.set(-3, 2, -3)
scene.add(fillLight)

const rimLight = new THREE.DirectionalLight(0xffffff, 1)
rimLight.position.set(-2, 3, 4)
scene.add(rimLight)

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6)
scene.add(hemiLight)

const loader = new GLTFLoader()
loader.load(
  'src/assets/images/icons/3d_icon/venom_snakes_army.glb',
  (gltf) => {
    const model = gltf.scene
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = false
        child.receiveShadow = false
      }
    })
    const box = new THREE.Box3().setFromObject(model)
    const size = box.getSize(new THREE.Vector3()).length()
    const scale = MODEL_ANIMATION.size / size
    model.scale.set(scale, scale, scale)
    model.position.copy(MODEL_ANIMATION.startPosition)
    model.rotation.copy(MODEL_ANIMATION.startRotation)

    model3D = model
    scene.add(model)
  },
  undefined,
  (error) => console.error('Erro ao carregar GLB:', error)
)

function resize() {
  const w = container.clientWidth
  const h = container.clientHeight
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h)
}
window.addEventListener('resize', resize)

function onScroll() {
  const section = document.querySelector('.venom-3d-section')
  if (!section) return

  const sectionRect = section.getBoundingClientRect()
  const windowH = window.innerHeight
  const sectionTop = sectionRect.top
  const sectionHeight = sectionRect.height

  targetProgress = Math.max(0, Math.min(1, (windowH - sectionTop) / (sectionHeight + windowH)))
}

window.addEventListener('scroll', onScroll, { passive: true })
onScroll()

function animate() {
  requestAnimationFrame(animate)

  currentProgress += (targetProgress - currentProgress) * 0.08

  if (model3D) {
    model3D.position.lerpVectors(
      MODEL_ANIMATION.startPosition,
      MODEL_ANIMATION.endPosition,
      currentProgress
    )

    model3D.rotation.set(
      THREE.MathUtils.lerp(
        MODEL_ANIMATION.startRotation.x,
        MODEL_ANIMATION.endRotation.x,
        currentProgress
      ),
      THREE.MathUtils.lerp(
        MODEL_ANIMATION.startRotation.y,
        MODEL_ANIMATION.endRotation.y,
        currentProgress
      ),
      THREE.MathUtils.lerp(
        MODEL_ANIMATION.startRotation.z,
        MODEL_ANIMATION.endRotation.z,
        currentProgress
      )
    )
  }

  controls.update()
  renderer.render(scene, camera)
}
animate()
