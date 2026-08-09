import { useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Html } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three'

interface Props {
  modelUrl?: string
  patternUrl?: string
  color?: string
}

const gltfLoader = new GLTFLoader()
const textureLoader = new THREE.TextureLoader()

/**
 * useGLTF/useTexture(drei)는 로딩 실패 시 비동기 콜백 안에서 에러를 던지는데,
 * 이 경로는 React 렌더 사이클 밖이라 ErrorBoundary로 잡히지 않는 경우가 있었다
 * (실제로 앱 전체가 크래시났음). 그래서 여기선 THREE 로더를 직접 콜백으로 호출해
 * 성공/실패를 전부 로컬 state로만 다룬다 — 어떤 경우에도 throw하지 않는다.
 */
function useSafeGLTF(url?: string) {
  const [scene, setScene] = useState<THREE.Group | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setScene(null)
    setFailed(false)
    if (!url) return
    let cancelled = false
    gltfLoader.load(
      url,
      (gltf) => { if (!cancelled) setScene(gltf.scene) },
      undefined,
      () => { if (!cancelled) setFailed(true) },
    )
    return () => { cancelled = true }
  }, [url])

  return { scene, failed }
}

function useSafeTexture(url?: string) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    setTexture(null)
    if (!url) return
    let cancelled = false
    textureLoader.load(
      url,
      (tex) => { if (!cancelled) setTexture(tex) },
      undefined,
      () => { if (!cancelled) setTexture(null) },
    )
    return () => { cancelled = true }
  }, [url])

  return texture
}

function Garment({ scene, texture, color = '#ffffff' }: { scene: THREE.Group; texture: THREE.Texture | null; color?: string }) {
  const cloned = useMemo(() => {
    const s = scene.clone(true)
    if (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      texture.flipY = false
      texture.colorSpace = THREE.SRGBColorSpace
    }
    s.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (mesh.isMesh) {
        mesh.material = new THREE.MeshStandardMaterial({
          map: texture,
          color: new THREE.Color(color),
          roughness: 0.75,
          metalness: 0.05,
        })
      }
    })
    return s
  }, [scene, texture, color])

  return <primitive object={cloned} />
}

function Placeholder() {
  return (
    <mesh>
      <cylinderGeometry args={[0.6, 0.8, 1.8, 32]} />
      <meshStandardMaterial color="#d9c3ae" roughness={0.9} />
    </mesh>
  )
}

/** SHOW-01 / SHOW-02 3D 피팅 뷰어 */
export default function GarmentViewer({ modelUrl, patternUrl, color }: Props) {
  const { scene, failed } = useSafeGLTF(modelUrl)
  const texture = useSafeTexture(patternUrl)

  return (
    <div className="aspect-square w-full overflow-hidden rounded-xl border border-line bg-ink-soft">
      <Canvas camera={{ position: [0, 0.6, 3.2], fov: 42 }} dpr={[1, 2]}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 3]} intensity={1.1} />
        <directionalLight position={[-3, 2, -2]} intensity={0.4} />
        {scene ? (
          <Garment scene={scene} texture={texture} color={color} />
        ) : modelUrl && !failed ? (
          <Html center><span className="text-xs text-muted">모델 불러오는 중</span></Html>
        ) : (
          <Placeholder />
        )}
        <Environment preset="studio" />
        <OrbitControls enablePan={false} minDistance={1.8} maxDistance={6} autoRotate autoRotateSpeed={0.6} />
      </Canvas>
    </div>
  )
}
