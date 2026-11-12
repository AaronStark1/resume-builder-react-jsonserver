# rBuild --- Master Design & Implementation Specification

## Editorial Motion Experience · Kolibrie Studio-inspired · Purple/Violet + Tomato Identity

**Target agent:** Claude Opus 5.5\
**Repository:** Existing rBuild Resume Builder repository\
**Reference application:**
https://resume-builder-react-jsonserver.vercel.app/\
**Design reference:** The supplied *Kolibrie Studio: recreation prompt*
(use the attached specification as the source of the visual and motion
direction)

------------------------------------------------------------------------

# 0. Mission and non-negotiable outcome

Transform the existing **rBuild Resume Builder** landing page into a
distinctive, premium, editorial experience inspired by the supplied
Kolibrie Studio reference.

The goal is to capture the reference's art direction and interaction
quality:

-   Oversized, expressive, condensed typography.
-   Contrasting editorial serif typography.
-   Cinematic imagery and layered visual compositions.
-   Floating, tactile UI elements.
-   3D card stacks and scroll-driven storytelling.
-   Cursor-responsive interactions.
-   Pinned sections, parallax, staggered reveals and carefully
    choreographed motion.
-   A confident, playful, highly art-directed visual identity.

However, **this must remain unmistakably rBuild**. Do not build a
fictional creative agency, do not reproduce the Kolibrie content
literally, and do not create a separate standalone HTML page. Translate
the design language into a resume-building product.

The central creative idea:

> **A resume is more than a document. It is the visual representation of
> someone's professional journey. Make the landing page bring that
> journey to life.**

The finished page should feel bespoke and production-ready, not like a
generic SaaS template or an AI-generated collection of unrelated
animations.

## Absolute priorities

1.  Preserve rBuild's existing purple/violet brand identity.
2.  Make bright tomato/orange the signature contrasting accent.
3.  Use complementary colours organically and selectively.
4.  Make the motion and visual storytelling resume-related.
5.  Preserve the existing animated ink-bleed theme transition and theme
    architecture.
6.  Preserve every existing application route and resume workflow.
7.  Make the desktop experience ambitious while designing mobile
    deliberately rather than shrinking desktop.

------------------------------------------------------------------------

# 1. Repository context and technical constraints

The existing application is:

**rBuild --- Resume Builder**

### Frontend

-   React 19
-   Vite 7
-   JavaScript ES modules --- no TypeScript
-   Material UI v7
-   `motion/react`
-   `@fontsource-variable` fonts: Plus Jakarta Sans and Inter
-   Axios and existing service/API modules
-   Existing CSS and component architecture

### Backend

-   `json-server`
-   REST API on port 3000
-   `server/db.json` stores `/resumes` and `/history`

### Existing routes

  ---------------------------------------------------------------------------
  Route                   Page                        Existing purpose
  ----------------------- --------------------------- -----------------------
  `/`                     `LandingPage.jsx`           Landing page

  `/resume`               `ResumeGeneratorPage.jsx`   Resume overview and
                                                      sample preview

  `/form`                 `Form.jsx`, `FormSteps.jsx` Seven-step resume
                                                      builder

  `/history`              `History.jsx`               Saved resumes

  `/resume/:id`           `ResumeView.jsx`            Individual resume view,
                                                      edit and export
  ---------------------------------------------------------------------------

### Existing resume architecture

-   `rbuild/src/components/resume/ResumeTemplate.jsx`
    -   `classic`
    -   `modern`
    -   `minimal`
    -   Six existing accent colours.
-   `rbuild/src/components/resume/ScaledPage.jsx`
    -   Scales the 794px A4 canvas using CSS transforms.
-   `Preview.jsx`
    -   Lazy-loads `html2canvas` and `jspdf` when exporting.
    -   Supports native browser printing.
-   `rbuild/src/utils/normalizeResume.js`
    -   Normalizes old and new resume JSON formats.
-   `rbuild/src/services/`
    -   Existing Axios/API wrappers.

### Existing theme architecture

-   `rbuild/src/context/` contains the existing `ColorModeProvider`.
-   `rbuild/src/theme.js` configures the MUI theme.
-   Theme preference is persisted in localStorage using
    `rbuild_theme_mode`.
-   OS preference is used as a fallback through `prefers-color-scheme`.
-   The app already has an animated **ink-bleed transition** when
    changing light/dark mode.
-   The application chrome adapts to the selected theme.
-   The resume document remains a white A4 page with dark text.

**Do not replace this architecture. Do not create another theme
provider. Do not introduce a third theme.**

### Project conventions

-   Use MUI v7 APIs, for example `<Grid size={{ xs: 12, md: 6 }}>`.
-   Do not use legacy Grid `item`, `xs`, `sm` or `md` props.
-   Keep JavaScript; do not migrate files to TypeScript.
-   Do not change backend or API behaviour for this task.
-   Keep the initial application bundle lean.
-   Avoid unnecessary dependency upgrades.

