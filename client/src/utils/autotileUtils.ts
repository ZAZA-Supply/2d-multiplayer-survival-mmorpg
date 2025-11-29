import { WorldTile } from '../generated/world_tile_type';

// Import autotile images (15-tile hierarchical format, 512×640)
import grassBeachAutotile from '../assets/tiles/new/tileset_grass_beach_autotile.png';
import beachSeaAutotile from '../assets/tiles/new/tileset_beach_sea_autotile.png';
import grassDirtAutotile from '../assets/tiles/new/tileset_grass_dirt_autotile.png';
import dirtBeachAutotile from '../assets/tiles/new/tileset_dirt_beach_autotile.png';
import grassDirtRoadAutotile from '../assets/tiles/new/tileset_grass_dirtroad_autotile.png';
import beachDirtRoadAutotile from '../assets/tiles/new/tileset_beach_dirtroad_autotile.png';
import dirtDirtRoadAutotile from '../assets/tiles/new/tileset_dirt_dirtroad_autotile.png';

/**
 * 15-Tile Hierarchical Autotile System
 * =====================================
 * 
 * Tileset Layout: 512×640px with 128×128 pixel tiles (4 cols × 5 rows)
 * 
 * Column 0 contains interior tiles. Transition tiles are in columns 1-3:
 * 
 *   Col:    0       1       2       3
 *   Row 0: [INT]   [A1]    [A2]    [A3]   <- 3×3 island top row
 *   Row 1: [--]    [A4]    [A5]    [A6]   <- 3×3 island middle row
 *   Row 2: [--]    [A7]    [A8]    [A9]   <- 3×3 island bottom row
 *   Row 3: [--]    [B1]    [B2]    [C1]   <- 2×2 pond top + 1×2 strip
 *   Row 4: [--]    [B3]    [B4]    [C2]   <- 2×2 pond bottom + 1×2 strip
 * 
 * A-tiles (3×3 Island): Land edges touching water (convex corners)
 * B-tiles (2×2 Pond): Water fully enclosed by land (concave corners)
 * C-tiles (1×2 Strip): Special coastline connectors
 */

// =============================================================================
// TILESET CONSTANTS
// =============================================================================

/** Tile size in pixels */
export const TILE_SIZE = 128;

/** Tileset dimensions */
export const TILESET_WIDTH = 512;
export const TILESET_HEIGHT = 640;
export const TILESET_COLS = 4;
export const TILESET_ROWS = 5;

// =============================================================================
// TILE POSITION DEFINITIONS
// =============================================================================

/** 
 * Tile positions in the tileset (row, col)
 * 
 * The tileset has TWO sections:
 * 1. A-tiles (3×3): For CONVEX corners (island shape) - primary material bulges out
 * 2. B-tiles (2×2): For CONCAVE corners (pond/hole shape) - primary material curves inward
 */
export const TILE_POSITIONS = {
    // 3×3 Island Autotile (A1-A9) - CONVEX corners, edges
    A1: { row: 0, col: 1 }, // Convex corner NW
    A2: { row: 0, col: 2 }, // Top edge
    A3: { row: 0, col: 3 }, // Convex corner NE
    A4: { row: 1, col: 1 }, // Left edge
    A5: { row: 1, col: 2 }, // Center/Full - interior
    A6: { row: 1, col: 3 }, // Right edge
    A7: { row: 2, col: 1 }, // Convex corner SW
    A8: { row: 2, col: 2 }, // Bottom edge
    A9: { row: 2, col: 3 }, // Convex corner SE
    
    // 2×2 Pond/Hole Tiles (B1-B4) - CONCAVE corners
    B1: { row: 3, col: 1 }, // Concave at SE
    B2: { row: 3, col: 2 }, // Concave at SW
    B3: { row: 4, col: 1 }, // Concave at NE
    B4: { row: 4, col: 2 }, // Concave at NW
    
    // 1×2 Coastline Strips (C1-C2)
    C1: { row: 3, col: 3 },
    C2: { row: 4, col: 3 },
};

// =============================================================================
// NEIGHBOR DIRECTION CONSTANTS
// =============================================================================

