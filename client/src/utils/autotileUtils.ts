import { WorldTile } from '../generated/world_tile_type';

// Import NEW 512×640 autotile images (15-tile hierarchical format)
import grassBeachAutotile from '../assets/tiles/new/tileset_grass_beach_autotile.png';
import beachSeaAutotile from '../assets/tiles/new/tileset_beach_sea_autotile.png';

// Import legacy autotile images (for tile types that don't have new format yet)
import grassDirtAutotile from '../assets/tiles/tileset_grass_dirt_autotile.png';
import grassDirtRoadAutotile from '../assets/tiles/tileset_grass_dirtroad_autotile.png';
import dirtRoadDirtAutotile from '../assets/tiles/tileset_dirtroad_dirt_autotile.png';

/**
 * NEW 15-Tile Hierarchical Autotile System
 * ========================================
 * 
 * Tileset Layout: 512×640px with 128×128 pixel tiles (4 cols × 5 rows)
 * 
 * Column 0 is UNUSED. Tiles are in columns 1-3:
 * 
 *   Col:    0       1       2       3
 *   Row 0: [--]    [A1]    [A2]    [A3]   <- 3×3 island top row
 *   Row 1: [--]    [A4]    [A5]    [A6]   <- 3×3 island middle row
 *   Row 2: [--]    [A7]    [A8]    [A9]   <- 3×3 island bottom row
 *   Row 3: [--]    [B1]    [B2]    [C1]   <- 2×2 pond top + 1×2 strip
 *   Row 4: [--]    [B3]    [B4]    [C2]   <- 2×2 pond bottom + 1×2 strip
 * 
 * A-tiles (3×3 Island): Land edges touching water
 * B-tiles (2×2 Pond): Water fully enclosed by land
 * C-tiles (1×2 Strip): Special coastline connectors
 */

// =============================================================================
// TILESET CONSTANTS
// =============================================================================

/** Tile size in pixels for the new 512×640 format */
export const NEW_TILE_SIZE = 128;

/** Tileset dimensions */
export const TILESET_WIDTH = 512;
export const TILESET_HEIGHT = 640;
export const TILESET_COLS = 4;
export const TILESET_ROWS = 5;

// =============================================================================
// TILE POSITION DEFINITIONS
// =============================================================================

// =============================================================================
// MANUAL DEBUG OVERRIDES - Edit these to swap tiles and see what works!
// Set to null to use automatic selection, or specify {row, col} to override
// =============================================================================
export const DEBUG_OVERRIDES: {
    // Override specific bitmask values (bitmask -> tile position)
    bitmaskOverrides: Record<number, { row: number; col: number } | null>;
    // Override specific cases by name
    namedOverrides: {
        singleN?: { row: number; col: number } | null;  // Water only to North
        singleE?: { row: number; col: number } | null;  // Water only to East
        singleS?: { row: number; col: number } | null;  // Water only to South
        singleW?: { row: number; col: number } | null;  // Water only to West
        cornerNE?: { row: number; col: number } | null; // Water at N+E
        cornerNW?: { row: number; col: number } | null; // Water at N+W
        cornerSE?: { row: number; col: number } | null; // Water at S+E
        cornerSW?: { row: number; col: number } | null; // Water at S+W
        interior?: { row: number; col: number } | null; // No water neighbors (center)
    };
    // Enable debug logging
    enableLogging: boolean;
} = {
    bitmaskOverrides: {
        // Example: Override bitmask 17 to use row 0, col 2
        // 17: { row: 0, col: 2 },
    },
    namedOverrides: {
        // ============================================================
        // UNCOMMENT AND EDIT THESE TO TEST DIFFERENT TILE POSITIONS:
        // ============================================================
        // Single edges (water on one side):
        // singleN: { row: 0, col: 2 },  // A2 - top edge
        // singleE: { row: 1, col: 3 },  // A6 - right edge  
        // singleS: { row: 2, col: 2 },  // A8 - bottom edge
        // singleW: { row: 1, col: 1 },  // A4 - left edge
        //
        // Corners (water on two adjacent sides):
        // cornerNE: { row: 4, col: 1 }, // B3 - concave at NE
        // cornerNW: { row: 4, col: 2 }, // B4 - concave at NW
        // cornerSE: { row: 3, col: 1 }, // B1 - concave at SE
        // cornerSW: { row: 3, col: 2 }, // B2 - concave at SW
        //
        // Interior (no water neighbors):
        // interior: { row: 1, col: 2 }, // A5 - center
        // ============================================================
    },
    enableLogging: false,
};