### Required commands

``` bash
cd rbuild && npm run lint
cd rbuild && npm run build
```

Both must pass. Preserve the existing bundle constraint: no production
chunk should exceed 500 kB.

------------------------------------------------------------------------

# 2. First action: inspect before implementing

Do not immediately start writing the new landing page.

First inspect the repository and establish how the existing application
works.

Inspect at minimum:

-   `LandingPage.jsx` and all of its child components.
-   Existing route definitions.
-   Shared navigation/header components.
-   `ColorModeProvider` and theme context.
-   `theme.js`.
-   Global CSS, typography and breakpoints.
-   Existing animations and `motion/react` usage.
-   Resume template rendering and preview components.
-   Existing image and asset directories.
-   Existing theme toggle and ink-bleed animation implementation.
-   Existing npm dependencies and available GSAP packages/plugins.

Study the supplied Kolibrie Studio specification, especially:

-   The overall three-section composition.
-   Variable-font typography.
-   Character and line reveals.
-   Cursor-following image card.
-   Cursor-responsive font-weight interaction.
-   Pinned 3D card stack.
-   Scroll-triggered parallax.
-   Layered image compositions.
-   SVG underline effects.
-   Momentum-inspired hover interactions.
-   Reduced-motion behaviour.

Do not blindly reproduce every numerical value from the reference.
Understand the technique, then adapt it to rBuild's content, components,
breakpoints and existing architecture.

Before implementation, identify:

1.  Which existing components can be reused.
2.  Which new landing-page components are necessary.
3.  Which animation techniques can be implemented with current
    dependencies.
4.  Whether GSAP and the required plugins are available and
    appropriately licensed.
5.  Which assets can be reused and which need to be sourced.
6.  How the existing theme toggle and ink-bleed animation are
    integrated.

Then implement the redesign.

------------------------------------------------------------------------

# 3. Visual identity and colour system

## 3.1 Preserve the existing purple/violet brand

This is a critical design requirement.

**Do not replace rBuild's current purple and violet hues with Kolibrie's
cream-and-tomato palette.**

Inspect the actual existing theme configuration and extract the exact
current brand values before styling the new page.

Retain the existing: - Primary purple. - Secondary violet. - Brand
gradients, if present and appropriate. - Existing light-mode backgrounds
and surfaces where they remain useful. - Existing dark-mode palette. -
Existing semantic colours.

The exact current brand values should be the source of truth. Do not
guess new hex values and overwrite the existing palette.

## 3.2 Signature accent: bright tomato/orange

Bright tomato/orange must become the distinctive contrasting accent that
gives the purple/violet identity more personality.

Use the Kolibrie reference's tomato-orange visual energy as inspiration.

A suitable direction to explore is: - Bright tomato: approximately
`#EF4A23`. - Vibrant coral-orange: approximately `#FA653D`. - Softer
orange: approximately `#FF895F`. - Warm peach: approximately `#FFB18A`.

These are design directions, not permission to overwrite existing theme
tokens indiscriminately. Check contrast and tune values to the actual
rBuild palette.

Use orange confidently but purposefully for: - Primary CTA buttons. -
Important interactive states. - Selected headline words. - Animated
underlines and SVG strokes. - Resume score indicators. - Achievement and
certification stamps. - Timeline milestones. - Skill-chip highlights. -
Progress indicators. - Small floating UI details. - Scroll-triggered
visual accents.

Purple/violet remains the core identity. Tomato/orange is the signature
personality.

Do not make the entire page orange, and do not make every card use both
colours.

## 3.3 Organic supporting colours

Introduce complementary colours where they improve the composition:

-   Warm cream and off-white.
-   Muted peach.
-   Butter yellow.
-   Soft sage.
-   Dusty pink.
-   Lavender and pale violet.

Use them selectively for: - Floating resume cards. - Achievement
badges. - Editorial backgrounds. - Decorative shapes. - Timeline and
skill elements. - Image frames. - Section-specific visual treatments.

The page should feel like a deliberately art-directed colour system, not
a rainbow palette.

## 3.4 Colour hierarchy

Use this hierarchy consistently:

1.  **Purple/violet:** dominant brand identity.
2.  **Tomato/orange:** bold signature accent and important interactions.
3.  **Warm neutrals:** breathing room and editorial backgrounds.
4.  **Sage, butter, peach and pink:** selective supporting accents.

Dark mode must use the existing dark palette and preserve sufficient
contrast. Do not simply invert the light-mode colours.

------------------------------------------------------------------------

# 4. Typography and overall design language

The Kolibrie reference's typographic contrast is one of its strongest
characteristics. Recreate that quality.

## Primary display typography

Explore **Archivo Variable** for: - Large headlines. - Uppercase section
titles. - Navigation labels. - Resume-card titles. - Eyebrows and small
labels.

