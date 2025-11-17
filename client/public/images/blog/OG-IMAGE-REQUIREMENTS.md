# Blog Post OG Image Requirements

## What You Need

For optimal social media sharing (Twitter/X, Discord, Facebook, LinkedIn), each blog post should have a proper Open Graph (OG) image.

## Image Specifications

### Dimensions
- **Recommended Size:** 1200x630 pixels
- **Aspect Ratio:** 1.91:1 (landscape)
- **Format:** JPG or PNG
- **File Size:** Keep under 1MB for fast loading

### Design Guidelines

1. **High Contrast:** Use bold, readable text and imagery
2. **Safe Zones:** Keep important content 100px away from edges (some platforms crop)
3. **Brand Consistency:** Include Broth & Bullets logo or branding
4. **Readable Text:** If using text overlay, ensure it's legible at thumbnail size

## Required Images

### Default Fallback Image
**File:** `og-default.jpg` (1200x630px)

This is used when a blog post doesn't specify a custom coverImage. Should feature:
- Broth & Bullets logo centered on black background
- High contrast for visibility
- Minimal text (just the game name/logo)

**Design Suggestion:**
```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│         [BROTH & BULLETS]           │
│              [LOGO]                 │
│                                     │
│                                     │
└─────────────────────────────────────┘
Black background (#000000)
Logo/text in bright cyan (#00d4ff) or white
```

### Post-Specific Cover Images

Each blog post can have its own cover image. Current posts needing images:

1. **minimap-cover.jpg** - For "The Hardlight Map" post
   - Show the minimap interface with resource icons
   - Cyberpunk aesthetic with cyan/purple highlights
   
2. **minimap-resources-screenshot.jpg** - Screenshot showing minimap with resources
   - In-game screenshot of minimap open
   - Visible resource markers (trees, ores, barrels)

## How to Add Images

1. Create your image at 1200x630px
2. Save as JPG (or PNG if transparency needed)
3. Place in `client/public/images/blog/`
4. Reference in blog post: `coverImage: "/images/blog/your-image.jpg"`

## Testing Your OG Images

### Twitter/X Card Validator
https://cards-dev.twitter.com/validator

### Facebook Sharing Debugger
https://developers.facebook.com/tools/debug/

### LinkedIn Post Inspector
https://www.linkedin.com/post-inspector/

### Discord
Just paste the URL in a Discord channel to see the embed preview

## Current Implementation

The blog system automatically:
- Uses the `coverImage` field from each blog post
- Falls back to `/images/blog/og-default.jpg` if no coverImage is specified
- Generates proper OG meta tags with absolute URLs
- Sets proper dimensions (1200x630) in meta tags
- Includes Twitter Card tags for optimal Twitter/X display

## Quick Checklist

- [ ] Create `og-default.jpg` (Broth & Bullets logo on black, 1200x630px)
- [ ] Create `minimap-cover.jpg` for the minimap blog post
- [ ] Create `minimap-resources-screenshot.jpg` for the minimap blog post
- [ ] Test all images with social media validators
- [ ] Verify images load correctly on brothandbullets.com
- [ ] Check file sizes (keep under 1MB each)

