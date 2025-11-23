import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import ParticleField from './ParticleField';
import AnimatedShapes from './AnimatedShapes';
import Lighting from './Lighting';

export default function Scene({ interactive = false }) {
  return (
    <Canvas
      className="absolute inset-0"
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
      
      {interactive && <OrbitControls enableZoom={false} enablePan={false} />}
      
      <Lighting />
      <ParticleField count={1000} />
      <AnimatedShapes />
    </Canvas>
  );
}