Use its variable axes where available: - Heavy headline weight around
700. - Condensed width around 72. - Tight line-height. - Negative letter
spacing.

## Contrasting editorial serif

Explore **Playfair Variable** for: - Alternate headline words. -
Editorial eyebrows. - Supporting statements. - Selected links. - Large
italic phrases.

Use lighter weights and elegant proportions to contrast the heavy
condensed type.

## Existing UI typography

Retain Plus Jakarta Sans and Inter for: - Functional controls. -
Form-like UI. - Resume preview interface details. - Supporting labels
where appropriate.

Do not introduce unnecessary fonts. If Archivo and Playfair are added,
load only the required variable font assets and subsets. Prefer locally
managed font packages/assets over fragile external runtime dependencies.

## Typography treatments

Use: - Oversized uppercase display headlines. - Dramatic sans/serif
contrast. - Tight line-height. - Expressive letter spacing. -
Intentional line breaks. - Editorial eyebrow labels. - Subtle text
reveal masks. - Variable-font interactions where supported.

Avoid applying oversized display typography to every component.
Establish a clear hierarchy.

------------------------------------------------------------------------

# 5. Page architecture: three connected sections

The landing page should tell one coherent story through three major
sections:

1.  **Hero --- Your Story. Your Next Move.**
2.  **Featured Templates --- Designed to Stand Out.**
3.  **Resume Journey --- From Blank to Brilliant.**

Each section should feel visually distinct but belong to the same design
system.

Do not add unrelated sections just to make the page longer. Preserve
useful existing content only where it supports this composition.

------------------------------------------------------------------------

# 6. Section One --- Hero: "Your Story. Your Next Move."

Create an immersive, full-screen editorial hero.

## 6.1 Composition

Desktop: - Full-viewport hero. - Strong typographic focal point. -
Purple/violet brand atmosphere. - Carefully selected cinematic image or
video. - Layered resume-related UI cards. - Minimal fixed navigation. -
A clear primary CTA.

The hero should have visual depth without becoming cluttered.

## 6.2 Imagery

Use suitable, high-quality imagery that supports the idea of
professional identity, creativity and career progression.

Possible visual directions: - A creative professional working at a
desk. - A close-up of a beautifully typeset printed document. - A
designer or developer in a warm, cinematic workspace. - A professional
environment with expressive natural light. - Abstract editorial imagery
that can sit behind document UI elements.

Avoid: - Generic corporate handshake photos. - Generic stock-photo
business teams. - Images with illegible AI-generated text. - Fake brand
logos. - Excessive decorative gradients.

Use actual resume previews and UI components for anything that should
contain readable document content.

## 6.3 Navigation

Create a minimal fixed navigation inspired by Kolibrie.

-   Left: rBuild wordmark with an expressive typographic treatment.
-   Centre: a restrained navigation pill or equivalent editorial
    navigation.
-   Links: About, Templates, Features.
-   Right: Get Started action and the existing theme toggle.

Use real application destinations where possible.

The theme toggle must remain functional and preserve the existing
ink-bleed animation.

Do not add inert menu items or fake navigation.

## 6.4 Hero headline

Suggested copy:

**YOUR STORY**\
**YOUR NEXT MOVE**

Use: - Heavy condensed typography for the primary words. - A contrasting
serif treatment for a selected word or phrase. - Character-by-character
reveal. - Carefully controlled line breaks. - Responsive typography that
remains readable on mobile.

Alternative wording can be explored if it improves the composition, but
the message should communicate professional identity and career
progression.

## 6.5 Supporting text and CTA

Suggested supporting copy:

"Everything you've done. Everything you're capable of. Bring your
professional story together."

Primary CTA:

**Build your resume ↗**

Secondary action:

**Explore templates**

The primary CTA should: - Use the bright tomato/orange signature
accent. - Have a distinctive shape and carefully designed hover state. -
Include a small arrow treatment. - Connect to the actual existing resume
creation flow, preferably `/resume` or the appropriate existing route.

The secondary action should navigate to the template showcase.

## 6.6 Cursor-following resume card

This is a major opportunity to make the hero unmistakably rBuild.

Reinterpret Kolibrie's floating cursor image card as a **floating
resume-insight card**.

The card should follow the pointer with smooth trailing movement and
subtle rotation.

Its content should cycle through a curated sequence of resume-related
visual states:

1.  A beautifully typeset A4 resume preview.
2.  A profile/identity section with name and professional title.
3.  An experience timeline.
4.  A skills section with carefully designed chips.
5.  A certification or achievement card.
6.  A resume score/progress card.
7.  A final complete resume preview.

Use real rBuild components where practical. For visual-only cards, use
representative demo content that clearly looks like rBuild.

Behaviour: - Smoothly follow the pointer. - Use subtle rotation based on
pointer velocity. - Apply a slight counter-drift to the inner content. -
Change the displayed visual state after a meaningful amount of pointer
travel. - Hide or reduce visibility when the pointer is over an
interactive link or button. - Fade in on first meaningful pointer
movement. - Reset cleanly on pointer leave. - Do not obstruct the
headline or CTA.

