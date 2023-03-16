import { useFrame } from '@react-three/fiber'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import React, { useMemo, useRef, useState } from 'react'
import { BoxGeometry, ColorManagement, Euler, MeshStandardMaterial, Quaternion } from 'three'
import { Float, Text, useGLTF } from '@react-three/drei'

ColorManagement.legacyMode = false

const boxGeometry = new BoxGeometry(1, 1, 1)

const floor1Material = new MeshStandardMaterial({ color: 'limegreen' })
const floor2Material = new MeshStandardMaterial({ color: 'greenyellow' })
const obstacleMaterial = new MeshStandardMaterial({ color: 'orangered' })
const wallMaterial = new MeshStandardMaterial({ color: 'slategrey' })

export function BlockStart({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <Float floatIntensity={0.25} rotationIntensity={0.25}>
        <Text
          font="./bebas-neue-v9-latin-regular.woff"
          scale={0.5}
          maxWidth={0.25}
          lineHeight={0.75}
          textAlign="right"
          position={[0.75, 0.65, 0]}
          rotation-y={- 0.25}
        >
          Marble Race
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </Float>
      <mesh
        geometry={boxGeometry}
        receiveShadow
        position={[0, -.1, 0]}
        scale={[4, .2, 4]}
        material={floor1Material}
      />
    </group>
  )
}

export function BlockSpinner({ position = [0, 0, 0] }) {

  const [speed] = useState(() => (Math.random() + .2) * (Math.random() < .5 ? -1 : 1))

  let obsRef = useRef()

  useFrame((state) => {
    let time = state.clock.getElapsedTime()

    let euler = new Euler(0, time * speed, 0)
    let quat = new Quaternion()
    quat.setFromEuler(euler)

    obsRef.current.setNextKinematicRotation(quat)
  })

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        receiveShadow
        position={[0, -.1, 0]}
        scale={[4, .2, 4]}
        material={floor2Material}
      />
      <RigidBody ref={obsRef} type={'kinematicPosition'} position={[0, .3, 0]} restitution={.2} friction={0}>
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, .3, .3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  )
}

export function BlockLimbo({ position = [0, 0, 0] }) {

  const [timeOffset] = useState(() => (Math.PI * 2 * Math.random()))

  let obsRef = useRef()

  useFrame((state) => {
    let time = state.clock.getElapsedTime()

    let y = Math.sin(time + timeOffset) + 1.15

    obsRef.current.setNextKinematicTranslation({ x: position[0], y, z: position[2] })
  })

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        receiveShadow
        position={[0, -.1, 0]}
        scale={[4, .2, 4]}
        material={floor2Material}
      />
      <RigidBody ref={obsRef} type={'kinematicPosition'} position={[0, .3, 0]} restitution={.2} friction={0}>
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, .3, .3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  )
}

export function BlockAxe({ position = [0, 0, 0] }) {

  const [timeOffset] = useState(() => (Math.PI * 2 * Math.random()))

  let obsRef = useRef()

  useFrame((state) => {
    let time = state.clock.getElapsedTime()

    const x = Math.sin(time + timeOffset) * 1.25
    obsRef.current.setNextKinematicTranslation({ x: position[0] + x, y: position[1] + .75, z: position[2] })
  })

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        receiveShadow
        position={[0, -.1, 0]}
        scale={[4, .2, 4]}
        material={floor2Material}
      />
      <RigidBody ref={obsRef} type={'kinematicPosition'} position={[0, .3, 0]} restitution={.2} friction={0}>
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[1.5, 1.5, 0.3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  )
}

export function BlockEnd({ position = [0, 0, 0] }) {

  const hamburger = useGLTF('./hamburger.glb')
  hamburger.scene.children.forEach((mesh) => {
    mesh.castShadow = true
  })

  return (
    <group position={position}>
      <Text
        font="./bebas-neue-v9-latin-regular.woff"
        scale={2}
        position={[0, 2.25, 2]}
      >
        FINISH
        <meshBasicMaterial toneMapped={false} />
      </Text>
      <mesh
        geometry={boxGeometry}
        receiveShadow
        position={[0, 0, 0]}
        scale={[4, .2, 4]}
        material={floor1Material}
      />
      <RigidBody type='fixed' colliders="hull" position={[0, 0.25, 0]} restitution={0.2} friction={0}>
        <primitive object={hamburger.scene} scale={0.2} />
      </RigidBody>
    </group >
  )
}

export function Bounds({ length = 1 }) {
  return (
    <RigidBody type='fixed' restitution={.2} friction={0}>

      <mesh
        position={[2.15, 0.75, -(length * 2) + 2]}
        geometry={boxGeometry}
        material={wallMaterial}
        scale={[0.3, 1.5, 4 * length]}
        castShadow
      />

      <mesh
        position={[-2.15, .75, -(length * 2) + 2]}
        geometry={boxGeometry}
        material={wallMaterial}
        scale={[0.3, 1.5, 4 * length]}
        receiveShadow
      />
      <mesh
        position={[0, 0.75, -(length * 4) + 2]}
        geometry={boxGeometry}
        material={wallMaterial}
        scale={[4, 1.5, .3]}
        receiveShadow
      />
      <CuboidCollider restitution={.2} friction={1} args={[2, .1, 2 * length]} position={[0, -.1, -(length * 2) + 2]} />
    </RigidBody>
  )


}


const Level = ({ count = 5, types = [BlockSpinner, BlockAxe, BlockLimbo], seed = 0 }) => {

  let blocks = useMemo(() => {
    const blocksArr = []
    for (let i = 0; i < count; i++) {
      let type = types[Math.floor(Math.random() * types.length)]
      blocksArr.push(type)
    }
    return blocksArr
  }, [count, types, seed])

  return (
    <>
      <BlockStart position={[0, 0, 0]} />
      {blocks.map((Block, index) => <Block key={index} position={[0, 0, -(index + 1) * 4]} />)}
      <BlockEnd position={[0, 0, -(count + 1) * 4]} />
      <Bounds length={count + 2} />
    </>
  )
}

export default Level