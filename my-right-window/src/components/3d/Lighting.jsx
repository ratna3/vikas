import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Lighting() {
  const light1 = useRef();
  const light2 = useRef();
  
  useFrame((state) => {
    if (light1.current) {
      light1.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 3;
      light1.current.position.z = Math.cos(state.clock.elapsedTime * 0.5) * 3;
    }
    if (light2.current) {
      light2.current.position.x = Math.cos(state.clock.elapsedTime * 0.3) * 4;
      light2.current.position.z = Math.sin(state.clock.elapsedTime * 0.3) * 4;
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight
        ref={light1}
        position={[2, 2, 2]}
        intensity={1.5}
        color="#00ff41"
        distance={10}
      />
      <pointLight
        ref={light2}
        position={[-2, -2, 2]}
        intensity={1.2}
        color="#00d9ff"
        distance={10}
      />
      <spotLight
        position={[0, 5, 0]}
        angle={0.6}
        penumbra={1}
        intensity={0.5}
        color="#ff6b35"
      />
    </>
  );
}
