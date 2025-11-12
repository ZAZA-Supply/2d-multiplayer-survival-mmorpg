import { HomesteadHearth } from '../../generated'; // Import generated HomesteadHearth type
import hearthImage from '../../assets/doodads/hearth.png'; // Direct import
import { GroundEntityConfig, renderConfiguredGroundEntity } from './genericGroundRenderer'; // Import generic renderer
import { drawDynamicGroundShadow, calculateShakeOffsets } from './shadowUtils';
import { imageManager } from './imageManager'; // Import image manager
import { HomesteadHearth as SpacetimeDBHomesteadHearth } from '../../generated';

// --- Constants directly used by this module or exported ---
export const HEARTH_WIDTH = 125; // 30% larger than 96 (96 * 1.3 = 124.8, rounded to 125)
export const HEARTH_HEIGHT = 125; // 30% larger than 96
export const HEARTH_WIDTH_PREVIEW = 125; // Match actual rendering size
export const HEARTH_HEIGHT_PREVIEW = 125; // Match actual rendering size
// Offset for rendering to align with server-side collision/damage zones
export const HEARTH_RENDER_Y_OFFSET = 10; // Visual offset from entity's base Y

// Hearth interaction distance (player <-> hearth)
export const PLAYER_HEARTH_INTERACTION_DISTANCE_SQUARED = 96.0 * 96.0; // Same as campfire: 96px

// --- Other Local Constants ---
const SHAKE_DURATION_MS = 150; // How long the shake effect lasts
const SHAKE_INTENSITY_PX = 8; // Same as campfire
const HEALTH_BAR_WIDTH = 60; // Slightly wider than campfire
const HEALTH_BAR_HEIGHT = 6;
const HEALTH_BAR_Y_OFFSET = 10; // Offset above the hearth image
const HEALTH_BAR_VISIBLE_DURATION_MS = 3000; // Added for fade effect

// --- Client-side animation tracking for hearth shakes ---
const clientHearthShakeStartTimes = new Map<string, number>(); // hearthId -> client timestamp when shake started
const lastKnownServerHearthShakeTimes = new Map<string, number>();

