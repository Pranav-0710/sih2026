# TypeWriter Animation Implementation

## What's Been Added:

### 1. TypeWriter Component (`/src/components/TypeWriter.tsx`)

- **Features:**
  - Customizable typing speed and delay
  - Animated blinking cursor
  - Support for gradient text styling
  - Optional looping functionality
  - Smooth character-by-character animation

### 2. Hero Section Integration

- **Updated:** `/src/components/HeroSection.tsx`
- **Change:** "Discover the Soul of Jharkhand" → "Discover the Soul of [TypeWriter: Jharkhand]"
- **Styling:** Beautiful gradient text with heritage and accent colors
- **Timing:** 1.5s delay, 150ms per character

## Animation Details:

- **Text:** "Jharkhand"
- **Speed:** 150ms per character (smooth typing)
- **Delay:** 1500ms (starts after other animations)
- **Styling:** Gradient from heritage gold to accent orange
- **Cursor:** Blinking cursor (500ms intervals)

## Visual Effect:

The hero section now displays:
"Discover the Soul of |" (cursor blinks)
Then types out "Jharkhand" character by character with a beautiful gradient effect.

## Code Structure:

```tsx
<TypeWriter
  text="Jharkhand"
  speed={150}
  delay={1500}
  className="bg-gradient-to-r from-heritage to-accent bg-clip-text text-transparent"
/>
```

This creates a captivating entrance animation that draws attention to the destination name while maintaining the elegant design of the hero section.
