/**
 * Particle system for tree falling impact effects
 * Creates grass/dirt particles that puff up when tree hits the ground
 */

interface Particle {
  x: number;
  y: number;
  vx: number; // velocity x
  vy: number; // velocity y
  size: number;
  color: string;
  life: number; // 0 to 1, decreases over time
  maxLife: number;
}

const PARTICLE_CONFIGS = {
  // Grass particles (green/brown)
  grass: [
    'rgba(90, 140, 60, 1)',    // Dark green
    'rgba(120, 180, 80, 1)',   // Medium green
    'rgba(100, 160, 70, 1)',   // Green
    'rgba(80, 100, 50, 1)',    // Dark grass
  ],
  // Dirt/soil particles (brown)
  dirt: [
    'rgba(120, 80, 50, 1)',    // Brown
    'rgba(90, 60, 40, 1)',     // Dark brown
    'rgba(140, 100, 70, 1)',   // Light brown
    'rgba(100, 70, 50, 1)',    // Medium brown
  ],
};

/**
 * Active particle systems keyed by tree ID
 */
const activeParticleSystems = new Map<string, Particle[]>();

/**
 * Create impact particles when tree hits the ground
 */
export function createTreeImpactParticles(
  treeId: string,
  impactX: number,
  impactY: number,
  treeWidth: number
): void {
  const particles: Particle[] = [];
  const particleCount = Math.floor(treeWidth / 20) + 20; // More particles for wider trees

  for (let i = 0; i < particleCount; i++) {
    const isGrass = Math.random() > 0.4; // 60% grass, 40% dirt
    const colors = isGrass ? PARTICLE_CONFIGS.grass : PARTICLE_CONFIGS.dirt;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Particles spread out from impact point
    const spreadX = (Math.random() - 0.5) * treeWidth * 0.8;
    const spreadY = (Math.random() - 0.5) * 60;
    
    // Velocity: upward and outward
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI / 3; // Mostly upward
    const speed = 100 + Math.random() * 150; // pixels per second
    
    particles.push({
      x: impactX + spreadX,
      y: impactY + spreadY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 2 + Math.random() * 4,
      color,
      life: 1.0,
      maxLife: 0.8 + Math.random() * 0.4, // 0.8-1.2 seconds
    });
  }

  activeParticleSystems.set(treeId, particles);
  console.log(`[TreeParticles] Created ${particleCount} impact particles for tree ${treeId}`);
}

/**
 * Update all active particle systems
 */
export function updateTreeParticles(deltaTimeSeconds: number): void {
  const gravity = 300; // pixels per second squared
  
  activeParticleSystems.forEach((particles, treeId) => {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      
      // Update physics
      p.x += p.vx * deltaTimeSeconds;
      p.y += p.vy * deltaTimeSeconds;
      p.vy += gravity * deltaTimeSeconds; // Apply gravity
      
      // Fade out over lifetime
      p.life -= deltaTimeSeconds / p.maxLife;
      
      // Remove dead particles
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }
    
    // Clean up empty systems
    if (particles.length === 0) {
      activeParticleSystems.delete(treeId);
    }
  });
}

/**
 * Render all active particle systems
 */
export function renderTreeParticles(
  ctx: CanvasRenderingContext2D,
  cameraOffsetX: number,
  cameraOffsetY: number
): void {
  activeParticleSystems.forEach((particles) => {
    particles.forEach((p) => {
      const screenX = p.x + cameraOffsetX;
      const screenY = p.y + cameraOffsetY;
      
      // Parse color and apply alpha based on life
      const alpha = Math.pow(p.life, 0.5); // Square root for smoother fade
      const colorWithAlpha = p.color.replace('1)', `${alpha})`);
      
      ctx.fillStyle = colorWithAlpha;
      ctx.beginPath();
      ctx.arc(screenX, screenY, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
  });
}

/**
 * Check if a tree has active particles
 */
export function hasActiveParticles(treeId: string): boolean {
  const particles = activeParticleSystems.get(treeId);
  return particles !== undefined && particles.length > 0;
}

/**
 * Manually clean up particles for a specific tree
 */
export function cleanupTreeParticles(treeId: string): void {
  activeParticleSystems.delete(treeId);
}

/**
 * Get particle count for debugging
 */
export function getActiveParticleCount(): number {
  let count = 0;
  activeParticleSystems.forEach(particles => {
    count += particles.length;
  });
  return count;
}

