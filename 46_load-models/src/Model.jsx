import React from 'react'
import { Clone, useGLTF } from '@react-three/drei'

const Model = () => {

  // const model = useLoader(
  //   GLTFLoader,
  //   './hamburger.glb',
  //   (loader) => {
  //     const dracoLoadear = new DRACOLoader()
  //     dracoLoader.setDecoderPath('./draco/')
  //     loader.setDRACOLoader(dracoLoader)
  //   }
  // )

  const model = useGLTF('./hamburger-draco.glb')

  return <>
    <Clone object={model.scene} scale={0.35} position-x={- 4} />
    <Clone object={model.scene} scale={0.35} position-x={0} />
    <Clone object={model.scene} scale={0.35} position-x={4} />
  </>
}

export default Model

useGLTF.preload('./hamburger-draco.glb')