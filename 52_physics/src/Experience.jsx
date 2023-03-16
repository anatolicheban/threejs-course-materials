import { OrbitControls } from '@react-three/drei'
import { CuboidCollider, CylinderCollider, Debug, InstancedRigidBodies, Physics, RigidBody } from '@react-three/rapier'
import { Perf } from 'r3f-perf'
import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Euler, Matrix4, Quaternion, Vector3 } from 'three'
import { useGLTF } from '@react-three/drei'

export default function Experience() {

    let [audio, setAudio] = useState(() => {
        return new Audio('./hit.mp3')
    })

    const hamburger = useGLTF('./hamburger.glb')

    const cube = useRef()
    const twister = useRef()
    const cubes = useRef()

    useFrame((state) => {
        let time = state.clock.getElapsedTime()

        let euler = new Euler(0, time * 3, 0)
        const quat = new Quaternion()
        quat.setFromEuler(euler)

        twister.current.setNextKinematicRotation(quat)

        const angle = time * .5

        let x = Math.cos(angle)
        let z = Math.sin(angle)

        twister.current.setNextKinematicTranslation({ x, y: -.8, z })
    })

    const cubeJump = () => {
        console.log('jump!')
        cube.current.applyImpulse({ x: 0, y: 5, z: 0 })
        cube.current.applyTorqueImpulse({ x: Math.random() - 0.5, y: Math.random() - 0.5, z: Math.random() - 0.5 })
        // console.log(cube.current.mass());
    }

    const collisionEnter = () => {
        audio.currentTime = 0;
        audio.volume = .5 + Math.random() * .3
        audio.play()
    }

    let cubesCount = 4

    useEffect(() => {
        for (let i = 0; i < cubesCount; i++) {
            let matrix = new Matrix4()
            matrix.compose(
                new Vector3(i * 2, 0, 0),
                new Quaternion(),
                new Vector3(1, 1, 1),
            )
            cubes.current.setMatrixAt(i, matrix)
        }
    }, [])

    return <>

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        <directionalLight castShadow position={[1, 2, 3]} intensity={1.5} />
        <ambientLight intensity={0.5} />

        <Physics gravity={[0, - 9.81, 0]}>

            <Debug />

            <RigidBody colliders="ball" position={[- 1.5, 2, 0]}>
                <mesh castShadow>
                    <sphereGeometry />
                    <meshStandardMaterial color="orange" />
                </mesh>
            </RigidBody>

            <RigidBody colliders={false} restitution={0} friction={.7} onClick={cubeJump} ref={cube} position={[1.5, 2, 0]}>
                <mesh castShadow>
                    <boxGeometry />
                    <meshStandardMaterial color="mediumpurple" />
                </mesh>
                <CuboidCollider mass={2} args={[.5, .5, .5]} />
            </RigidBody>

            <RigidBody type='fixed'>
                <mesh receiveShadow position-y={- 1.25}>
                    <boxGeometry args={[10, 0.5, 10]} />
                    <meshStandardMaterial color="greenyellow" />
                </mesh>
            </RigidBody>

            <RigidBody
                onCollisionEnter={collisionEnter}
                // onCollisionExit={() => { console.log('exit') }}
                position={[0, - 0.8, 0]}
                friction={0}
                type="kinematicPosition"
                ref={twister}
            >
                <mesh castShadow scale={[0.4, 0.4, 3]}>
                    <boxGeometry />
                    <meshStandardMaterial color="red" />
                </mesh>
            </RigidBody>

            <RigidBody colliders={false} position={[0, 4, 0]}>
                <CylinderCollider args={[0.5, 1.25]} />
                <primitive object={hamburger.scene} scale={0.25} />
            </RigidBody>

            <RigidBody type="fixed">
                <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, 5.5]} />
                <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, - 5.5]} />
                <CuboidCollider args={[0.5, 2, 5]} position={[5.5, 1, 0]} />
                <CuboidCollider args={[0.5, 2, 5]} position={[- 5.5, 1, 0]} />
            </RigidBody>

            <InstancedRigidBodies>
                <instancedMesh ref={cubes} castShadow args={[null, null, cubesCount]}>
                    <boxGeometry />
                    <meshStandardMaterial color={'tomato'} />
                </instancedMesh>
            </InstancedRigidBodies>

        </Physics>
    </>
}