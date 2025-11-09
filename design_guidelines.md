# Design Guidelines: مسابقات تحفة

## Design Approach: Reference-Based (Exact Match)
**Primary Reference**: "من سيربح المليون" (Who Wants to Be a Millionaire) - replicate the iconic visual style exactly

**Core Design Philosophy**: Create dramatic, high-stakes quiz atmosphere with theatrical presentation, radial lighting effects, and crystal-clear information hierarchy.

## Typography System
- **Arabic Primary Font**: Cairo or Tajawal (via Google Fonts)
- **Hierarchy**:
  - Site Title: Bold, 3xl-4xl (48-56px)
  - Question Text: Semibold, 2xl-3xl (32-40px), center-aligned
  - Answer Options: Medium, xl-2xl (24-32px)
  - Labels/UI: Regular, base-lg (16-20px)
  - Money/Score Display: Bold, xl-2xl

## Layout & Spacing System
**Tailwind Spacing Units**: 2, 4, 6, 8, 12, 16 (p-4, m-8, gap-6, etc.)

**Key Layouts**:
- Admin Panel: Standard form layout with max-w-4xl container
- Quiz Screen: Full viewport (min-h-screen) with centered content
- Answer Grid: 2x2 grid layout (grid-cols-1 md:grid-cols-2) with gap-4

## Visual Treatment (Millionaire Style)

**Background Effects**:
- Deep gradient backgrounds (dark blue to dark purple/black)
- Radial spotlight effects emanating from center
- Subtle animated particles or light rays (CSS only)

**Answer Button Design** (Critical - Millionaire Signature):
- Diamond/parallelogram shape using clip-path or border styling
- Dark semi-transparent background with bright border
- Inner glow effect on hover
- **Correct Answer**: Bright green glow with pulsing animation
- **Wrong Answer**: Red flash effect then fade to dark
- Letters (أ، ب، ج، د) in circles/diamonds on the left side of each option

**Question Display**:
- Centered in upper third of screen
- Surrounded by subtle glow/halo effect
- Dark semi-transparent backdrop for readability

## Component Library

### 1. Admin Dashboard
- Header with logo "مسابقات تحفة" and navigation
- Contestant cards in grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Add Contestant button (prominent, golden accent)
- Each card shows: name, question count, edit/delete/start quiz actions

### 2. Question Management Form
- Form sections with clear labels in Arabic
- Question textarea (rows-4)
- Four answer input fields with radio buttons for correct answer
- Toggle switches for randomization options (styled as custom switches)
- Question list below form showing all added questions with edit/delete

### 3. Quiz Interface (Main Screen)
**Top Section**:
- Contestant name display (top-left)
- Question counter "السؤال X من Y" (top-right)
- Sound toggle button (audio icon, top-right corner)

**Center Section**:
- Question text in prominent box with dramatic styling
- Answer grid (2x2) below question
- Each answer styled as Millionaire button with option letter

**Progress Indicator**:
- Side panel (optional) or bottom bar showing question progression
- Could display points/levels if implementing scoring

### 4. Result/Feedback Screens
- Full-screen overlay for correct/wrong reveals
- Large checkmark (✓) for correct in green
- Large X (✗) for wrong in red
- Dramatic animation entrance
- Continue/Next button after reveal

## Animations & Interactions

**Timing**: Use carefully - only for dramatic moments
- Answer selection: Subtle highlight pulse
- Correct reveal: 0.5s delay, then green glow spreading animation (1s)
- Wrong reveal: Immediate red flash (0.3s)
- Question transition: Fade out/in (0.4s)
- NO hover animations on answer buttons during locked state

**Sound Integration**:
- Use Web Audio API or HTML5 Audio
- Placeholder comments for sound files:
  ```
  <!-- SOUND: correct-answer.mp3 -->
  <!-- SOUND: wrong-answer.mp3 -->
  <!-- SOUND: question-appear.mp3 -->
  <!-- SOUND: final-answer.mp3 -->
  ```

## RTL & Arabic Considerations
- Set `dir="rtl"` on html element
- All text right-aligned by default
- Form labels positioned to the right
- Icons and buttons respect RTL flow
- Numbers display in Arabic numerals if culturally appropriate

## Screen Flow
1. **Landing**: Contestant list/management
2. **Add/Edit Contestant**: Form to create contestant and add questions
3. **Start Quiz**: Select contestant → Begin quiz sequence
4. **Quiz Active**: Display questions one by one with answer selection
5. **Results**: Show final score/completion screen

## Images
**Not Required** - This design relies entirely on gradients, lighting effects, and CSS styling to recreate the theatrical TV show atmosphere. No hero image needed.

## Key Design Principles
1. **Drama First**: Every interaction should feel significant
2. **Clear Information**: Despite drama, text must be instantly readable
3. **Iconic Recognition**: Users should immediately recognize the Millionaire aesthetic
4. **Smooth Progression**: Seamless flow from admin → quiz → results
5. **Arabic Excellence**: Perfect RTL implementation and typography