Only enable the interactive cursor behaviour on desktop devices with a
fine pointer.

On touch devices, use a static, art-directed resume-preview card
instead.

Avoid excessive React state updates on every pointer event. Prefer refs
and animation-library utilities for high-frequency pointer movement.

------------------------------------------------------------------------

# 7. Section Two --- Featured Templates: "Designed to Stand Out"

This section should reinterpret Kolibrie's pinned 3D "Latest drops"
stack using rBuild's three actual resume templates.

## 7.1 Layout

Desktop: - Two-column composition. - Left column: editorial copy. -
Right column: large 3D resume-card stage. - A 100vh pinned viewport for
the showcase. - Cards progressively peel away and move forward as the
user scrolls.

The section should feel like a premium design portfolio showcasing three
carefully crafted document designs.

## 7.2 Left-side copy

Eyebrow:

"FIND YOUR FORMAT"

Headline:

**BUILT FOR**\
*YOUR NEXT CHAPTER*

Use heavy condensed typography and a contrasting editorial serif phrase.

Supporting copy:

"Every career has its own shape. Choose a design that brings your
experience, strengths and ambitions together."

Keep the copy concise and visually balanced.

Do not add unnecessary lists or a collection of conventional feature
cards.

## 7.3 Actual resume-template cards

Use the existing three resume templates:

### Card 1 --- CLASSIC

-   Balanced professional layout.
-   Strong hierarchy.
-   Clear sections.
-   Refined, timeless presentation.

### Card 2 --- MODERN

-   Contemporary sidebar layout.
-   Strong visual identity.
-   Carefully balanced information density.

### Card 3 --- MINIMAL

-   Whitespace-focused.
-   Restrained typography.
-   Clean document structure.

Use the actual `ResumeTemplate.jsx` and supporting components where
feasible.

Important: - Do not modify the underlying resume template designs to
achieve the landing-page look. - Do not change A4 dimensions. - Do not
introduce theme-dependent styling into the actual document. - Do not
fabricate screenshots when actual templates can be rendered. - Do not
allow the resume preview to become distorted by perspective or scaling.

For the showcase, it is acceptable to use an isolated miniature preview
or a carefully composed thumbnail of the real template.

Each card should include: - A distinct but coordinated frame colour. - A
realistic A4 preview. - A large editorial title. - Subtle shadows. -
Appropriate perspective and depth. - A small template descriptor if it
improves clarity.

## 7.4 3D stack interaction

Recreate the Kolibrie stack's visual behaviour:

-   Begin with three layered resume cards arranged in 3D depth.
-   As the user scrolls, the front card moves away and fades.
-   The next card advances into the foreground.
-   Each template gets a clear moment of focus.
-   The stack maintains perspective and visual alignment.
-   Add subtle mouse-responsive rotation on desktop.
-   Use a restrained decorative rotating badge if it supports the
    composition.

The scroll interaction should be smooth and controlled.

Avoid: - Cards colliding. - Cards disappearing before their content is
visible. - Excessive rotation. - Scroll-jacking. - Inaccessible content
hidden permanently behind a pinned animation.

Each card should link to the appropriate existing resume
creation/template selection flow where that functionality is available.
Do not invent unsupported routes.

## 7.5 Responsive behaviour

At tablet and mobile breakpoints: - Disable desktop pinning where it
would harm usability. - Convert the stack into a vertical showcase. -
Keep the cards visually layered where practical. - Preserve the resume
previews and title hierarchy. - Avoid horizontal scrolling. - Ensure the
cards do not become too small to recognise as resumes.

------------------------------------------------------------------------

# 8. Section Three --- Resume Journey: "From Blank to Brilliant"

Replace Kolibrie's fictional "Meet the flock" team section with an
immersive visual story about building a resume.

Do not invent a team of employees or present fictional people as rBuild
staff.

The section should communicate how separate parts of a person's
professional story become one polished resume.

## 8.1 Headline and introduction

Suggested headline:

**FROM BLANK**\
*TO BRILLIANT*

Supporting copy:

"Your experience. Your skills. Your achievements. Every part of your
journey deserves to be presented with clarity and confidence."

Keep the heading central and visually dominant.

## 8.2 Visual storytelling elements

Create a layered composition of floating resume-related cards, document
fragments and UI elements.

The visual journey should contain five stages:

### 01 --- YOUR IDENTITY

Show: - Name. - Professional title. - Contact details. - A compact
profile/summary card.

Animation: - Profile details reveal line by line. - A blinking text
cursor can appear briefly. - The profile card settles into the document
composition.

### 02 --- YOUR EXPERIENCE

Show: - Job titles. - Company names. - Employment dates. - Achievement
highlights. - A vertical career timeline.