/** Cardinal directions */
const DIR_N = 0b0001;
const DIR_E = 0b0010;
const DIR_S = 0b0100;
const DIR_W = 0b1000;

/** Diagonal directions */
const DIR_NE = 0b00010000;
const DIR_SE = 0b00100000;
const DIR_SW = 0b01000000;
const DIR_NW = 0b10000000;

/** Neighbor offsets for 8-directional checking */
const NEIGHBOR_OFFSETS = {
    N:  { x:  0, y: -1, bit: DIR_N },
    NE: { x:  1, y: -1, bit: DIR_NE },
    E:  { x:  1, y:  0, bit: DIR_E },
    SE: { x:  1, y:  1, bit: DIR_SE },
    S:  { x:  0, y:  1, bit: DIR_S },
    SW: { x: -1, y:  1, bit: DIR_SW },
    W:  { x: -1, y:  0, bit: DIR_W },
    NW: { x: -1, y: -1, bit: DIR_NW },
};

// =============================================================================
// AUTOTILE CONFIGURATION
// =============================================================================

/**
 * Autotile configuration for tile type transitions
 */
export interface AutotileConfig {
    primaryType: string;
    secondaryType: string;
    tilesetPath: string;
    tileSize: number;
    columns: number;
    rows: number;
    primaryInterior: { row: number; col: number };
    secondaryInterior: { row: number; col: number };
}

/**
 * Autotile configurations for all supported tile transitions
 */
export const AUTOTILE_CONFIGS: { [key: string]: AutotileConfig } = {
    'Grass_Beach': {
        primaryType: 'Grass',
        secondaryType: 'Beach',
        tilesetPath: grassBeachAutotile,
        tileSize: TILE_SIZE,
        columns: TILESET_COLS,
        rows: TILESET_ROWS,
        primaryInterior: { row: 1, col: 2 },
        secondaryInterior: { row: 0, col: 0 },
    },
    'Grass_HotSpringWater': {
        primaryType: 'Grass',
        secondaryType: 'HotSpringWater',
        tilesetPath: grassBeachAutotile,
        tileSize: TILE_SIZE,
        columns: TILESET_COLS,
        rows: TILESET_ROWS,
        primaryInterior: { row: 1, col: 2 },
        secondaryInterior: { row: 0, col: 0 },
    },
    'Beach_Sea': {
        primaryType: 'Beach',
        secondaryType: 'Sea',
        tilesetPath: beachSeaAutotile,
        tileSize: TILE_SIZE,
        columns: TILESET_COLS,
        rows: TILESET_ROWS,
        primaryInterior: { row: 1, col: 2 },
        secondaryInterior: { row: 0, col: 0 },
    },
    'Beach_HotSpringWater': {
        primaryType: 'Beach',
        secondaryType: 'HotSpringWater',
        tilesetPath: beachSeaAutotile,
        tileSize: TILE_SIZE,
        columns: TILESET_COLS,
        rows: TILESET_ROWS,
        primaryInterior: { row: 1, col: 2 },
        secondaryInterior: { row: 0, col: 0 },
    },
    'Grass_Dirt': {
        primaryType: 'Grass',
        secondaryType: 'Dirt',
        tilesetPath: grassDirtAutotile,
        tileSize: TILE_SIZE,
        columns: TILESET_COLS,
        rows: TILESET_ROWS,
        primaryInterior: { row: 1, col: 2 },
        secondaryInterior: { row: 0, col: 0 },
    },
    'Dirt_Beach': {
        primaryType: 'Dirt',
        secondaryType: 'Beach',
        tilesetPath: dirtBeachAutotile,
        tileSize: TILE_SIZE,
        columns: TILESET_COLS,
        rows: TILESET_ROWS,
        primaryInterior: { row: 1, col: 2 },
        secondaryInterior: { row: 0, col: 0 },
    },
    'Grass_DirtRoad': {
        primaryType: 'Grass',
        secondaryType: 'DirtRoad',
        tilesetPath: grassDirtRoadAutotile,
        tileSize: TILE_SIZE,
        columns: TILESET_COLS,
        rows: TILESET_ROWS,
        primaryInterior: { row: 1, col: 2 },
        secondaryInterior: { row: 0, col: 0 },
    },
    'Beach_DirtRoad': {
        primaryType: 'Beach',
        secondaryType: 'DirtRoad',
        tilesetPath: beachDirtRoadAutotile,
        tileSize: TILE_SIZE,
        columns: TILESET_COLS,
        rows: TILESET_ROWS,
        primaryInterior: { row: 1, col: 2 },
        secondaryInterior: { row: 0, col: 0 },
    },
    'Dirt_DirtRoad': {
        primaryType: 'Dirt',
        secondaryType: 'DirtRoad',
        tilesetPath: dirtDirtRoadAutotile,
        tileSize: TILE_SIZE,
        columns: TILESET_COLS,
        rows: TILESET_ROWS,
        primaryInterior: { row: 1, col: 2 },
        secondaryInterior: { row: 0, col: 0 },
    },
    'DirtRoad_Dirt': {
        primaryType: 'DirtRoad',
        secondaryType: 'Dirt',
        tilesetPath: dirtDirtRoadAutotile,
        tileSize: TILE_SIZE,
        columns: TILESET_COLS,
        rows: TILESET_ROWS,
        primaryInterior: { row: 0, col: 0 },
        secondaryInterior: { row: 1, col: 2 },
    },
};

