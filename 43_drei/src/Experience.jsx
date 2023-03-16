import { OrbitControls, MeshReflectorMaterial, Text, Html, TransformControls, PivotControls, Float } from "@react-three/drei"
import { useRef } from "react"

export default function Experience() {

    const cubeRef = useRef()
    const sphere = useRef()

    return <>
        <OrbitControls makeDefault />
        <directionalLight position={[1, 2, 3]} intensity={1.5} />
        <ambientLight intensity={0.5} />

        <PivotControls anchor={[0, 0, 0]} depthTest={false} lineWidth={4} axisColors={['#9381ff', '#ff4d6d', '#7ae582']} fixed={true} scale={100}>

            <mesh ref={sphere} position-x={- 2}>
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
                <Html occlude={[sphere, cubeRef]} distanceFactor={6} wrapperClass="label" center position={[1, 1, 0]}>That's a sphere 👍</Html>
            </mesh>
        </PivotControls>
        <TransformControls object={cubeRef} />
        <mesh ref={cubeRef} position-x={2} scale={1.5}>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
        </mesh>

        <Float>
            <mesh position-y={- 1} rotation-x={- Math.PI * 0.5} scale={10}>
                <planeGeometry />
                {/* <meshStandardMaterial color="greenyellow" /> */}
                <MeshReflectorMaterial />
            </mesh>
        </Float>

        {/* <Text fontSize={.5} color={'salmon'} font="./bangers-v20-latin-regular.woff">
            I LOVE R#F
            <meshNormalMaterial />
        </Text> */}
    </>
}