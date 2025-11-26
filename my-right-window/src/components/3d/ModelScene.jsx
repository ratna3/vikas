import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import LegalModel from './LegalModel';
import PropTypes from 'prop-types';

export default function ModelScene({ modelPath, scale = 1, cameraPosition = [0, 0, 5] }) {
  return (
    <Canvas
      className="w-full h-full"
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <PerspectiveCamera makeDefault position={cameraPosition} fov={50} />
      
      {/* Lighting Setup */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      
      <LegalModel modelPath={modelPath} scale={scale} rotationSpeed={0.3} />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
}

ModelScene.propTypes = {
  modelPath: PropTypes.string.isRequired,
  scale: PropTypes.number,
  cameraPosition: PropTypes.arrayOf(PropTypes.number),
};