// =============================================================================
// NEIGHBOR ANALYSIS
// =============================================================================

/**
 * Analyze neighbors and return bitmask of which neighbors are the secondary type
 */
function getNeighborMask(
    x: number,
    y: number,
    worldTiles: Map<string, WorldTile>,
    secondaryType: string
): number {
    let mask = 0;
    
    for (const [, offset] of Object.entries(NEIGHBOR_OFFSETS)) {
        const neighborKey = `${x + offset.x}_${y + offset.y}`;
        const neighborTile = worldTiles.get(neighborKey);
        
        if (neighborTile) {
            let neighborType = neighborTile.tileType?.tag;
            if (neighborType === 'Quarry') neighborType = 'Dirt';
            if (neighborType === secondaryType) {
                mask |= offset.bit;
            }
        }
    }
    
    return mask;
}

// =============================================================================
// TILE SELECTION
// =============================================================================

/**
 * Select the appropriate tile from the 3×3 island autotile based on neighbor mask
 */
function selectIslandTile(mask: number): { row: number; col: number } {
    // Handle diagonal-only bitmasks
    if (mask === 16) return { row: 4, col: 1 };  // NE diagonal
    if (mask === 32) return { row: 3, col: 1 };  // SE diagonal
    if (mask === 64) return { row: 3, col: 2 };  // SW diagonal
    if (mask === 128) return { row: 4, col: 2 }; // NW diagonal
    
    // No neighbors - interior tile
    if (mask === 0) return TILE_POSITIONS.A5;
    
    const hasN = (mask & DIR_N) !== 0;
    const hasE = (mask & DIR_E) !== 0;
    const hasS = (mask & DIR_S) !== 0;
    const hasW = (mask & DIR_W) !== 0;
    const hasNE = (mask & DIR_NE) !== 0;
    const hasSE = (mask & DIR_SE) !== 0;
    const hasSW = (mask & DIR_SW) !== 0;
    const hasNW = (mask & DIR_NW) !== 0;
    
    const cardinalCount = (hasN ? 1 : 0) + (hasE ? 1 : 0) + (hasS ? 1 : 0) + (hasW ? 1 : 0);
    
    // Full surround or three cardinals - use center
    if (cardinalCount >= 3) return TILE_POSITIONS.A5;
    
    // Two cardinals - corners
    if (cardinalCount === 2) {
        if (hasN && hasE) return hasNE ? TILE_POSITIONS.A3 : TILE_POSITIONS.B3;
        if (hasN && hasW) return hasNW ? TILE_POSITIONS.A1 : TILE_POSITIONS.B4;
        if (hasS && hasE) return hasSE ? TILE_POSITIONS.A9 : TILE_POSITIONS.B1;
        if (hasS && hasW) return hasSW ? TILE_POSITIONS.A7 : TILE_POSITIONS.B2;
        // Channels - use center
        return TILE_POSITIONS.A5;
    }
    
    // Single cardinal - edges
    if (cardinalCount === 1) {
        if (hasN) return TILE_POSITIONS.A2;
        if (hasS) return TILE_POSITIONS.A8;
        if (hasE) return TILE_POSITIONS.A6;
        if (hasW) return TILE_POSITIONS.A4;
    }
    
    // No cardinals but has diagonals
    if (cardinalCount === 0) {
        if (hasNE && !hasSE && !hasSW && !hasNW) return TILE_POSITIONS.A3;
        if (hasNW && !hasNE && !hasSE && !hasSW) return TILE_POSITIONS.A1;
        if (hasSE && !hasNE && !hasNW && !hasSW) return TILE_POSITIONS.A9;
        if (hasSW && !hasNE && !hasNW && !hasSE) return TILE_POSITIONS.A7;
    }
    
    return TILE_POSITIONS.A5;
}