/** 
 * Tile positions in the 512×640 tileset (row, col)
 * Column 0 is unused, so all tiles start at column 1
 * 
 * The tileset has TWO sections:
 * 1. A-tiles (3×3): For CONVEX corners (island shape) - primary material bulges out
 * 2. B-tiles (2×2): For CONCAVE corners (pond/hole shape) - primary material curves inward
 */
export const TILE_POSITIONS = {
    // 3×3 Island Autotile (A1-A9) - CONVEX corners, edges
    // Used when primary material is the "island" and secondary is surrounding
    A1: { row: 0, col: 1 }, // Convex corner NW - land bulges toward NW
    A2: { row: 0, col: 2 }, // Top edge - land with water to the north
    A3: { row: 0, col: 3 }, // Convex corner NE - land bulges toward NE
    A4: { row: 1, col: 1 }, // Left edge - land with water to the west
    A5: { row: 1, col: 2 }, // Center/Full - interior (no edges)
    A6: { row: 1, col: 3 }, // Right edge - land with water to the east
    A7: { row: 2, col: 1 }, // Convex corner SW - land bulges toward SW
    A8: { row: 2, col: 2 }, // Bottom edge - land with water to the south
    A9: { row: 2, col: 3 }, // Convex corner SE - land bulges toward SE
    
    // 2×2 Pond/Hole Tiles (B1-B4) - CONCAVE corners
    // Used for OUTER corners where water wraps around from 2 directions
    // These show the primary material with a curved "bite" taken out
    B1: { row: 3, col: 1 }, // Concave at SE - water wraps from S+E
    B2: { row: 3, col: 2 }, // Concave at SW - water wraps from S+W  
    B3: { row: 4, col: 1 }, // Concave at NE - water wraps from N+E
    B4: { row: 4, col: 2 }, // Concave at NW - water wraps from N+W
    
    // 1×2 Coastline Strips (C1-C2) - special connectors
    C1: { row: 3, col: 3 }, // Vertical/straight coast strip
    C2: { row: 4, col: 3 }, // Rounded/partial coast strip
};

// =============================================================================
// NEIGHBOR DIRECTION CONSTANTS
// =============================================================================

/** Cardinal directions */
const DIR_N = 0b0001;  // North
const DIR_E = 0b0010;  // East
const DIR_S = 0b0100;  // South
const DIR_W = 0b1000;  // West

/** Diagonal directions */
const DIR_NE = 0b00010000;  // Northeast
const DIR_SE = 0b00100000;  // Southeast
const DIR_SW = 0b01000000;  // Southwest
const DIR_NW = 0b10000000;  // Northwest

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
 * Autotile configuration for different tile type combinations
 */
export interface AutotileConfig {
    primaryType: string;      // The main tile type (e.g., 'Grass')
    secondaryType: string;    // The transition tile type (e.g., 'Beach')
    tilesetPath: string;      // Path to the autotile tileset image
    tileSize: number;         // Size of each tile in pixels
    columns: number;          // Number of columns in the tileset
    rows: number;             // Number of rows in the tileset
    isNewFormat: boolean;     // Whether this uses the new 15-tile format
    // Interior tile positions (for new format tilesets)
    primaryInterior?: { row: number; col: number };    // Interior tile for primary type
    secondaryInterior?: { row: number; col: number };  // Interior tile for secondary type
}

/**
 * Autotile configurations for all supported tile transitions
 * 
 * INTERIOR TILE POSITIONS (configurable per tileset):
 * - primaryInterior: Where to find the interior tile for the primary type (default: A5 = row 1, col 2)
 * - secondaryInterior: Where to find the interior tile for the secondary type (default: row 0, col 0)
 */