Animation: - Timeline line draws progressively. - Milestone dots
appear. - Experience cards slide into place. - Achievement phrases
reveal with subtle stagger.

### 03 --- YOUR SKILLS

Show: - Technical skills. - Frameworks and technologies. - Professional
competencies. - Skill chips.

Animation: - Skill chips enter in controlled groups. - Selected chips
receive tomato/orange highlights. - Elements settle into a structured
skills layout.

Do not invent skill-proficiency scores or imply that a skill has been
independently verified.

### 04 --- YOUR ACHIEVEMENTS

Show: - Certifications. - Awards. - Education. - Professional
milestones.

Animation: - Achievement badges appear with a subtle stamped effect. -
Supporting details reveal. - Selected badges use organic complementary
colours. - Avoid fake certification provider logos.

### 05 --- YOUR FINISHED RESUME

Show: - A complete A4 resume preview. - The final document assembled
from its sections. - A small ATS-friendly indicator. - A subtle
PDF/export visual cue.

Animation: - Individual document sections align into one page. - The
complete resume scales into view. - A subtle finishing highlight or
stamp marks completion.

This should feel like a visual transformation from scattered
professional information into a coherent, polished document.

## 8.3 Parallax and layered composition

Recreate the reference's staggered photo composition, but use
resume-related visual assets.

Elements can be positioned on both sides of the central headline: -
Profile cards. - Experience snippets. - Skill-chip clusters. -
Certification cards. - Achievement badges. - Resume page fragments. -
Final document preview.

Use varied: - Widths. - Aspect ratios. - Rotations. - Vertical
offsets. - Parallax speeds. - Z-index layers.

As the user scrolls: - Elements rise at different speeds. - Some cards
pass in front of the heading. - Others sit behind the central
composition. - The final document becomes the visual culmination.

Maintain enough negative space for the central message to remain
legible.

## 8.4 Colour treatment

Use organic colour combinations within this section: - Purple and violet
as the unifying brand. - Tomato/orange for highlights and important
milestones. - Lavender for document surfaces. - Muted peach for selected
cards. - Sage for secondary skill or experience elements. - Butter
yellow for achievement details. - Warm neutral backgrounds where needed.

Do not give every floating object a different bright colour.

------------------------------------------------------------------------

# 9. Resume-specific microinteractions

The page should contain a few memorable interactions that reinforce the
product rather than generic agency-style motion.

Consider the following:

1.  **Typing cursor:** A cursor briefly types or reveals a professional
    title.
2.  **Document assembly:** Resume sections align into a completed A4
    page.
3.  **Experience timeline:** A line draws as milestones appear.
4.  **Skill chips:** Chips enter and settle into a skills section.
5.  **Achievement stamp:** A certification or award badge appears with a
    tactile stamped effect.
6.  **Resume score:** A score counter animates to a representative
    demonstration value.
7.  **Export moment:** A finished document receives a subtle PDF/export
    visual treatment.
8.  **Page stack:** A few miniature resume pages shift in depth.
9.  **Hand-drawn underline:** Selected editorial links receive a
    tomato/orange SVG underline.
10. **Arrow motion:** Small arrow icons animate on hover.

Use these as a coherent visual language. Do not implement all of them
merely for quantity. Prioritise the interactions that improve the
narrative and visual quality.

Any demo scores or sample information must be clearly illustrative, not
represented as live user data.

------------------------------------------------------------------------

# 10. Motion system and technical implementation

The supplied Kolibrie reference uses GSAP extensively. Recreate its
motion language as closely as practical.

## 10.1 Libraries

Inspect the current project dependencies before adding anything.

Prefer: - GSAP 3 for complex timelines. - ScrollTrigger for pinned
sections and scroll-driven interactions. - Existing `motion/react` for
suitable component-level transitions. - CSS transforms and keyframes for
lightweight ambient effects. - SVG stroke animation for hand-drawn
underlines.

Check availability and licensing for GSAP plugins.

Do not assume SplitText, DrawSVGPlugin or InertiaPlugin are freely
available through public CDNs.

If a premium plugin is unavailable: - Use an appropriate supported
alternative. - Use a lightweight custom implementation where
justified. - Preserve the intended visual behaviour. - Do not introduce
fragile CDN dependencies into the React application.

Do not duplicate animation libraries unnecessarily.

## 10.2 Load/entrance sequence

Build a coordinated entrance sequence of approximately 2--2.5 seconds.

Suggested order:

  Sequence   Behaviour
  ---------- --------------------------------------------------------------
  1          Navigation fades and settles
  2          Hero headline reveals line by line or character by character
  3          Contrasting serif word receives its reveal
  4          Supporting copy rises into view
  5          CTA settles into position
  6          Resume-insight cursor card becomes available
  7          Decorative resume UI details enter with a stagger

Do not hide the entire application indefinitely while waiting for fonts,
images or animation libraries.

If animation initialization fails, all important content must remain
visible.

## 10.3 Text reveal