/**
 * Get sprite coordinates for a tile position
 */
function getSpriteCoords(tilePos: { row: number; col: number }): { 
    x: number; 
    y: number; 
    width: number; 
    height: number 
} {
    return {
        x: tilePos.col * TILE_SIZE,
        y: tilePos.row * TILE_SIZE,
        width: TILE_SIZE,
        height: TILE_SIZE,
    };
}

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * Get autotile sprite coordinates for a specific tile
 */
export function getAutotileSpriteCoords(
    config: AutotileConfig,
    bitmask: number,
    isSecondaryInterior: boolean = false
): { x: number; y: number; width: number; height: number } {
    if (isSecondaryInterior) {
        return getSpriteCoords(config.secondaryInterior);
    }
    
    if (bitmask === 0) {
        return getSpriteCoords(config.primaryInterior);
    }
    
    const tilePos = selectIslandTile(bitmask);
    return getSpriteCoords(tilePos);
}

/**
 * Calculate bitmask for autotile selection based on neighboring tiles
 */
export function calculateAutotileBitmask(
    centerX: number,
    centerY: number,
    worldTiles: Map<string, WorldTile>,
    secondaryType: string
): number {
    return getNeighborMask(centerX, centerY, worldTiles, secondaryType);
}

/**
 * Determine if a tile should use autotiling and return the appropriate config
 */
export function shouldUseAutotiling(
    tileType: string,
    worldTiles: Map<string, WorldTile>,
    x: number,
    y: number
): { config: AutotileConfig; bitmask: number; isSecondaryInterior?: boolean } | null {
    const centerTileKey = `${x}_${y}`;
    const centerTile = worldTiles.get(centerTileKey);
    
    if (!centerTile) return null;
    
    const actualTileType = centerTile.tileType?.tag;
    if (actualTileType) tileType = actualTileType;
    
    // Map Quarry tiles to Dirt for autotiling
    const autotileTileType = tileType === 'Quarry' ? 'Dirt' : tileType;
    
    // Use tile's coordinates if available
    if ('worldX' in centerTile && 'worldY' in centerTile) {
        const tileWorldX = (centerTile as WorldTile).worldX;
        const tileWorldY = (centerTile as WorldTile).worldY;
        if (tileWorldX !== undefined && tileWorldY !== undefined) {
            x = tileWorldX;
            y = tileWorldY;
        }
    }
    
    // Sort configs to prioritize Grass_Dirt over Grass_Beach
    const configEntries = Object.entries(AUTOTILE_CONFIGS);
    configEntries.sort((a, b) => {
        if (a[0] === 'Grass_Dirt') return -1;
        if (b[0] === 'Grass_Dirt') return 1;
        return 0;
    });
    
    // First pass: Look for configs where this tile is PRIMARY with secondary neighbors
    for (const [, config] of configEntries) {
        if (autotileTileType === config.primaryType) {
            if (config.primaryType === 'DirtRoad' && config.secondaryType === 'Grass') continue;
            if (config.primaryType === 'HotSpringWater') continue;
            
            const bitmask = calculateAutotileBitmask(x, y, worldTiles, config.secondaryType);
            
            if (bitmask > 0) {
                return { config, bitmask };
            }
        }
    }
    
    // Second pass: Use primaryInterior for interior PRIMARY tiles
    for (const [, config] of Object.entries(AUTOTILE_CONFIGS)) {
        if (autotileTileType === config.primaryType) {
            if (config.primaryType === 'DirtRoad' && config.secondaryType === 'Grass') continue;
            if (config.primaryType === 'HotSpringWater') continue;
            if (autotileTileType === 'Sea' || autotileTileType === 'HotSpringWater') continue;
            
            return { config, bitmask: 0 };
        }
    }
    
    // Third pass: Look for configs where this tile is SECONDARY (e.g., Sea in Beach_Sea)
    const secondaryConfigEntries = Object.entries(AUTOTILE_CONFIGS);
    secondaryConfigEntries.sort((a, b) => {
        if (a[0] === 'Beach_HotSpringWater') return -1;
        if (b[0] === 'Beach_HotSpringWater') return 1;
        if (a[0] === 'Beach_Sea') return -1;
        if (b[0] === 'Beach_Sea') return 1;
        return 0;
    });
    
    for (const [, config] of secondaryConfigEntries) {
        if (autotileTileType === config.secondaryType) {
            return { config, bitmask: -1, isSecondaryInterior: true };
        }
    }
    
    return null;
}