export const AUTOTILE_CONFIGS: { [key: string]: AutotileConfig } = {
    // NEW FORMAT (512×640, 15-tile hierarchical)
    'Grass_Beach': {
        primaryType: 'Grass',
        secondaryType: 'Beach',
        tilesetPath: grassBeachAutotile,
        tileSize: NEW_TILE_SIZE,
        columns: TILESET_COLS,
        rows: TILESET_ROWS,
        isNewFormat: true,
        primaryInterior: { row: 1, col: 2 },    // A5 - Grass interior
        secondaryInterior: { row: 0, col: 0 },  // Beach interior (column 0)
    },
    'Grass_HotSpringWater': {
        primaryType: 'Grass',
        secondaryType: 'HotSpringWater',
        tilesetPath: grassBeachAutotile, // Reuse grass-beach for hot spring transitions
        tileSize: NEW_TILE_SIZE,
        columns: TILESET_COLS,
        rows: TILESET_ROWS,
        isNewFormat: true,
        primaryInterior: { row: 1, col: 2 },
        secondaryInterior: { row: 0, col: 0 },
    },
    'Beach_Sea': {
        primaryType: 'Beach',
        secondaryType: 'Sea',
        tilesetPath: beachSeaAutotile,
        tileSize: NEW_TILE_SIZE,
        columns: TILESET_COLS,
        rows: TILESET_ROWS,
        isNewFormat: true,
        primaryInterior: { row: 1, col: 2 },    // A5 - Beach interior
        secondaryInterior: { row: 0, col: 0 },  // Sea interior (column 0, row 0)
    },
    'Beach_HotSpringWater': {
        primaryType: 'Beach',
        secondaryType: 'HotSpringWater',
        tilesetPath: beachSeaAutotile,
        tileSize: NEW_TILE_SIZE,
        columns: TILESET_COLS,
        rows: TILESET_ROWS,
        primaryInterior: { row: 1, col: 2 },
        secondaryInterior: { row: 0, col: 0 },
        isNewFormat: true,
    },
    
    // LEGACY FORMAT (1280×1280, 48-tile bitmask) - kept for compatibility
    'Grass_Dirt': {
        primaryType: 'Grass',
        secondaryType: 'Dirt',
        tilesetPath: grassDirtAutotile,
        tileSize: 213,
        columns: 6,
        rows: 8,
        isNewFormat: false,
    },
    'Grass_DirtRoad': {
        primaryType: 'Grass',
        secondaryType: 'DirtRoad',
        tilesetPath: grassDirtRoadAutotile,
        tileSize: 213,
        columns: 6,
        rows: 8,
        isNewFormat: false,
    },
    'DirtRoad_Dirt': {
        primaryType: 'DirtRoad',
        secondaryType: 'Dirt',
        tilesetPath: dirtRoadDirtAutotile,
        tileSize: 213,
        columns: 6,
        rows: 8,
        isNewFormat: false,
    },
    'Dirt_DirtRoad': {
        primaryType: 'Dirt',
        secondaryType: 'DirtRoad',
        tilesetPath: dirtRoadDirtAutotile,
        tileSize: 213,
        columns: 6,
        rows: 8,
        isNewFormat: false,
    },
};

// =============================================================================
// NEIGHBOR ANALYSIS
// =============================================================================

/**
 * Analyze neighbors of a tile and return bitmask of which neighbors are the secondary type
 */
function getNeighborMask(
    x: number,
    y: number,
    worldTiles: Map<string, WorldTile>,
    secondaryType: string
): number {
    let mask = 0;
    
    for (const [dir, offset] of Object.entries(NEIGHBOR_OFFSETS)) {
        const neighborX = x + offset.x;
        const neighborY = y + offset.y;
        const neighborKey = `${neighborX}_${neighborY}`;
        const neighborTile = worldTiles.get(neighborKey);
        
        if (neighborTile) {
            let neighborType = neighborTile.tileType?.tag;
            
            // Map Quarry to Dirt for autotiling comparisons
            if (neighborType === 'Quarry') {
                neighborType = 'Dirt';
            }
            
            if (neighborType === secondaryType) {
                mask |= offset.bit;
            }
        }
    }
    
    return mask;
}

/**
 * Check if a water tile is a "pond" (fully surrounded by land on all 4 cardinals)
 */
function isPondTile(
    x: number,
    y: number,
    worldTiles: Map<string, WorldTile>,
    landTypes: string[]
): boolean {
    const cardinals = ['N', 'E', 'S', 'W'] as const;
    
    for (const dir of cardinals) {
        const offset = NEIGHBOR_OFFSETS[dir];
        const neighborX = x + offset.x;
        const neighborY = y + offset.y;
        const neighborKey = `${neighborX}_${neighborY}`;
        const neighborTile = worldTiles.get(neighborKey);
        
        if (!neighborTile) return false;
        
        let neighborType = neighborTile.tileType?.tag;
        if (neighborType === 'Quarry') neighborType = 'Dirt';
        
        if (!landTypes.includes(neighborType)) {
            return false;
        }
    }
    
    return true;
}

/**
 * Get the pond tile position (B1-B4) based on which corner this water tile is in
 * relative to neighboring water tiles
 */
function getPondTilePosition(
    x: number,
    y: number,
    worldTiles: Map<string, WorldTile>,
    waterTypes: string[]
): { row: number; col: number } {
    // Check if there are water tiles to the east and south to determine 2×2 position
    const hasWaterEast = (() => {
        const key = `${x + 1}_${y}`;
        const tile = worldTiles.get(key);
        if (!tile) return false;
        return waterTypes.includes(tile.tileType?.tag || '');
    })();
    
    const hasWaterSouth = (() => {
        const key = `${x}_${y + 1}`;
        const tile = worldTiles.get(key);
        if (!tile) return false;
        return waterTypes.includes(tile.tileType?.tag || '');
    })();
    
    // Determine position in 2×2 grid
    if (!hasWaterEast && !hasWaterSouth) {
        return TILE_POSITIONS.B4; // Bottom-right (isolated or SE corner)
    } else if (hasWaterEast && !hasWaterSouth) {
        return TILE_POSITIONS.B3; // Bottom-left
    } else if (!hasWaterEast && hasWaterSouth) {
        return TILE_POSITIONS.B2; // Top-right
    } else {
        return TILE_POSITIONS.B1; // Top-left
    }
}