Use a line/character reveal technique inspired by the reference: -
Overflow-hidden line masks. - Characters or lines move upward into
view. - Approximately 0.8--1 second per reveal group. - Smooth
expo-style easing. - Carefully staggered timing.

Ensure descenders are not clipped.

Do not make the text inaccessible to screen readers. Preserve meaningful
text semantics and avoid duplicating hidden text for assistive
technologies.

## 10.4 Scroll reveal

For below-the-fold sections: - Trigger reveals once when entering the
viewport. - Use staggered group timing. - Prefer opacity and transform
animations. - Avoid expensive layout-changing animations. - Do not make
essential content permanently dependent on successful JavaScript
initialization.

## 10.5 Cursor-responsive typography

Where variable-font support permits, recreate Kolibrie's cursor-weight
interaction.

Behaviour: - Heavy sans-serif characters become thinner near the
pointer. - Light serif characters become heavier. - The effect is based
on distance from the pointer. - Use a smooth interpolation rather than
abrupt changes. - Recalculate character positions on resize and scroll.

Only enable this on fine-pointer desktop devices.

Disable on: - Touch devices. - Coarse pointers. - Reduced-motion
preferences.

If the effect introduces excessive DOM complexity or harms text
rendering, prioritise a smaller polished implementation rather than
forcing it.

## 10.6 Pinned template stack

Use ScrollTrigger or an equivalent scroll-driven implementation.

The three cards should advance through a controlled timeline: - Card 1
exits. - Card 2 moves forward. - Card 3 moves into the foreground.

The badge or decorative element may rotate with scroll progress.

Do not pin the section on small screens.

## 10.7 Parallax

Use scroll-linked transforms for the resume-journey elements.

Different elements should have different speeds to create depth.

Keep parallax restrained and ensure it does not compromise text
readability or document legibility.

## 10.8 Hover and momentum

For fine-pointer devices: - Subtle card tilt. - Smooth
cursor-following. - Small hover lift. - Hand-drawn underlines. -
Animated arrows. - Optional inertia-inspired response.

Do not let hover transforms overwrite required centring transforms.
Combine transforms carefully.

## 10.9 Cleanup

Every animation system must clean up after itself: - GSAP timelines. -
ScrollTriggers. - Pointer listeners. - Resize listeners. - Scroll
listeners. - RequestAnimationFrame loops. - Timers, if any.

React effects must be safe under React Strict Mode and repeated
mount/unmount cycles.

------------------------------------------------------------------------

# 11. Theme architecture and ink-bleed transition

This is a non-negotiable requirement.

The existing ink-bleed transition is a distinctive part of rBuild's
identity. Preserve it.

Retain: - Existing `ColorModeProvider`. - Existing theme context. -
Existing MUI theme architecture. - Existing `rbuild_theme_mode`
localStorage key. - Existing OS preference fallback. - Existing light
and dark palettes. - Existing animated ink-bleed transition. - Existing
theme-toggle behaviour.

Do not: - Replace the ink-bleed effect with a simple fade. - Introduce
another theme provider. - Add a third theme. - Create independent theme
state for the landing page. - Automatically persist a section's visual
appearance as the global theme. - Allow section-based visual transitions
to conflict with the manual theme toggle.

The theme toggle must be integrated into the redesigned navigation.

Test the theme toggle: - At the top of the landing page. - While the
featured-template section is active. - Inside the resume-journey
section. - During active scroll animations. - During rapid consecutive
toggles.

## 11.1 Section-specific dark visual treatment

The Kolibrie reference transitions its team section to a near-black
visual treatment.

For rBuild, a section-specific darker atmosphere may be used if it
enhances the composition.

However: - It must be a visual section treatment only. - It must not
modify `rbuild_theme_mode`. - It must not modify the global theme
provider state. - It must not cause the actual theme toggle to become
inconsistent. - It must work in both global themes.

Prefer styling the section's own background and foreground through
dedicated section tokens rather than changing the entire application's
global theme.

If the result creates confusion between global and section theme states,
omit the automatic section transition.

## 11.2 Resume document isolation

The actual resume document must ALWAYS remain a white A4 page with dark
ink.

This applies to: - All three templates. - All preview sizes. - The
miniature showcase previews. - PDF exports. - `html2canvas`. - Native
browser printing.

The surrounding application may be dark, but the resume itself must not
become dark.

The landing-page animation overlay must never interfere with resume
rendering or export.

------------------------------------------------------------------------

# 12. Responsive design

Responsive behaviour must be deliberately art-directed.

## 12.1 Desktop --- 992px and above

Target visual reference: - 1440 × 900.

Expect: - Full editorial hero. - Large display typography. -
Cursor-following resume card. - Pinned 3D template stack. - Layered
parallax composition. - Rich hover interactions. - Carefully balanced
negative space.

The page should feel immersive without forcing unnecessary scrolling
inside the hero.

