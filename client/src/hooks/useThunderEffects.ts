import { useEffect, useRef } from 'react';
import { handleServerThunderEvent } from '../utils/renderers/rainRenderingUtils';
import { calculateChunkIndex } from '../utils/chunkUtils';

interface UseThunderEffectsProps {
  connection: any | null;
  localPlayer: any | undefined;
}

export function useThunderEffects({ connection, localPlayer }: UseThunderEffectsProps) {
  // Track processed thunder event IDs to prevent duplicate processing
  const processedThunderIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!connection) return;

    // Listen for thunder events from the server
    const handleThunderEvent = (ctx: any, thunderEvent: any) => {
      // Check if we've already processed this thunder event
      const thunderId = thunderEvent.id?.toString();
      if (!thunderId || processedThunderIds.current.has(thunderId)) {
        return; // Skip already processed events
      }

      // Only trigger thunder flash if it's in the player's current chunk
      if (!localPlayer) {
        return;
      }

      const playerChunkIndex = calculateChunkIndex(localPlayer.positionX, localPlayer.positionY);
      
      if (thunderEvent.chunkIndex !== playerChunkIndex) {
        return; // Silently ignore thunder in other chunks
      }

      // Mark this thunder event as processed
      processedThunderIds.current.add(thunderId);
      
      // Clean up old processed IDs (keep only last 100 to prevent memory leak)
      if (processedThunderIds.current.size > 100) {
        const idsArray = Array.from(processedThunderIds.current);
        processedThunderIds.current = new Set(idsArray.slice(-50)); // Keep only last 50
      }

      console.log(`[Thunder] ⚡ Lightning flash in chunk ${playerChunkIndex}! Intensity: ${thunderEvent.intensity}`);
      
      // REALISTIC PHYSICS: Lightning flash happens instantly (visual effect)
      // Thunder sound is delayed by 0.5-2.5 seconds on the server to simulate distance
      // (Light travels ~instantly, but sound travels ~343 m/s)
      handleServerThunderEvent(thunderEvent);
    };

    // Subscribe to thunder events
    try {
      // Check if thunderEvent table exists in the generated bindings (note: camelCase)
      if (connection.db.thunderEvent && typeof connection.db.thunderEvent.onInsert === 'function') {
        connection.db.thunderEvent.onInsert(handleThunderEvent);
        console.log('[Thunder] Subscribed to thunder events');
      } else {
        console.warn('[Thunder] thunderEvent table not found in generated bindings. Available tables:', Object.keys(connection.db || {}));
      }
    } catch (error) {
      console.error('[Thunder] Failed to subscribe to thunder events:', error);
    }

    // Cleanup function
    return () => {
      try {
        console.log('[Thunder] Thunder effects hook cleanup');
        processedThunderIds.current.clear(); // Clear processed IDs on unmount
      } catch (error) {
        console.error('[Thunder] Error during thunder effects cleanup:', error);
      }
    };
  }, [connection, localPlayer]);
} 