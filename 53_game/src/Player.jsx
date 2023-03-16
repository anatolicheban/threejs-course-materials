import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody, useRapier } from "@react-three/rapier";
import React, { useEffect, useRef, useState } from "react";
import { MeshStandardMaterial, Vector3 } from "three";
import { useGame } from "./stores/useGame";

const Player = () => {
  const start = useGame((state) => state.start)
  const end = useGame((state) => state.end)
  const blocksCount = useGame((state) => state.blocksCount)
  const restart = useGame((state) => state.restart)
  const body = useRef();

  const [smoothedCameraPosition] = useState(() => new Vector3(10, 10, 10))
  const [smoothedCameraTarget] = useState(() => new Vector3())

  const { rapier, world } = useRapier();
  const rapierWorld = world.raw();

  const [subscribeKeys, getKeys] = useKeyboardControls();

  useFrame((state, delta) => {
    const { forward, backward, leftward, rightward } = getKeys();

    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const impulseStrength = 0.6 * delta;
    const torqueStrength = 0.2 * delta;

    if (forward) {
      impulse.z -= impulseStrength;
      torque.x -= torqueStrength;
    }

    if (backward) {
      impulse.z += impulseStrength;
      torque.x += torqueStrength;
    }

    if (leftward) {
      impulse.x -= impulseStrength;
      torque.z += torqueStrength;
    }

    if (rightward) {
      impulse.x += impulseStrength
      torque.z -= torqueStrength;
    }

    body.current.applyImpulse(impulse, true);
    body.current.applyTorqueImpulse(torque, true);

    //Camera 
    let bodyPos = body.current.translation()
    let cameraPosition = new Vector3().copy(bodyPos)
    cameraPosition.z += 2.25
    cameraPosition.y += 0.655

    const cameraTarget = new Vector3().copy(bodyPos)
    cameraTarget.y += .25

    smoothedCameraPosition.lerp(cameraPosition, 10 * delta)
    smoothedCameraTarget.lerp(cameraTarget, 10 * delta)

    state.camera.position.copy(smoothedCameraPosition)
    state.camera.lookAt(smoothedCameraTarget)

    if (bodyPos.z < - (blocksCount * 4 + 2)) {
      end()
    }
    if (bodyPos.y < - 4) {
      restart()
    }
  });

  const jump = () => {
    const origin = body.current.translation()
    origin.y -= 0.31;
    const dir = { x: 0, y: -1, z: 0 };

    const ray = new rapier.Ray(origin, dir);

    const hit = rapierWorld.castRay(ray, 10, true);
    if (hit?.toi < .15) {
      body.current.applyImpulse({ x: 0, y: 0.5, z: 0 }, true);
    }
  };

  let reset = () => {
    body.current.setTranslation({ x: 0, y: 1, z: 0 })
    body.current.setLinvel({ x: 0, y: 0, z: 0 })
    body.current.setAngvel({ x: 0, y: 0, z: 0 })
  }

  useEffect(() => {

    const unsubscribeReset = useGame.subscribe(
      (state) => state.phase,
      (value) => {
        if (value === 'ready') {
          reset()
        }
      },
    )

    const unsubscribe = subscribeKeys(
      (state) => state.jump,
      (value) => {
        if (value) {
          jump();
        }
      }
    );

    const unsubscribeAny = subscribeKeys(
      () => {
        start()
      }
    )


    return () => {
      unsubscribe()
      unsubscribeAny()
      unsubscribeReset()
    }
  }, []);

  return (
    <RigidBody
      angularDamping={0.5}
      linearDamping={0.5}
      ref={body}
      friction={1}
      restitution={0.2}
      colliders={"ball"}
      position={[0, 1, 0]}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial flatShading color={"mediumpurple"} />
      </mesh>
    </RigidBody>
  );
};

export default Player;