## 12.2 Tablet --- 480px to 991px

-   Rebalance columns and section proportions.
-   Reduce display typography as needed.
-   Disable complex cursor-following behaviour.
-   Reduce the number of simultaneous floating elements.
-   Disable desktop pinning if it harms usability.
-   Keep the resume cards recognisable.
-   Preserve the visual hierarchy.

## 12.3 Mobile --- 479px and below

Mobile must be a genuinely designed experience.

Hero: - Compact navigation. - Large but readable headline. - Static
resume-preview card. - Clear CTA. - No cursor-following interaction.

Templates: - Vertical card showcase. - No pinned 3D stack. - Large
enough previews to recognise the template differences.

Resume journey: - Responsive stacked composition. - Smaller floating
details or a grid. - Reduced parallax. - Clear section progression. - No
overlapping text.

General: - No horizontal overflow. - No clipped CTAs. - No content
hidden behind floating elements. - Comfortable touch targets. - Respect
safe areas where relevant.

------------------------------------------------------------------------

# 13. Accessibility and reduced motion

Respect `prefers-reduced-motion: reduce`.

When reduced motion is enabled: - Skip entrance animation sequences. -
Show all text immediately. - Disable cursor-following cards. - Disable
cursor-responsive font-weight effects. - Disable momentum effects. -
Disable ambient floating motion. - Disable parallax. - Disable autoplay
background video. - Disable or simplify pinned transitions. - Prefer
natural document flow.

Keep all content visible and functional.

Use semantic headings and landmarks.

Ensure: - Keyboard-accessible navigation. - Visible focus indicators. -
Accessible names for icon-only controls. - Appropriate image alt text. -
Sufficient contrast in both themes. - Decorative imagery is hidden from
assistive technologies where appropriate. - No interaction requires a
mouse.

------------------------------------------------------------------------

# 14. Assets and visual quality

Asset selection is an important part of this redesign.

Inspect the existing repository for: - Resume screenshots. - Existing
illustrations. - Project imagery. - Icons. - Existing brand assets. -
Any reusable visual material.

Use suitable real imagery for editorial photography and actual rBuild
components for resume/document content.

Avoid: - Generic stock-photo grids. - Random abstract blobs
everywhere. - Unreadable AI-generated document text. - Fake
certification logos. - Fake company logos. - Excessive gradients. -
Repetitive card layouts. - Emoji as substitutes for designed UI. -
Placeholder images in the final result.

For any resume preview that contains text, use actual rendered document
content or carefully authored HTML, not an image with generated
gibberish.

Optimise imagery: - Appropriate dimensions. - Modern formats where
possible. - Lazy loading below the fold. - Explicit dimensions or aspect
ratios. - Avoid layout shifts. - Avoid loading huge assets
unnecessarily.

If an external asset cannot be reliably loaded, provide a graceful
fallback.

------------------------------------------------------------------------

# 15. Implementation boundaries

## Primary scope

Focus on: - `LandingPage.jsx`. - Landing-page-specific components. -
Landing-page styles. - Landing-page animation utilities. - Necessary
shared navigation integration. - Necessary theme integration.

Create reusable components where appropriate. Keep the architecture
maintainable rather than building one enormous component.

Possible component decomposition:

``` text
LandingPage/
  LandingPage.jsx
  components/
    LandingNavigation.jsx
    HeroSection.jsx
    ResumeCursorCard.jsx
    FeaturedTemplatesSection.jsx
    ResumeTemplateStack.jsx
    ResumeJourneySection.jsx
    ResumeJourneyCard.jsx
    EditorialUnderline.jsx
  hooks/
    useLandingAnimations.js
    useCursorResumeCard.js
  styles/
    landing.css
```

This is a suggested structure, not a mandate. Follow existing repository
conventions if they differ.

## Do not unnecessarily redesign

-   Seven-step resume builder.
-   Resume history.
-   Individual resume view/edit page.
-   Backend/API.
-   Existing resume templates.
-   Existing resume export system.
-   Unrelated shared components.

Preserve all existing routes and functionality.

------------------------------------------------------------------------

# 16. Performance and engineering requirements

-   Keep initial bundle size lean.
-   Avoid importing heavyweight libraries into unrelated routes.
-   Lazy-load animation-heavy components where practical.
-   Do not load `html2canvas` or `jspdf` on the landing page.
-   Avoid expensive React state updates on every pointer movement.
-   Avoid unnecessary DOM queries on every animation frame.
-   Use `will-change` selectively, not globally.
-   Avoid excessive simultaneous `filter`, blur and large shadow
    animations.
-   Prefer transform and opacity animations.
-   Avoid layout thrashing.
-   Ensure ScrollTrigger refreshes correctly after fonts and images
    load.
-   Handle viewport resizing and orientation changes.
-   Ensure animation initialization is idempotent.
-   Ensure animations do not break if assets fail.

The landing page must remain fast and usable even if animation libraries
or external assets fail.

