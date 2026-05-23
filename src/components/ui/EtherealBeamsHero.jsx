import React, { forwardRef, useImperativeHandle, useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { RocketLaunch, TrendingUp, Star } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// ============================================================================
// BEAMS COMPONENT (3D Background)
// ============================================================================

function extendMaterial(BaseMaterial, cfg) {
  const physical = THREE.ShaderLib.physical;
  const baseVert = physical.vertexShader;
  const baseFrag = physical.fragmentShader;
  const baseUniforms = physical.uniforms;
  const baseDefines = physical.defines ?? {};

  const uniforms = THREE.UniformsUtils.clone(baseUniforms);
  const defaults = new BaseMaterial(cfg.material || {});

  if (defaults.color) uniforms.diffuse.value = defaults.color;
  if ("roughness" in defaults) uniforms.roughness.value = defaults.roughness;
  if ("metalness" in defaults) uniforms.metalness.value = defaults.metalness;
  if ("envMap" in defaults) uniforms.envMap.value = defaults.envMap;
  if ("envMapIntensity" in defaults) uniforms.envMapIntensity.value = defaults.envMapIntensity;

  Object.entries(cfg.uniforms ?? {}).forEach(([key, u]) => {
    uniforms[key] =
      u !== null && typeof u === "object" && "value" in u
        ? u
        : { value: u };
  });

  let vert = `${cfg.header}\n${cfg.vertexHeader ?? ""}\n${baseVert}`;
  let frag = `${cfg.header}\n${cfg.fragmentHeader ?? ""}\n${baseFrag}`;

  for (const [inc, code] of Object.entries(cfg.vertex ?? {})) {
    vert = vert.replace(inc, `${inc}\n${code}`);
  }

  for (const [inc, code] of Object.entries(cfg.fragment ?? {})) {
    frag = frag.replace(inc, `${inc}\n${code}`);
  }

  return new THREE.ShaderMaterial({
    defines: { ...baseDefines },
    uniforms,
    vertexShader: vert,
    fragmentShader: frag,
    lights: true,
    fog: !!cfg.material?.fog,
  });
}

const CanvasWrapper = ({ children }) => (
  <Canvas dpr={[1, 2]} frameloop="always" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
    {children}
  </Canvas>
);

const hexToNormalizedRGB = (hex) => {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return [r / 255, g / 255, b / 255];
};

const noise = `
float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))*43758.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
           (c - a)* u.y * (1.0 - u.x) +
           (d - b) * u.x * u.y;
}

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
  g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
  g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x,Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x,Pf1.y,Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy,Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy,Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x,Pf0.y,Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x,Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);
  vec2 n_yz = mix(n_z.xy,n_z.zw,fade_xyz.y);
  float n_xyz = mix(n_yz.x,n_yz.y,fade_xyz.x);
  return 2.2 * n_xyz;
}
`;

function createStackedPlanesBufferGeometry(n, width, height, spacing, heightSegments) {
  const geometry = new THREE.BufferGeometry();
  const numVertices = n * (heightSegments + 1) * 2;
  const numFaces = n * heightSegments * 2;

  const positions = new Float32Array(numVertices * 3);
  const indices = new Uint32Array(numFaces * 3);
  const uvs = new Float32Array(numVertices * 2);

  let vertexOffset = 0;
  let indexOffset = 0;
  let uvOffset = 0;

  const totalWidth = n * width + (n - 1) * spacing;
  const xOffsetBase = -totalWidth / 2;

  for (let i = 0; i < n; i++) {
    const xOffset = xOffsetBase + i * (width + spacing);
    const uvXOffset = Math.random() * 300;
    const uvYOffset = Math.random() * 300;

    for (let j = 0; j <= heightSegments; j++) {
      const y = height * (j / heightSegments - 0.5);
      const v0 = [xOffset, y, 0];
      const v1 = [xOffset + width, y, 0];

      positions.set([...v0, ...v1], vertexOffset * 3);

      const uvY = j / heightSegments;
      uvs.set([uvXOffset, uvY + uvYOffset, uvXOffset + 1, uvY + uvYOffset], uvOffset);

      if (j < heightSegments) {
        const a = vertexOffset,
          b = vertexOffset + 1,
          c = vertexOffset + 2,
          d = vertexOffset + 3;
        indices.set([a, b, c, c, b, d], indexOffset);
        indexOffset += 6;
      }

      vertexOffset += 2;
      uvOffset += 4;
    }
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.computeVertexNormals();

  return geometry;
}

const MergedPlanes = forwardRef(({ material, width, count, height }, ref) => {
  const mesh = useRef(null);

  useImperativeHandle(ref, () => mesh.current);

  const geometry = useMemo(
    () => createStackedPlanesBufferGeometry(count, width, height, 0, 100),
    [count, width, height]
  );

  useFrame((_, delta) => {
    if (mesh.current) {
      mesh.current.material.uniforms.time.value += 0.1 * delta;
    }
  });

  return <mesh ref={mesh} geometry={geometry} material={material} />;
});
MergedPlanes.displayName = "MergedPlanes";

const PlaneNoise = forwardRef((props, ref) => (
  <MergedPlanes ref={ref} material={props.material} width={props.width} count={props.count} height={props.height} />
));
PlaneNoise.displayName = "PlaneNoise";

const DirLight = ({ position, color }) => {
  const dir = useRef(null);

  useEffect(() => {
    if (!dir.current) return;
    const cam = dir.current.shadow.camera;
    cam.top = 24;
    cam.bottom = -24;
    cam.left = -24;
    cam.right = 24;
    cam.far = 64;
    dir.current.shadow.bias = -0.004;
  }, []);

  return <directionalLight ref={dir} color={color} intensity={1} position={position} />;
};

const Beams = ({
  beamWidth = 2,
  beamHeight = 15,
  beamNumber = 12,
  lightColor = "#FFC107", // Default to Project Mustard color
  speed = 2,
  noiseIntensity = 1.75,
  scale = 0.2,
  rotation = 0,
}) => {
  const meshRef = useRef(null);

  const beamMaterial = useMemo(
    () =>
      extendMaterial(THREE.MeshStandardMaterial, {
        header: `
  varying vec3 vEye;
  varying float vNoise;
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float time;
  uniform float uSpeed;
  uniform float uNoiseIntensity;
  uniform float uScale;
  ${noise}`,
        vertexHeader: `
  float getPos(vec3 pos) {
    vec3 noisePos =
      vec3(pos.x * 0., pos.y - uv.y, pos.z + time * uSpeed * 3.) * uScale;
    return cnoise(noisePos);
  }

  vec3 getCurrentPos(vec3 pos) {
    vec3 newpos = pos;
    newpos.z += getPos(pos);
    return newpos;
  }

  vec3 getNormal(vec3 pos) {
    vec3 curpos = getCurrentPos(pos);
    vec3 nextposX = getCurrentPos(pos + vec3(0.01, 0.0, 0.0));
    vec3 nextposZ = getCurrentPos(pos + vec3(0.0, -0.01, 0.0));
    vec3 tangentX = normalize(nextposX - curpos);
    vec3 tangentZ = normalize(nextposZ - curpos);
    return normalize(cross(tangentZ, tangentX));
  }`,
        fragmentHeader: "",
        vertex: {
          "#include <begin_vertex>": `transformed.z += getPos(transformed.xyz);`,
          "#include <beginnormal_vertex>": `objectNormal = getNormal(position.xyz);`,
        },
        fragment: {
          "#include <dithering_fragment>": `
    float randomNoise = noise(gl_FragCoord.xy);
    gl_FragColor.rgb -= randomNoise / 15. * uNoiseIntensity;`,
        },
        material: { fog: true },
        uniforms: {
          diffuse: new THREE.Color(...hexToNormalizedRGB("#000000")),
          time: { shared: true, mixed: true, linked: true, value: 0 },
          roughness: 0.3,
          metalness: 0.3,
          uSpeed: { shared: true, mixed: true, linked: true, value: speed },
          envMapIntensity: 10,
          uNoiseIntensity: noiseIntensity,
          uScale: scale,
        },
      }),
    [speed, noiseIntensity, scale]
  );

  return (
    <CanvasWrapper>
      <group rotation={[0, 0, degToRad(rotation)]}>
        <PlaneNoise ref={meshRef} material={beamMaterial} count={beamNumber} width={beamWidth} height={beamHeight} />
        <DirLight color={lightColor} position={[0, 3, 10]} />
      </group>
      <ambientLight intensity={1} />
      <color attach="background" args={["#000000"]} />
      <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={30} />
    </CanvasWrapper>
  );
};


// ============================================================================
// MAIN HERO COMPONENT
// ============================================================================

export default function EtherealBeamsHero() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', width: '100%', overflow: 'hidden', backgroundColor: '#000000' }}>
      {/* 3D Beams WebGL Background */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
        <Beams
          beamWidth={2.5}
          beamHeight={18}
          beamNumber={12}
          lightColor="#FFC107" // Changed to project mustard theme
          speed={1.0}
          noiseIntensity={0.8}
          scale={0.10}
          rotation={43}
        />
      </Box>

      {/* Hero Content Overlay based on original MUI LandingPage */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 40%)', 
          pt: { xs: 8, md: 10 } // Leave space for global fixed AppBar
        }}
      >
        <Container maxWidth="lg" sx={{ textAlign: 'center', px: { xs: 2, md: 4 } }}>
          <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            
            {/* Badge removed as requested */}

            {/* Main Heading */}
            <motion.div variants={itemVariants}>
                <Typography
                  variant="h1"
                  align="center"
                  sx={{
                    mb: 3,
                    fontWeight: 900,
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '6rem' },
                    color: '#FFFFFF',
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    fontFamily: '"Inter", system-ui, sans-serif',
                  }}
                >
                  Bridge Academia<br/>
                  <Box
                    sx={{
                      color: 'rgba(255,255,255,0.6)',
                      display: 'inline-block',
                      mr: 2,
                    }}
                  >
                    &
                  </Box>
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #FFC107 0%, #FFD54F 50%, #FFC107 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      display: 'inline-block',
                      filter: 'drop-shadow(0 4px 20px rgba(255, 193, 7, 0.4))',
                    }}
                  >
                    Industry
                  </Box>
                </Typography>
            </motion.div>

            {/* Subtitle */}
            <motion.div variants={itemVariants}>
              <Typography
                sx={{
                  mb: 6,
                  maxWidth: '750px',
                  mx: 'auto',
                  fontSize: { xs: '1rem', md: '1.1rem', lg: '1.25rem' },
                  lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.7)',
                  fontFamily: '"Inter", system-ui, sans-serif',
                  fontWeight: 400,
                }}
              >
                Connect talented students with innovative startups. Build real-world projects, gain experience, and create meaningful impact.
              </Typography>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, mb: 10 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  endIcon={<RocketLaunch />}
                  sx={{
                    backgroundColor: '#FFC107',
                    color: '#000000',
                    px: { xs: 3, md: 5 },
                    py: { xs: 1.5, md: 2 },
                    fontSize: '1rem',
                    fontWeight: 800,
                    fontFamily: '"Inter", system-ui, sans-serif',
                    borderRadius: '50px',
                    boxShadow: '0 8px 30px rgba(255,193,7,0.3)',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#FFD54F',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 40px rgba(255,193,7,0.4)',
                    },
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  Start Creating
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/projects')}
                  endIcon={<TrendingUp />}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.2)',
                    color: '#FFFFFF',
                    px: 5,
                    py: 2,
                    fontSize: '1rem',
                    fontWeight: 700,
                    borderRadius: '50px',
                    backdropFilter: 'blur(10px)',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#FFFFFF',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Explore Projects
                </Button>
              </Box>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants}>
              <Grid container spacing={4} sx={{ maxWidth: '800px', mx: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', pt: 6 }}>
                {[
                  { value: '500+', label: 'Active Students' },
                  { value: '150+', label: 'Partner Startups' },
                  { value: '300+', label: 'Completed Projects' },
                ].map((stat, i) => (
                  <Grid item xs={12} sm={4} key={i}>
                    <Box>
                      <Typography sx={{ fontFamily: '"Inter", system-ui, sans-serif', fontSize: '2.5rem', fontWeight: 900, color: '#FFFFFF', mb: 0.5, textShadow: '0 4px 20px rgba(255,255,255,0.1)' }}>
                        {stat.value}
                      </Typography>
                      <Typography sx={{ fontFamily: '"Inter", system-ui, sans-serif', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </motion.div>

          </motion.div>
        </Container>
      </Box>
    </Box>
  );
}
