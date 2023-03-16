import { useFrame, extend, useThree } from '@react-three/fiber'
import React, { useRef } from 'react'
import { Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import CustomObject from './CustomObject'

const Experience = () => {

  const boxRef = useRef(null)
  const groupRef = useRef(null)

  const { camera, gl } = useThree()

  extend({ OrbitControls })

  useFrame((state, delta) => {
    boxRef.current.rotation.y += 1 * delta
    // state.camera.position.x = Math.sin(state.clock.elapsedTime) * 10
    // state.camera.position.z = Math.cos(state.clock.elapsedTime) * 10
    // state.camera.lookAt(0, 0, 0)
    // groupRef.current.rotation.y += 1 * delta
  })
  return (
    <>
      <orbitControls args={[camera, gl.domElement]} />

      <directionalLight position={[1, 2, 3]} intensity={1.5} />

      <ambientLight intensity={0.5} />

      <group ref={groupRef}>
        <mesh position-x={-2}>
          <sphereGeometry />
          <meshStandardMaterial color={'orange'} />
        </mesh>
        <mesh ref={boxRef} rotation-y={Math.PI / 4} scale={1.3} position={[2, 0, 0]}>
          {/* <sphereGeometry args={[1.5, 32, 32]} /> */}
          <boxGeometry scale={1.5} />
          <meshStandardMaterial color={'mediumpurple'} />
        </mesh>
      </group >
      <mesh position-y={-1} rotation-x={-Math.PI / 2} scale={10}>
        <planeGeometry />
        <meshStandardMaterial />
      </mesh>

      <CustomObject />
    </>
  )
}

export default Experience