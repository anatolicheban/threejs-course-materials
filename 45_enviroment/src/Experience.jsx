import { useFrame } from '@react-three/fiber'
import { OrbitControls, SoftShadows, useHelper, BakeShadows, AccumulativeShadows, RandomizedLight, ContactShadows, Sky, Environment, Lightformer } from '@react-three/drei'
import { useRef } from 'react'
import { Perf } from 'r3f-perf'
import { DirectionalLightHelper } from 'three'
import { useControls } from 'leva'

export default function Experience() {
    // SoftShadows({
    //     // frustum: 3.75,
    //     size: 5,
    //     // near: 9.5,
    //     samples: 17,
    //     // rings: 11,
    //     focus: .1
    // })

    const { color, opacity, blur, sunPosition } = useControls('contact shadows', {
        color: '#1d8f75',
        opacity: { value: 0.4, min: 0, max: 1 },
        blur: { value: 2.8, min: 0, max: 10 },
        sunPosition: { value: [1, 2, 3] }
    })

    const { envMapIntensity } = useControls('environment map', {
        envMapIntensity: { value: 1, min: 0, max: 12 }
    })

    const cube = useRef()

    const dirLight = useRef()

    useHelper(dirLight, DirectionalLightHelper)

    useFrame((state, delta) => {
        cube.current.rotation.y += delta * 0.2
        // const time = state.clock.elapsedTime
        // cube.current.position.x = 2 + Math.sin(time)
    })

    return <>

        <Environment
            background
            resolution={32}
            preset="sunset"
            ground={{
                height: 7,
                radius: 28,
                scale: 100
            }}
        // files={[
        //     './environmentMaps/2/px.jpg',
        //     './environmentMaps/2/nx.jpg',
        //     './environmentMaps/2/py.jpg',
        //     './environmentMaps/2/ny.jpg',
        //     './environmentMaps/2/pz.jpg',
        //     './environmentMaps/2/nz.jpg',
        // ]}
        // files="./environmentMaps/the_sky_is_on_fire_2k.hdr"
        >
            <color args={['#000000']} attach="background" />

            <Lightformer
                position-z={- 5}
                scale={10}
                color="red"
                intensity={10}
                form="ring"
            />
            {/* <mesh position-z={- 5} scale={10}>
                <planeGeometry />
                <meshBasicMaterial color={[2, 0, 0]} />
            </mesh> */}
        </Environment>


        {/* <BakeShadows /> */}

        <color args={['ivory']} attach='background' />

        <Perf position="top-left" />

        <OrbitControls makeDefault />
        {/* 
        <AccumulativeShadows
            position={[0, - 0.99, 0]}
            scale={10}
            color="#316d39"
            opacity={0.8}
            frames={Infinity}
            temporal
            blend={100}
        >
            <RandomizedLight
                amount={8}
                radius={1}
                ambient={0.5}
                intensity={1}
                position={[1, 2, 3]}
                bias={0.001}
            />
        </AccumulativeShadows> */}

        {/* <Sky sunPosition={sunPosition} /> */}

        <ContactShadows
            position={[0, - 0.99, 0]}
            scale={10}
            resolution={512}
            far={5}
            color={color}
            opacity={opacity}
            blur={blur}
            frames={1}
        />
        {/* <directionalLight
            shadow-mapSize={[1024, 1024]}
            shadow-camera-near={1}
            shadow-camera-far={10}
            shadow-camera-top={5}
            shadow-camera-right={5}
            shadow-camera-bottom={- 5}
            shadow-camera-left={- 5}
            castShadow
            position={sunPosition}
            intensity={1.5}
            ref={dirLight}
        />
        <ambientLight intensity={0.5} /> */}

        <mesh position-y={1} castShadow position-x={- 2}>
            <sphereGeometry />
            <meshStandardMaterial color="orange" envMapIntensity={envMapIntensity} />
        </mesh>

        <mesh position-y={1} castShadow ref={cube} position-x={2} scale={1.5}>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" envMapIntensity={envMapIntensity} />
        </mesh>

        <mesh receiveShadow position-y={0} rotation-x={- Math.PI * 0.5} scale={10}>
            <planeGeometry />
            <meshStandardMaterial color="greenyellow" envMapIntensity={envMapIntensity} />
        </mesh>

    </>
}