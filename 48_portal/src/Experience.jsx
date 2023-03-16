import { Center, OrbitControls, Sparkles, useGLTF, useTexture, shaderMaterial } from '@react-three/drei'
import { useEffect } from 'react'
import { Color } from 'three'
import portalVertexShader from './shaders/portal/vertex.glsl'
import portalFragmentShader from './shaders/portal/vertex.glsl'
import { extend } from '@react-three/fiber'

export default function Experience() {

    const { nodes } = useGLTF('./model/portal.glb')

    const PortalMaterial = shaderMaterial({
        uTime: 0,
        uColorStart: new Color('#fff'),
        uColorEnd: new Color('#000')
    },
        portalVertexShader,
        portalFragmentShader
    )

    extend({ PortalMaterial })

    const texture = useTexture('./model/baked.jpg')

    return <>
        <color attach={'background'} args={['#030202']} />

        <OrbitControls makeDefault />

        <Center>
            <mesh
                geometry={nodes.baked.geometry}>
                <meshBasicMaterial map={texture} map-flipY={false} />
            </mesh>

            <mesh position={nodes.poleLightA.position} geometry={nodes.poleLightA.geometry}>
                <meshBasicMaterial color={'ffffe5'} />
            </mesh>

            <mesh position={nodes.poleLightB.position} geometry={nodes.poleLightB.geometry}>
                <meshBasicMaterial color={'ffffe5'} />
            </mesh>

            <mesh geometry={nodes.portalLight.geometry} position={nodes.portalLight.position} rotation={nodes.portalLight.rotation}>
                <portalMaterial />
            </mesh>

            <Sparkles
                size={6}
                scale={[4, 2, 4]}
                position-y={1}
                speed={0.2}
                count={40}
            />
        </Center>

    </>
}