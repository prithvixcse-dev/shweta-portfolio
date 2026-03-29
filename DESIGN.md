# Design System: The Nocturnal Gold Standard

## 1. Overview & Creative North Star
**Creative North Star: "The Modern Alchemist"**

This design system is built on the philosophy of "Reductive Luxury." We are moving away from the cluttered, "boxed-in" nature of traditional SaaS interfaces. Instead, we treat the screen as a high-end editorial gallery. By utilizing a deep, near-black foundation (`#131313`) punctuated by a singular, radiant gold (`#f2ca50`), we create an environment of extreme focus and quiet confidence.

The "template" look is broken through **intentional asymmetry** and **tonal layering**. We do not use lines to define space; we use light, shadow, and depth. Large, bold headings command attention, while light-weight body text provides a sophisticated, breathable reading experience.

---

## 2. Colors & Surface Philosophy
Our palette is rooted in the interplay between deep charcoal and warm metallics. It is designed to feel expensive and curated.

### The "No-Line" Rule
**Explicit Instruction:** Traditional 1px solid borders for sectioning are strictly prohibited. Boundaries must be defined solely through background color shifts.
*   **The Technique:** Use `surface-container-low` for your primary background and `surface-container` or `surface-container-high` for nested content areas. This creates a "molded" look rather than a "sketched" one.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of frosted glass sheets.
*   **Level 0 (Base):** `surface` (#131313)
*   **Level 1 (Sections):** `surface-container-low` (#1c1b1b)
*   **Level 2 (Cards/Modules):** `surface-container` (#201f1f)
*   **Level 3 (Floating/Popovers):** `surface-container-high` (#2a2a2a)

### The "Glass & Grain" Rule
To achieve the signature high-end look, floating elements (modals, dropdowns, navigation bars) should utilize **Glassmorphism**:
*   **Background:** `surface-container` at 70% opacity.
*   **Backdrop Blur:** 20px to 40px.
*   **Texture:** Apply a subtle noise/grain SVG overlay at 3% opacity to "break" the digital smoothness and add a tactile, film-like quality.

### Signature Gradients
For primary CTAs and hero highlights, avoid flat fills. Use a subtle linear gradient (135°) from `primary` (#f2ca50) to `primary-container` (#d4af37) to mimic the way light hits real gold.

---

## 3. Typography
Our typography is an exercise in contrast: high-impact displays vs. delicate body copy.

*   **Display & Headlines (Manrope):** Bold weights, tight letter-spacing (-0.02em). Use `display-lg` (3.5rem) for hero moments to create an authoritative, "fashion-house" aesthetic.
*   **Body (Inter):** Regular or Light weights (300-400). Use `body-lg` (1rem) for most reading. The light weight against the dark background feels modern and reduces visual noise.
*   **Labels:** Always uppercase with increased letter-spacing (0.05em) using `label-md` or `label-sm`. This provides a functional, technical counterpoint to the editorial headlines.

---

## 4. Elevation & Depth
In this system, depth is "felt," not "seen."

### The Layering Principle
Achieve hierarchy through **Tonal Layering**. Place a `surface-container-lowest` (#0e0e0e) card on top of a `surface-container-low` (#1c1b1b) section. This "recessed" look creates depth without the clutter of shadows.

### Ambient Shadows
When an element must float (e.g., a primary modal):
*   **Shadow:** Large blur (60px+), 5% opacity.
*   **Color Tint:** Instead of pure black, use a tinted shadow based on `on-surface` (#e5e2e1) to mimic the way light wraps around objects in a dark room.

### The "Ghost Border" Fallback
If accessibility requires a border, use the **Ghost Border**:
*   **Token:** `outline-variant` (#4d4635) at 20% opacity. This creates a "whisper" of a line that defines a boundary without breaking the seamless flow.

---

## 5. Components

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary-container`), black text (`on-primary`). Roundedness: `md` (0.375rem).
*   **Secondary:** No fill. "Ghost Border" (20% opacity `outline`). Gold text (`primary`).
*   **Tertiary:** Text only, bold weight, gold. No background.

### Cards
*   **Style:** No borders, no heavy shadows. Use `surface-container-high` for the background.
*   **Spacing:** Use `spacing-8` (2.75rem) for internal padding to ensure the "Heavy Whitespace" directive is met.
*   **Hover State:** Transition background to `surface-bright` and apply a 1px `outline-variant` at 10% opacity.

### Input Fields
*   **Background:** `surface-container-lowest`.
*   **Border:** None, except for a 2px bottom-border in `outline-variant` that transforms to `primary` on focus.
*   **Mood:** Understated and sleek.

### Navigation (The Floating Bar)
*   **Style:** Positioned at the top or bottom with a `full` (9999px) roundedness scale.
*   **Visual:** Glassmorphism (70% opacity) with a backdrop blur. This allows content to scroll "under" the glass, creating a sense of infinite depth.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical layouts. A headline might be left-aligned while the body text is offset to the right grid columns.
*   **Do** embrace "Empty Space." If a section feels crowded, double the spacing value (e.g., move from `12` to `24`).
*   **Do** use the `primary` color sparingly. It is a "lighting fixture," not a paint bucket.

### Don't:
*   **Don't** use dividers or horizontal rules. Use `spacing-16` or `spacing-20` to separate concepts.
*   **Don't** use pure white (#FFFFFF). Always use `on-surface` (#e5e2e1) to maintain the "Nocturnal" mood.
*   **Don't** use standard "drop shadows." If it looks like a default CSS shadow, it is wrong. Use tonal shifts or ambient, wide-spread blurs.
*   **Don't** use high-weight body text. It destroys the "refined" feel. Keep Inter at 300 or 400 weight.