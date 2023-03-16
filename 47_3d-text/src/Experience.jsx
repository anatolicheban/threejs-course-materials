import { Center, OrbitControls, Text3D, useMatcapTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import { useEffect, useRef, useState } from 'react'
import { MeshMatcapMaterial, sRGBEncoding, TorusGeometry } from 'three'

const torusGeometry = new TorusGeometry(1, .6, 16, 64)
const material = new MeshMatcapMaterial()

export default function Experience() {
    const [matcap] = useMatcapTexture('045C5C_0DBDBD_049393_04A4A4', 512)

    const groupRef = useRef(null)

    useFrame((state, delta) => {
        groupRef.current.children.forEach(child => {
            child.rotation.y += Math.PI * delta / 5
        })
    })

    // const [torus, setTorus] = useState()
    // const [material, setMaterial] = useState()

    useEffect(() => {
        matcap.encoding = sRGBEncoding
        matcap.needsUpdate = true
        material.matcap = matcap
        material.needsUpdate = true
    }, [])

    const tempArray = Array(100).fill(undefined)
    return <>

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        {/* <torusGeometry ref={setTorus} args={[1, 0.6, 16, 64]} />
        <meshMatcapMaterial ref={setMaterial} matcap={matcap} /> */}

        <Center>
            <Text3D
                font="./fonts/helvetiker_regular.typeface.json"
                size={.75}
                height={.2}
                curveSegments={12}
                bevelEnabled
                bevelThickness={0.02}
                bevelSize={.02}
                bevelOffset={0}
                bevelSegments={5}
                material={material}
            >
                TOLIK!!!
            </Text3D>
        </Center>
        <group ref={groupRef}>
            {tempArray.map((item, index) => {
                return <mesh
                    material={material}
                    geometry={torusGeometry}
                    position={[
                        (Math.random() - 0.5) * 10,
                        (Math.random() - 0.5) * 10,
                        (Math.random() - 0.5) * 10
                    ]}
                    key={index}
                    scale={0.2 + Math.random() * 0.2}
                    rotation={[
                        Math.random() * Math.PI,
                        Math.random() * Math.PI,
                        0
                    ]}
                />
            })}
        </group>

    </>
}