// =============================================================================
// NEW FORMAT TILE SELECTION (15-tile hierarchical)
// =============================================================================

/**
 * Select the appropriate tile from the 3×3 island autotile (A1-A9) based on neighbor mask
 * 
 * The 3×3 tileset shows an ISLAND shape:
 * - A1 (NW corner): Land protrudes NW, water at S and E
 * - A2 (N edge): Land with water above (north)
 * - A3 (NE corner): Land protrudes NE, water at S and W
 * - A4 (W edge): Land with water to the left (west)
 * - A5 (center): Full land, no edges (interior)
 * - A6 (E edge): Land with water to the right (east)
 * - A7 (SW corner): Land protrudes SW, water at N and E
 * - A8 (S edge): Land with water below (south)
 * - A9 (SE corner): Land protrudes SE, water at N and W
 * 
 * The mask represents which neighbors are the SECONDARY type (e.g., water/beach)
 * Cardinal bits: N=0x01, E=0x02, S=0x04, W=0x08
 * Diagonal bits: NE=0x10, SE=0x20, SW=0x40, NW=0x80
 */
function selectIslandTile(mask: number): { row: number; col: number } {
    // Check for bitmask override first
    if (DEBUG_OVERRIDES.bitmaskOverrides[mask]) {
        const override = DEBUG_OVERRIDES.bitmaskOverrides[mask];
        if (DEBUG_OVERRIDES.enableLogging) {
            console.log(`[Autotile] Bitmask ${mask} overridden to row=${override!.row}, col=${override!.col}`);
        }
        return override!;
    }
    
    // Special cases for diagonal-only bitmasks
    // NE diagonal (16) → row 4, col 1
    if (mask === 16) {
        return { row: 4, col: 1 };
    }
    // SE diagonal (32) → row 3, col 1
    if (mask === 32) {
        return { row: 3, col: 1 };
    }
    // SW diagonal (64) → row 3, col 2
    if (mask === 64) {
        return { row: 3, col: 2 };
    }
    // NW diagonal (128) → row 4, col 2
    if (mask === 128) {
        return { row: 4, col: 2 };
    }
    
    // If no neighbors of secondary type, use center tile (interior)
    if (mask === 0) {
        if (DEBUG_OVERRIDES.namedOverrides.interior) {
            return DEBUG_OVERRIDES.namedOverrides.interior;
        }
        return TILE_POSITIONS.A5;
    }
    
    // Extract cardinal and diagonal bits
    const hasN = (mask & DIR_N) !== 0;
    const hasE = (mask & DIR_E) !== 0;
    const hasS = (mask & DIR_S) !== 0;
    const hasW = (mask & DIR_W) !== 0;
    const hasNE = (mask & DIR_NE) !== 0;
    const hasSE = (mask & DIR_SE) !== 0;
    const hasSW = (mask & DIR_SW) !== 0;
    const hasNW = (mask & DIR_NW) !== 0;
    
    // Count cardinals
    const cardinalCount = (hasN ? 1 : 0) + (hasE ? 1 : 0) + (hasS ? 1 : 0) + (hasW ? 1 : 0);
    
    // Full surround (all 4 cardinals have secondary type) - use center (isolated land piece)
    if (hasN && hasE && hasS && hasW) {
        return TILE_POSITIONS.A5;
    }
    
    // Three cardinals - water on 3 sides, use center as there's no perfect tile
    if (cardinalCount === 3) {
        return TILE_POSITIONS.A5;
    }
    
    // Two cardinals - Check for CONVEX vs CONCAVE corners
    // CONVEX (A tiles): When diagonal is also water → land bulges out at corner
    // CONCAVE (B tiles): When diagonal is NOT water → water wraps around corner
    if (cardinalCount === 2) {
        // Water at N+E
        if (hasN && hasE) {
            if (DEBUG_OVERRIDES.namedOverrides.cornerNE) return DEBUG_OVERRIDES.namedOverrides.cornerNE;
            // If NE diagonal is also water → CONVEX corner (A3)
            // If NE diagonal is NOT water → CONCAVE corner (B3)
            return hasNE ? TILE_POSITIONS.A3 : TILE_POSITIONS.B3;
        }
        // Water at N+W
        if (hasN && hasW) {
            if (DEBUG_OVERRIDES.namedOverrides.cornerNW) return DEBUG_OVERRIDES.namedOverrides.cornerNW;
            // If NW diagonal is also water → CONVEX corner (A1)
            // If NW diagonal is NOT water → CONCAVE corner (B4)
            return hasNW ? TILE_POSITIONS.A1 : TILE_POSITIONS.B4;
        }
        // Water at S+E
        if (hasS && hasE) {
            if (DEBUG_OVERRIDES.namedOverrides.cornerSE) return DEBUG_OVERRIDES.namedOverrides.cornerSE;
            // If SE diagonal is also water → CONVEX corner (A9)
            // If SE diagonal is NOT water → CONCAVE corner (B1)
            return hasSE ? TILE_POSITIONS.A9 : TILE_POSITIONS.B1;
        }
        // Water at S+W
        if (hasS && hasW) {
            if (DEBUG_OVERRIDES.namedOverrides.cornerSW) return DEBUG_OVERRIDES.namedOverrides.cornerSW;
            // If SW diagonal is also water → CONVEX corner (A7)
            // If SW diagonal is NOT water → CONCAVE corner (B2)
            return hasSW ? TILE_POSITIONS.A7 : TILE_POSITIONS.B2;
        }
        // Channels (opposite cardinals) - use center
        if (hasN && hasS) return TILE_POSITIONS.A5;
        if (hasE && hasW) return TILE_POSITIONS.A5;
    }
    
    // Single cardinal - edge tiles (water on one side)
    if (cardinalCount === 1) {
        if (hasN) {
            if (DEBUG_OVERRIDES.namedOverrides.singleN) return DEBUG_OVERRIDES.namedOverrides.singleN;
            return TILE_POSITIONS.A2; // Water north → top edge
        }
        if (hasS) {
            if (DEBUG_OVERRIDES.namedOverrides.singleS) return DEBUG_OVERRIDES.namedOverrides.singleS;
            return TILE_POSITIONS.A8; // Water south → bottom edge
        }
        if (hasE) {
            if (DEBUG_OVERRIDES.namedOverrides.singleE) return DEBUG_OVERRIDES.namedOverrides.singleE;
            return TILE_POSITIONS.A6; // Water east → right edge
        }
        if (hasW) {
            if (DEBUG_OVERRIDES.namedOverrides.singleW) return DEBUG_OVERRIDES.namedOverrides.singleW;
            return TILE_POSITIONS.A4; // Water west → left edge
        }
    }
    
    // No cardinals but has diagonals - handle single diagonal cases
    if (cardinalCount === 0) {
        // Single diagonal neighbor - use appropriate convex corner
        if (hasNE && !hasSE && !hasSW && !hasNW) {
            // Only NE diagonal → convex NE corner (A3)
            return TILE_POSITIONS.A3;
        }
        if (hasNW && !hasNE && !hasSE && !hasSW) {
            // Only NW diagonal → convex NW corner (A1)
            return TILE_POSITIONS.A1;
        }
        if (hasSE && !hasNE && !hasNW && !hasSW) {
            // Only SE diagonal → convex SE corner (A9)
            return TILE_POSITIONS.A9;
        }
        if (hasSW && !hasNE && !hasNW && !hasSE) {
            // Only SW diagonal → convex SW corner (A7)
            return TILE_POSITIONS.A7;
        }
        // Multiple diagonals or other cases - use center tile
        return TILE_POSITIONS.A5;
    }
    
    // Default to center tile
    return TILE_POSITIONS.A5;
}