If GSAP fails to load or initialize, show all content immediately and
preserve basic functionality.

Never leave the page hidden waiting indefinitely for animation setup.

------------------------------------------------------------------------

# 17. Execution strategy

Work in the following order.

### Phase 1 --- Audit

-   Inspect the repository.
-   Inspect the existing theme and ink-bleed system.
-   Inspect the current landing page.
-   Inspect actual resume template components.
-   Identify existing assets and dependencies.
-   Extract the exact purple/violet theme tokens.

### Phase 2 --- Design foundation

-   Define the landing-page design tokens.
-   Preserve the brand palette.
-   Establish tomato/orange as the signature accent.
-   Add only the necessary font assets.
-   Establish responsive typography and spacing.
-   Define shared animation utilities.

### Phase 3 --- Hero

-   Implement navigation.
-   Implement hero composition.
-   Implement typography.
-   Implement resume cursor card.
-   Implement CTA and hover states.
-   Validate both themes.

### Phase 4 --- Featured templates

-   Reuse actual resume templates.
-   Build the miniature showcase previews.
-   Implement 3D stack.
-   Implement scroll-driven progression.
-   Add responsive fallback.

### Phase 5 --- Resume journey

-   Implement the five-stage visual narrative.
-   Build resume-related cards.
-   Implement timeline and skill interactions.
-   Implement achievement effects.
-   Implement document assembly.
-   Add parallax and scroll reveals.

### Phase 6 --- Integration

-   Verify the existing theme toggle.
-   Verify ink-bleed transitions.
-   Verify section-specific styling.
-   Verify mobile layouts.
-   Verify accessibility and reduced motion.
-   Check all navigation destinations.

### Phase 7 --- Validation

Run:

``` bash
cd rbuild && npm run lint
cd rbuild && npm run build
```

Fix all errors introduced by the implementation.

Do not waste tokens repeatedly inspecting the same files or rerunning
tests that have already passed.

Use sub-agents where genuinely useful: - One for design/reference
analysis. - One for asset discovery. - One for independent
implementation review or responsive QA.

Avoid multiple agents modifying the same files simultaneously.

------------------------------------------------------------------------

# 18. Acceptance criteria

## Desktop --- 1440 × 900

The final result should demonstrate:

-   A bold editorial hero with purple/violet brand identity.
-   Bright tomato/orange accents used confidently.
-   Large condensed and serif typography.
-   A resume-related cursor-following card.
-   A clear, functional resume creation CTA.
-   A pinned 3D showcase of Classic, Modern and Minimal resumes.
-   Scroll-driven card progression.
-   A visually immersive resume-journey section.
-   Floating resume-related UI fragments.
-   Carefully choreographed text and scroll reveals.
-   Smooth, polished interactions.
-   No visual collisions or clipping.

## Theme behaviour

-   Light theme works.
-   Dark theme works.
-   Existing ink-bleed transition works.
-   Theme persistence works.
-   OS preference fallback works.
-   Section styling does not conflict with global theme state.
-   Actual resume paper remains white.

## Mobile

-   Hero is readable and visually complete.
-   Cursor card becomes a static composition.
-   Template cards become a vertical showcase.
-   Resume journey becomes a responsive stacked layout.
-   No horizontal overflow.
-   No inaccessible content.
-   No broken navigation.

## Application integrity

-   `/` works.
-   `/resume` works.
-   `/form` works.
-   `/history` works.
-   `/resume/:id` works.
-   Resume creation remains functional.
-   Resume saving remains functional.
-   Resume editing remains functional.
-   PDF export remains functional.
-   Native browser printing remains functional.
-   No backend changes are introduced.

## Build quality

-   Lint passes with zero errors.
-   Production build succeeds.
-   No chunk exceeds 500 kB.
-   No console errors.
-   No broken assets.
-   No memory leaks from animation cleanup.

------------------------------------------------------------------------

# 19. Final creative direction

The final rBuild landing page should combine three qualities:

**The visual ambition of Kolibrie Studio** - Expressive typography. -
Cinematic imagery. - Scroll-driven storytelling. - Interactive motion. -
Layered composition.

**The identity of rBuild** - Purple and violet as the dominant brand
colours. - Bright tomato/orange as the signature accent. - Organic
supporting colours used selectively. - Existing theme system and
ink-bleed transition preserved.

**The purpose of a resume builder** - Professional identity. -
Experience. - Skills. - Achievements. - Resume templates. - Document
assembly. - A polished, export-ready result.

The user should understand what rBuild does immediately, but the
experience should feel far more memorable than a conventional
resume-builder landing page.

Do not prioritise adding more content over improving the art direction.
Do not prioritise animation quantity over animation quality.

**Make every animation tell part of the resume story. Make every colour
choice reinforce the brand. Make every section feel intentional.**

The finished experience should feel like a premium, experimental digital
product with a strong visual identity --- unmistakably rBuild.
