# Apply DESIGN.md to the resume site

Use the installed DESIGN.md as the visual specification, adapting its product-gallery language to a personal portfolio.

## Recommended scope

- Apply the system to Home, About, Experience, Education, Projects, Contact, shared navigation, footer, forms, and loading states.
- Use white and #f5f5f7 surfaces, #1d1d1f text, and #0066cc actions; use #2997ff links on dark surfaces.
- Use the system font stack, 17px body text, weight 600 headings, and responsive display sizes.
- Replace decorative gradients, floating blobs, pulsing avatar rings, and UI shadows with flat surfaces and generous spacing.
- Keep the homepage hero centered; alternate white, parchment, and charcoal sections. Keep existing profile and project imagery.
- Use a compact black navigation bar with the existing mobile menu and theme control. Maintain 44px touch targets.
- Use blue pill primary actions, outlined secondary actions, 18px utility cards with subtle borders, and visible keyboard focus.
- Retain dark mode using neutral charcoal surfaces and readable blue links. Preserve validation, error states, reduced motion, and keyboard navigation.

## Implementation boundaries

Reuse the existing components and shared CSS/Tailwind configuration. Update component classes where shared tokens alone cannot express the design. Preserve routes, portfolio copy, data access, admin workflows, and authentication. Shared typography and palette may also affect the admin area; do not redesign its layout.

## Alternatives considered

1. Palette-only refresh: smaller but leaves gradients, shadows, and spacing inconsistent with DESIGN.md.
2. Recommended coherent restyle: shared tokens plus targeted public component changes.
3. Full layout rebuild: unnecessary for applying the supplied design and carries greater regression risk.

## Verification

Run the existing lint/type/build checks where available. Inspect public pages at mobile and desktop widths in both themes; check navigation, project filters, contact fields, focus, and overflow. Report any checks blocked by environment configuration or unavailable services.