/**
 * Get sprite coordinates for a tile in the NEW 15-tile format
 */
function getNewFormatSpriteCoords(
    tilePos: { row: number; col: number }
): { x: number; y: number; width: number; height: number } {
    return {
        x: tilePos.col * NEW_TILE_SIZE,
        y: tilePos.row * NEW_TILE_SIZE,
        width: NEW_TILE_SIZE,
        height: NEW_TILE_SIZE,
    };
}

// =============================================================================
// LEGACY FORMAT SUPPORT (48-tile bitmask)
// =============================================================================

/** Legacy neighbor bits for old format compatibility */
const LEGACY_NEIGHBOR_BITS = [128, 1, 2, 8, 4, 64, 32, 16]; // TL, T, TR, L, R, BL, B, BR
const LEGACY_NEIGHBOR_OFFSETS = [
    { x: -1, y: -1 }, // Top-left
    { x:  0, y: -1 }, // Top
    { x:  1, y: -1 }, // Top-right
    { x: -1, y:  0 }, // Left
    { x:  1, y:  0 }, // Right
    { x: -1, y:  1 }, // Bottom-left
    { x:  0, y:  1 }, // Bottom
    { x:  1, y:  1 }, // Bottom-right
];

/** Legacy bitmask to tile index mapping */
const LEGACY_DEBUG_OVERRIDES: { [bitmask: number]: number } = {
    200: 18, 72: 18, 136: 18, 128: 3, 201: 12, 137: 12, 64: 9, 22: 20,
    16: 11, 54: 26, 52: 26, 116: 26, 23: 14, 2: 5, 6: 20, 129: 13,
    112: 25, 131: 13, 3: 13, 135: 14, 139: 12, 7: 14, 120: 24, 96: 25,
    104: 24, 80: 25, 48: 25, 124: 47, 4: 20, 36: 26, 32: 25, 232: 24,
    1: 13, 5: 14, 17: 14, 18: 20, 171: 47, 213: 47, 55: 47, 21: 14,
    73: 12, 118: 26, 11: 12, 203: 12, 133: 14, 233: 47, 192: 18, 143: 47,
    130: 13, 151: 14, 176: 24, 134: 14, 159: 47, 219: 47, 156: 47, 150: 14,
    181: 47, 191: 47, 252: 47, 187: 47, 247: 47, 255: 47, 223: 47, 254: 47,
    222: 47, 207: 47, 138: 12, 251: 47, 225: 47, 67: 12, 227: 47, 199: 47,
    98: 26, 74: 12, 114: 26, 115: 47, 66: 46, 248: 24, 183: 47, 147: 14,
    224: 24, 249: 47, 86: 26, 126: 47, 51: 47, 149: 14, 168: 24, 158: 47,
    239: 47, 75: 12, 235: 47, 95: 47, 144: 45, 193: 12, 243: 47, 246: 47,
    185: 47, 19: 14, 152: 24, 180: 47, 153: 47, 244: 47, 202: 12, 84: 26,
    40: 24, 106: 47, 195: 12, 132: 14, 24: 24, 50: 26, 119: 47, 145: 14,
    240: 24, 177: 47, 148: 14, 155: 47, 179: 47, 241: 47, 245: 47, 102: 26,
    111: 47, 127: 47, 234: 47, 123: 47, 231: 47, 99: 47, 78: 47, 215: 47,
    65: 12, 34: 26, 9: 12, 38: 26, 217: 47, 188: 47, 189: 47, 253: 47,
    70: 26, 206: 47, 110: 47, 88: 24, 94: 47, 216: 24, 238: 47, 220: 47,
    218: 47, 122: 47, 214: 47, 190: 47, 221: 47, 250: 47, 103: 47, 90: 47,
    87: 47, 79: 47, 157: 47, 242: 47, 100: 26, 182: 47, 108: 47, 68: 26,
    10: 12, 160: 24, 92: 47, 71: 47, 91: 47, 142: 47, 146: 14, 194: 12,
    107: 47, 154: 47, 30: 47, 76: 47, 53: 47, 82: 26, 15: 47, 236: 47,
    178: 2, 198: 47, 204: 47, 117: 47, 121: 47, 14: 47, 212: 47, 31: 47,
};

