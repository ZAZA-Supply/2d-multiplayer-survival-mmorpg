import { useState, useRef, useCallback, useEffect } from 'react';
import { Tree } from '../generated';

/**
 * Configuration for falling tree animations
 */
const TREE_FALL_DURATION_MS = 5000; // 5 seconds to match tree_falling.mp3 sound
const CLEANUP_DELAY_MS = 200; // Quicker cleanup (reduced from 500ms)

/**
 * Represents a tree that is currently falling
 */
export interface FallingTreeState {
  treeId: string;
  startTime: number; // Client timestamp when fall started
  posX: number;
  posY: number;
  treeType: any; // TreeType from generated code
  imageSource: string; // Cached image source for rendering
  targetWidth: number; // Cached width for rendering
}

/**
 * Hook to track and manage falling tree animations
 * Triggered when a tree's respawnAt field is set (tree destroyed)
 */
export function useFallingTreeAnimations(trees: Map<string, Tree>) {
  const [fallingTrees, setFallingTrees] = useState<Map<string, FallingTreeState>>(new Map());
  const previousTreeStatesRef = useRef<Map<string, { health: number; respawnAt: number | undefined }>>(new Map());

  // Check for trees that were just destroyed
  useEffect(() => {
    const now = Date.now();
    
    // Use functional update to avoid dependency on fallingTrees state
    setFallingTrees(currentFallingTrees => {
      const newFallingTrees = new Map(currentFallingTrees);
      let hasChanges = false;

      trees.forEach((tree) => {
        const treeId = tree.id.toString();
        const prevState = previousTreeStatesRef.current.get(treeId);
        
        // Check if tree has respawned (was destroyed, now has health again)
        if (newFallingTrees.has(treeId) && tree.health > 0) {
          console.log(`[FallingTree] Tree ${treeId} respawned, removing animation`);
          newFallingTrees.delete(treeId);
          hasChanges = true;
          // DON'T delete from previousTreeStatesRef - we need to track the tree's new healthy state
          // Otherwise it will be detected as "newly destroyed" on the next render
        }
        
        // Only check for newly destroyed trees if they're not already animating
        if (!newFallingTrees.has(treeId)) {
          // Detect when a tree is newly destroyed (respawnAt just got set and health is 0)
          // IMPORTANT: Only animate if we SAW the tree healthy before (prevState exists and health > 0)
          // Don't animate trees that are already destroyed when we first load them
          const isNewlyDestroyed = tree.health === 0 && 
                                   tree.respawnAt !== undefined && 
                                   tree.respawnAt !== null &&
                                   prevState !== undefined && // We must have seen this tree before
                                   prevState.health > 0; // And it was healthy last time we saw it

          if (isNewlyDestroyed) {
            // Start falling animation for this tree
            console.log(`[FallingTree] Tree ${treeId} destroyed, starting fall animation`);
            
            newFallingTrees.set(treeId, {
              treeId,
              startTime: now,
              posX: tree.posX,
              posY: tree.posY,
              treeType: tree.treeType,
              imageSource: '', // Will be populated by renderer
              targetWidth: 0, // Will be populated by renderer
            });
            hasChanges = true;
          }
        }

        // Always update previous state to track current tree state
        previousTreeStatesRef.current.set(treeId, {
          health: tree.health,
          respawnAt: tree.respawnAt ? Number(tree.respawnAt.microsSinceUnixEpoch / 1000n) : undefined,
        });
      });

      // Clean up animations for trees that no longer exist in the trees map (unloaded from view)
      newFallingTrees.forEach((fallingTree, treeId) => {
        if (!trees.has(treeId)) {
          console.log(`[FallingTree] Tree ${treeId} no longer in view, removing animation`);
          newFallingTrees.delete(treeId);
          previousTreeStatesRef.current.delete(treeId);
          hasChanges = true;
        }
      });

      // Clean up old falling animations that have completed
      const animationEndTime = now - TREE_FALL_DURATION_MS - CLEANUP_DELAY_MS;
      newFallingTrees.forEach((fallingTree, treeId) => {
        if (fallingTree.startTime < animationEndTime) {
          console.log(`[FallingTree] Cleaning up completed animation for tree ${treeId}`);
          newFallingTrees.delete(treeId);
          previousTreeStatesRef.current.delete(treeId);
          hasChanges = true;
        }
      });

      // Only return new map if there were changes (avoids unnecessary re-renders)
      return hasChanges ? newFallingTrees : currentFallingTrees;
    });
  }, [trees]); // Removed fallingTrees dependency to prevent race conditions

  /**
   * Get the current fall progress for a tree (0.0 = upright, 1.0 = fully fallen)
   */
  const getFallProgress = useCallback((treeId: string): number => {
    const fallingTree = fallingTrees.get(treeId);
    if (!fallingTree) return 0;

    const elapsed = Date.now() - fallingTree.startTime;
    const progress = Math.min(elapsed / TREE_FALL_DURATION_MS, 1.0);
    
    // Ease-in-out for more natural fall
    return progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
  }, [fallingTrees]);

  /**
   * Check if a tree is currently falling
   */
  const isTreeFalling = useCallback((treeId: string): boolean => {
    return fallingTrees.has(treeId);
  }, [fallingTrees]);

  /**
   * Update cached rendering info for a falling tree
   */
  const updateFallingTreeCache = useCallback((treeId: string, imageSource: string, targetWidth: number) => {
    setFallingTrees(prev => {
      const tree = prev.get(treeId);
      if (!tree) return prev;
      
      const updated = new Map(prev);
      updated.set(treeId, {
        ...tree,
        imageSource,
        targetWidth,
      });
      return updated;
    });
  }, []);

  return {
    fallingTrees,
    isTreeFalling,
    getFallProgress,
    updateFallingTreeCache,
    TREE_FALL_DURATION_MS,
  };
}