// --- Define Configuration ---
const hearthConfig: GroundEntityConfig<HomesteadHearth> = {
    // Return imported URL - hearth is always "on" (always burning)
    getImageSource: (entity) => {
        if (entity.isDestroyed) {
            return null; // Don't render if destroyed
        }
        return hearthImage; // Always use the same image (hearth is always lit)
    },

    getTargetDimensions: (_img, _entity) => ({
        width: HEARTH_WIDTH,
        height: HEARTH_HEIGHT,
    }),

    calculateDrawPosition: (entity, drawWidth, drawHeight) => ({
        // Top-left corner for image drawing, originating from entity's base Y
        // Apply Y offset to better align with collision area
        drawX: entity.posX - drawWidth / 2,
        drawY: entity.posY - drawHeight - HEARTH_RENDER_Y_OFFSET,
    }),

    getShadowParams: undefined,

    drawCustomGroundShadow: (ctx, entity, entityImage, entityPosX, entityPosY, imageDrawWidth, imageDrawHeight, cycleProgress) => {
        // Draw DYNAMIC ground shadow for hearth (if not destroyed)
        if (!entity.isDestroyed) {
            // Calculate shake offsets for shadow synchronization using helper function
            const { shakeOffsetX, shakeOffsetY } = calculateShakeOffsets(
                entity,
                entity.id.toString(),
                {
                    clientStartTimes: clientHearthShakeStartTimes,
                    lastKnownServerTimes: lastKnownServerHearthShakeTimes
                },
                SHAKE_DURATION_MS,
                SHAKE_INTENSITY_PX
            );

            drawDynamicGroundShadow({
                ctx,
                entityImage,
                entityCenterX: entityPosX,
                entityBaseY: entityPosY,
                imageDrawWidth,
                imageDrawHeight,
                cycleProgress,
                maxStretchFactor: 1.2, 
                minStretchFactor: 0.1,  
                shadowBlur: 2,         
                pivotYOffset: 25,
                // Pass shake offsets so shadow moves with the hearth
                shakeOffsetX,
                shakeOffsetY      
            });
        }
    },

    applyEffects: (ctx, entity, nowMs, baseDrawX, baseDrawY, cycleProgress) => {
        // Dynamic shadow is now handled in drawCustomGroundShadow for all states
        // No additional shadow effects needed here

        let shakeOffsetX = 0;
        let shakeOffsetY = 0;

        if (entity.lastHitTime && !entity.isDestroyed) {
            const lastHitTimeMs = Number(entity.lastHitTime.microsSinceUnixEpoch / 1000n);
            const elapsedSinceHit = nowMs - lastHitTimeMs;

            if (elapsedSinceHit >= 0 && elapsedSinceHit < SHAKE_DURATION_MS) {
                const shakeFactor = 1.0 - (elapsedSinceHit / SHAKE_DURATION_MS);
                const currentShakeIntensity = SHAKE_INTENSITY_PX * shakeFactor;
                shakeOffsetX = (Math.random() - 0.5) * 2 * currentShakeIntensity;
                shakeOffsetY = (Math.random() - 0.5) * 2 * currentShakeIntensity; 
            }
        }

        return {
            offsetX: shakeOffsetX,
            offsetY: shakeOffsetY,
        };
    },

    drawOverlay: (ctx, entity, finalDrawX, finalDrawY, finalDrawWidth, finalDrawHeight, nowMs, baseDrawX, baseDrawY) => {
        // If destroyed, do nothing in overlay (main image will also not be drawn)
        if (entity.isDestroyed) {
            return;
        }

        const health = entity.health ?? 0;
        const maxHealth = entity.maxHealth ?? 1;

        // Health bar logic: only if not destroyed, health < maxHealth, and recently hit
        if (health < maxHealth && entity.lastHitTime) {
            const lastHitTimeMs = Number(entity.lastHitTime.microsSinceUnixEpoch / 1000n);
            const elapsedSinceHit = nowMs - lastHitTimeMs;

            if (elapsedSinceHit < HEALTH_BAR_VISIBLE_DURATION_MS) {
                const healthPercentage = Math.max(0, health / maxHealth);
                const barOuterX = finalDrawX + (finalDrawWidth - HEALTH_BAR_WIDTH) / 2;
                const barOuterY = finalDrawY + finalDrawHeight + HEALTH_BAR_Y_OFFSET; // Position below hearth

                // Fade effect for the health bar
                const timeSinceLastHitRatio = elapsedSinceHit / HEALTH_BAR_VISIBLE_DURATION_MS;
                const opacity = Math.max(0, 1 - Math.pow(timeSinceLastHitRatio, 2)); // Fade out faster at the end

                ctx.fillStyle = `rgba(0, 0, 0, ${0.5 * opacity})`;
                ctx.fillRect(barOuterX, barOuterY, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT);

                const healthBarInnerWidth = HEALTH_BAR_WIDTH * healthPercentage;
                const r = Math.floor(255 * (1 - healthPercentage));
                const g = Math.floor(255 * healthPercentage);
                ctx.fillStyle = `rgba(${r}, ${g}, 0, ${opacity})`;
                ctx.fillRect(barOuterX, barOuterY, healthBarInnerWidth, HEALTH_BAR_HEIGHT);

                ctx.strokeStyle = `rgba(0, 0, 0, ${0.7 * opacity})`;
                ctx.lineWidth = 1;
                ctx.strokeRect(barOuterX, barOuterY, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT);
            }
        }
    },

    fallbackColor: '#8B4513', // Saddle brown fallback (darker than campfire)
};

// Preload hearth image
imageManager.preloadImage(hearthImage);

// --- Rendering Function ---
export function renderHearth(
    ctx: CanvasRenderingContext2D, 
    hearth: HomesteadHearth, 
    nowMs: number, 
    cycleProgress: number,
    onlyDrawShadow?: boolean,
    skipDrawingShadow?: boolean
) { 
    renderConfiguredGroundEntity({
        ctx,
        entity: hearth,
        config: hearthConfig,
        nowMs,
        entityPosX: hearth.posX,
        entityPosY: hearth.posY,
        cycleProgress,
        onlyDrawShadow,
        skipDrawingShadow
    });
} 