const LEGACY_TILE_BY_MASK: number[] = new Array(256).fill(18);

// Initialize legacy lookup table
const LEGACY_CANONICAL_TILES: { [mask: number]: number } = {
    0b00000000: 18, 0b00000001: 19, 0b00000100: 13, 0b00010000: 25, 0b01000000: 31,
    0b00000101: 8, 0b00010001: 26, 0b01000001: 32, 0b00010100: 20, 0b01000100: 14,
    0b01010000: 27, 0b00010101: 21, 0b01000101: 15, 0b01010001: 33, 0b01010100: 28,
    0b01010101: 22, 0b00000011: 6, 0b00000110: 9, 0b00001100: 16, 0b00011000: 23,
    0b00110000: 29, 0b01100000: 35, 0b11000000: 34, 0b10000001: 7, 0b00000111: 5,
    0b00001110: 11, 0b00011100: 17, 0b00111000: 24, 0b01110000: 30, 0b11100000: 12,
    0b11000001: 1, 0b10000011: 25,
};

Object.entries(LEGACY_CANONICAL_TILES).forEach(([mask, tileIndex]) => {
    LEGACY_TILE_BY_MASK[parseInt(mask)] = tileIndex;
});

function legacyCanonicalMask(mask: number): number {
    if ((mask & 2) && !(mask & 1) && !(mask & 4)) mask ^= 2;
    if ((mask & 8) && !(mask & 4) && !(mask & 16)) mask ^= 8;
    if ((mask & 32) && !(mask & 16) && !(mask & 64)) mask ^= 32;
    if ((mask & 128) && !(mask & 64) && !(mask & 1)) mask ^= 128;
    return mask;
}