/**
 * Get ALL autotile transitions for a tile (for multi-layer rendering)
 */
export function getAutotilesForTile(
    tileType: string,
    worldTiles: Map<string, WorldTile>,
    x: number,
    y: number
): Array<{ config: AutotileConfig; bitmask: number }> {
    const centerTileKey = `${x}_${y}`;
    const centerTile = worldTiles.get(centerTileKey);
    
    if (!centerTile) return [];
    
    const actualTileType = centerTile.tileType?.tag;
    if (actualTileType) tileType = actualTileType;
    
    const autotileTileType = tileType === 'Quarry' ? 'Dirt' : tileType;
    
    if ('worldX' in centerTile && 'worldY' in centerTile) {
        const tileWorldX = (centerTile as WorldTile).worldX;
        const tileWorldY = (centerTile as WorldTile).worldY;
        if (tileWorldX !== undefined && tileWorldY !== undefined) {
            x = tileWorldX;
            y = tileWorldY;
        }
    }
    
    const autotiles: Array<{ config: AutotileConfig; bitmask: number }> = [];
    
    for (const [, config] of Object.entries(AUTOTILE_CONFIGS)) {
        if (autotileTileType === config.primaryType) {
            if (config.primaryType === 'DirtRoad' && config.secondaryType === 'Grass') continue;
            if (config.primaryType === 'HotSpringWater') continue;
            
            const bitmask = calculateAutotileBitmask(x, y, worldTiles, config.secondaryType);
            
            if (bitmask > 0) {
                autotiles.push({ config, bitmask });
            }
        }
    }
    
    return autotiles;
}

// =============================================================================
// DEBUG UTILITIES
// =============================================================================

/**
 * Get detailed debug info about a tile's autotile state
 */
export function getDebugTileInfo(bitmask: number): {
    bitmask: number;
    tileIndex: number;
    row: number;
    col: number;
    coordinates: { x: number; y: number };
} {
    const tilePos = selectIslandTile(bitmask);
    
    return {
        bitmask,
        tileIndex: tilePos.row * TILESET_COLS + tilePos.col,
        row: tilePos.row,
        col: tilePos.col,
        coordinates: {
            x: tilePos.col * TILE_SIZE,
            y: tilePos.row * TILE_SIZE,
        },
    };
}

/**
 * Helper function to debug autotile bitmasks
 */
export function debugAutotileBitmask(bitmask: number): string {
    const neighbors = [];
    if (bitmask & DIR_NW) neighbors.push('NW');
    if (bitmask & DIR_N) neighbors.push('N');
    if (bitmask & DIR_NE) neighbors.push('NE');
    if (bitmask & DIR_W) neighbors.push('W');
    if (bitmask & DIR_E) neighbors.push('E');
    if (bitmask & DIR_SW) neighbors.push('SW');
    if (bitmask & DIR_S) neighbors.push('S');
    if (bitmask & DIR_SE) neighbors.push('SE');
    
    return `Bitmask ${bitmask}: [${neighbors.join(', ')}]`;
}
