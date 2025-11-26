import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';

export default function LegalModel({ modelPath, scale = 1, rotationSpeed = 0.5 }) {
  const meshRef = useRef();
  const { scene } = useGLTF(modelPath);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  return (
    <Center>
      <primitive 
        ref={meshRef}
        object={scene} 
        scale={scale}
      />
    </Center>
  );
}