function legacyTileForMask(mask: number): number {
    if (LEGACY_DEBUG_OVERRIDES[mask] !== undefined) {
        return LEGACY_DEBUG_OVERRIDES[mask];
    }
    const normalized = legacyCanonicalMask(mask);
    return LEGACY_TILE_BY_MASK[normalized] || 18;
}

function getLegacyBitmask(
    x: number,
    y: number,
    worldTiles: Map<string, WorldTile>,
    secondaryType: string
): number {
    let bitmask = 0;
    
    LEGACY_NEIGHBOR_OFFSETS.forEach((offset, index) => {
        const neighborX = x + offset.x;
        const neighborY = y + offset.y;
        const neighborKey = `${neighborX}_${neighborY}`;
        const neighborTile = worldTiles.get(neighborKey);
        
        if (neighborTile) {
            let neighborType = neighborTile.tileType?.tag;
            if (neighborType === 'Quarry') neighborType = 'Dirt';
            if (neighborType === secondaryType) {
                bitmask |= LEGACY_NEIGHBOR_BITS[index];
            }
        }
    });
    
    return bitmask;
}

function getLegacySpriteCoords(
    tileIndex: number
): { x: number; y: number; width: number; height: number } {
    const safeTileIndex = Math.max(0, Math.min(47, tileIndex));
    const col = safeTileIndex % 6;
    const row = Math.floor(safeTileIndex / 6);
    const spriteWidth = 1280 / 6;
    const spriteHeight = 1280 / 8;
    
    return {
        x: Math.floor(col * spriteWidth),
        y: Math.floor(row * spriteHeight),
        width: Math.floor(spriteWidth),
        height: Math.floor(spriteHeight),
    };
}

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * Get autotile sprite coordinates for a specific tile
 * Handles both NEW (15-tile) and LEGACY (48-tile) formats
 * 
 * @param isSecondaryInterior - If true, use secondaryInterior position from config
 */
export function getAutotileSpriteCoords(
    config: AutotileConfig,
    bitmask: number,
    isSecondaryInterior: boolean = false
): { x: number; y: number; width: number; height: number } {
    if (config.isNewFormat) {
        // Handle secondary interior (e.g., Sea interior from Beach_Sea tileset)
        if (isSecondaryInterior && config.secondaryInterior) {
            return getNewFormatSpriteCoords(config.secondaryInterior);
        }
        
        // Handle primary interior (bitmask 0)
        if (bitmask === 0 && config.primaryInterior) {
            return getNewFormatSpriteCoords(config.primaryInterior);
        }
        
        // New 15-tile format - select tile based on neighbor pattern
        const tilePos = selectIslandTile(bitmask);
        return getNewFormatSpriteCoords(tilePos);
    } else {
        // Legacy 48-tile format
        const tileIndex = legacyTileForMask(bitmask);
        return getLegacySpriteCoords(tileIndex);
    }
}

/**
 * Calculate bitmask for autotile selection based on neighboring tiles
 * Returns appropriate bitmask format based on config
 */
export function calculateAutotileBitmask(
    centerX: number,
    centerY: number,
    worldTiles: Map<string, WorldTile>,
    primaryType: string,
    secondaryType: string,
    isNewFormat: boolean = true
): number {
    if (isNewFormat) {
        return getNeighborMask(centerX, centerY, worldTiles, secondaryType);
    } else {
        return getLegacyBitmask(centerX, centerY, worldTiles, secondaryType);
    }
}

/**
 * Determine if a tile should use autotiling and return the appropriate config
 * 
 * Rules:
 * - Primary tiles with secondary neighbors → Use edge/corner tiles
 * - Primary tiles interior (no secondary neighbors) → Use A5 (center)
 * - Sea tiles → Use SEA_TILE_CONFIG settings (tileset or base texture)
 */
