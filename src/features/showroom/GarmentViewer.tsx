import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, useTexture, Environment, Html } from '@react-three/drei'
import * as THREE from 'three'

interface Props {
  modelUrl?: string
  patternUrl?: string
  color?: string
}

const BLANK_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

function Garment({ modelUrl, patternUrl, color = '#ffffff' }: Required<Pick<Props, 'modelUrl'>> & Props) {
  const { scene } = useGLTF(modelUrl)
  const texture = useTexture(patternUrl ?? BLANK_PIXEL)

  const cloned = useMemo(() => {
    const s = scene.clone(true)
    if (patternUrl && texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      texture.flipY = false
      texture.colorSpace = THREE.SRGBColorSpace
    }
    s.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (mesh.isMesh) {
        mesh.material = new THREE.MeshStandardMaterial({
          map: patternUrl ? texture : null,
          color: new THREE.Color(color),
          roughness: 0.75,
          metalness: 0.05,
        })
      }
    })
    return s
  }, [scene, texture, patternUrl, color])

  return <primitive object={cloned} />
}

function Placeholder() {
  return (
    <mesh>
      <cylinderGeometry args={[0.6, 0.8, 1.8, 32]} />
      <meshStandardMaterial color="#3a3446" roughness={0.9} />
    </mesh>
  )
}

/** SHOW-01 / SHOW-02 3D 피팅 뷰어 */
export default function GarmentViewer({ modelUrl, patternUrl, color }: Props) {
  return (
    <div className="aspect-square w-full overflow-hidden rounded-xl border border-line bg-ink-soft">
      <Canvas camera={{ position: [0, 0.6, 3.2], fov: 42 }} dpr={[1, 2]}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 3]} intensity={1.1} />
        <directionalLight position={[-3, 2, -2]} intensity={0.4} />
        <Suspense fallback={<Html center><span className="text-xs text-muted">모델 불러오는 중</span></Html>}>
          {modelUrl ? (
            <Garment modelUrl={modelUrl} patternUrl={patternUrl} color={color} />
          ) : (
            <Placeholder />
          )}
          <Environment preset="studio" />
        </Suspense>
        <OrbitControls enablePan={false} minDistance={1.8} maxDistance={6} autoRotate autoRotateSpeed={0.6} />
      </Canvas>
    </div>
  )
}
