import React, { useEffect, useMemo, useRef } from 'react'
import { DoubleSide } from 'three'

const CustomObject = () => {

  const geometryRef = useRef(null)


  useEffect(() => {
    geometryRef.current.computeVertexNormals()
  }, [])

  const verticesCount = 10 * 3

  const positions = useMemo(() => {
    const pos = new Float32Array(verticesCount * 3)

    for (let i = 0; i < pos.length; i++) {
      pos[i] = (Math.random() - .5) * 3
    }

    return pos
  }, [verticesCount])

  return (
    <mesh>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute attach={'attributes-position'} count={verticesCount} itemSize={3} array={positions} />
      </bufferGeometry>
      <meshStandardMaterial side={DoubleSide} color={'red'} />
    </mesh>
  )
}

export default CustomObject