export function shouldUseAutotiling(
    tileType: string,
    worldTiles: Map<string, WorldTile>,
    x: number,
    y: number
): { config: AutotileConfig; bitmask: number; isSecondaryInterior?: boolean } | null {
    // Get the actual tile to verify type
    const centerTileKey = `${x}_${y}`;
    const centerTile = worldTiles.get(centerTileKey);
    
    if (!centerTile) {
        return null;
    }
    
    // Use actual tile type from the tile object
    const actualTileType = centerTile.tileType?.tag;
    if (actualTileType) {
        tileType = actualTileType;
    }
    
    // Map Quarry tiles to Dirt for autotiling
    const autotileTileType = tileType === 'Quarry' ? 'Dirt' : tileType;
    
    // Use tile's coordinates if available
    if ('worldX' in centerTile && 'worldY' in centerTile) {
        const tileWorldX = (centerTile as any).worldX;
        const tileWorldY = (centerTile as any).worldY;
        if (tileWorldX !== undefined && tileWorldY !== undefined) {
            x = tileWorldX;
            y = tileWorldY;
        }
    }
    
    // First pass: Look for configs where this tile is PRIMARY and has secondary neighbors
    for (const [configKey, config] of Object.entries(AUTOTILE_CONFIGS)) {
        if (autotileTileType === config.primaryType) {
            // Skip special cases
            if (config.primaryType === 'DirtRoad' && config.secondaryType === 'Grass') continue;
            if (config.primaryType === 'HotSpringWater') continue;
            
            // Calculate bitmask using appropriate format
            const bitmask = calculateAutotileBitmask(
                x, y, worldTiles, config.primaryType, config.secondaryType, config.isNewFormat
            );
            
            if (bitmask > 0) {
                return { config, bitmask };
            }
        }
    }
    
    // Second pass: For NEW FORMAT tilesets, use primaryInterior for interior PRIMARY tiles
    for (const [configKey, config] of Object.entries(AUTOTILE_CONFIGS)) {
        if (autotileTileType === config.primaryType && config.isNewFormat) {
            // Skip special cases
            if (config.primaryType === 'DirtRoad' && config.secondaryType === 'Grass') continue;
            if (config.primaryType === 'HotSpringWater') continue;
            
            // Return config with bitmask 0 - will use primaryInterior
            return { config, bitmask: 0 };
        }
    }
    
    // Third pass: Look for configs where this tile is SECONDARY (e.g., Sea in Beach_Sea)
    // Use secondaryInterior tile position for interior secondary tiles
    for (const [configKey, config] of Object.entries(AUTOTILE_CONFIGS)) {
        if (autotileTileType === config.secondaryType && config.isNewFormat && config.secondaryInterior) {
            // Return config with special flag for secondary interior
            return { config, bitmask: -1, isSecondaryInterior: true };
        }
    }
    
    // Other secondary types return null - they use base texture
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
    
    if (!centerTile) {
        return [];
    }
    
    const actualTileType = centerTile.tileType?.tag;
    if (actualTileType) {
        tileType = actualTileType;
    }
    
    const autotileTileType = tileType === 'Quarry' ? 'Dirt' : tileType;
    
    if ('worldX' in centerTile && 'worldY' in centerTile) {
        const tileWorldX = (centerTile as any).worldX;
        const tileWorldY = (centerTile as any).worldY;
        if (tileWorldX !== undefined && tileWorldY !== undefined) {
            x = tileWorldX;
            y = tileWorldY;
        }
    }
    
    const autotiles: Array<{ config: AutotileConfig; bitmask: number }> = [];
    
    for (const [configKey, config] of Object.entries(AUTOTILE_CONFIGS)) {
        if (autotileTileType === config.primaryType) {
            if (config.primaryType === 'DirtRoad' && config.secondaryType === 'Grass') continue;
            if (config.primaryType === 'HotSpringWater') continue;
            
            const bitmask = calculateAutotileBitmask(
                x, y, worldTiles, config.primaryType, config.secondaryType, config.isNewFormat
            );
            
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
    isOverridden: boolean;
} {
    // For new format, calculate tile position
    const tilePos = selectIslandTile(bitmask);
    
    return {
        bitmask,
        tileIndex: tilePos.row * TILESET_COLS + tilePos.col,
        row: tilePos.row,
        col: tilePos.col,
        coordinates: {
            x: tilePos.col * NEW_TILE_SIZE,
            y: tilePos.row * NEW_TILE_SIZE,
        },
        isOverridden: false,
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

// Legacy exports for backward compatibility
export function rowColToTileIndex(row: number, col: number): number {
    return Math.min(47, Math.max(0, row * 6 + col));
}

export function tileIndexToRowCol(tileIndex: number): { row: number; col: number } {
    const safeTileIndex = Math.min(47, Math.max(0, tileIndex));
    return {
        row: Math.floor(safeTileIndex / 6),
        col: safeTileIndex % 6,
    };
}

export function getAutotilePosition(tileIndex: number, config: AutotileConfig): { x: number; y: number } {
    if (config.isNewFormat) {
        // Convert index to row/col for new format
        const row = Math.floor(tileIndex / TILESET_COLS);
        const col = tileIndex % TILESET_COLS;
        return {
            x: col * NEW_TILE_SIZE,
            y: row * NEW_TILE_SIZE,
        };
    } else {
        // Legacy format
        const safeTileIndex = Math.max(0, Math.min(47, tileIndex));
        const col = safeTileIndex % 6;
        const row = Math.floor(safeTileIndex / 6);
        const spriteWidth = 1280 / 6;
        const spriteHeight = 1280 / 8;
        return {
            x: Math.floor(col * spriteWidth),
            y: Math.floor(row * spriteHeight),
        };
    }
}
