# The Key Master: Science Sorter - V1 Game Design

## Purpose

Build a browser-based educational game for a Grade 6 learner preparing for Cambridge Primary Science Checkpoint. The game combines fast arcade sorting with evidence-based reasoning so the learner practices classification, observation, yes/no keys, scientific vocabulary, and short explanation patterns.

The first version focuses on Cambridge Primary Science Stage 6-style content for rocks, the rock cycle, reversible changes, irreversible changes, and evidence for chemical reactions. The game should feel like a fast laboratory sorting shift, but every scored decision must connect to scientific evidence.

## Design Pillars

1. Fast sorting keeps the child engaged through visible objects, conveyor timing, streaks, and satisfying feedback.
2. Evidence reasoning prevents shallow memorization by requiring visual clues, hand-lens clues, tests, or cause/effect observations.
3. Checkpoint preparation trains classification keys, reason selection, vocabulary recall, and explanation of observations.
4. Modular content lets new curriculum modules be added with data files instead of engine changes.

## Target Platform

- Runtime: browser game built with React, TypeScript, Vite, and CSS.
- Visual layer: V1 uses 2D UI. Three.js asset support and copied 3D model assets are out of scope for V1.
- Hosting: static build served by nginx. For CentOS 7, build in CI or an Ubuntu host with a modern Node.js runtime, then deploy static assets to the CentOS nginx host.
- Persistence: local browser storage for V1 mastery progress; no backend required.

## Player Experience

The player starts a module, enters a timed Lab Shift, sorts science objects into bins, occasionally opens the Evidence Trial to identify an exact mystery object with a yes/no key, then reviews errors and weak concepts in the Field Notebook.

The game should avoid long instructions. The child should learn by doing, seeing immediate feedback, and reviewing concise explanations after each run.

## Core Loop

```text
Choose module
  -> Start Lab Shift
  -> Object enters conveyor
  -> Observe visual clue
  -> Optionally inspect with hand lens or test tool
  -> Sort into bin
  -> Pick reason token for harder items
  -> Update score, streak, and mastery
  -> Trigger Evidence Trial after a short run segment
  -> Review mistakes in Field Notebook
```

## Screens

### Module Select

Shows available modules and mastery progress.

V1 modules:

- Rocks & Rock Cycle
- Changes to Materials
- Mixed Review, locked until the two base modules are playable

Each module card shows:

- module name
- mastery percentage
- weak concept count
- start button

### Lab Shift

The main arcade screen.

Layout:

```text
+--------------------------------------------------------------------------------+
| Science Sorter                 Rocks Module        Streak 7      Mastery 62%   |
+--------------------------------------------------------------------------------+
| Evidence Tools                                                                  |
| [Eye] Visual Clue     [Lens] Hand Lens     [Flask] Test Result                  |
|                                                                                |
|                         Conveyor Belt                                          |
|              [ Shale ]  --->  --->  --->  --->                                 |
|                                                                                |
| +----------------+   +--------------------+   +--------------------+           |
| | Igneous        |   | Sedimentary        |   | Metamorphic        |           |
| | cooled magma   |   | layers/fossils     |   | heat + pressure    |           |
| +----------------+   +--------------------+   +--------------------+           |
|                                                                                |
| Reason Tokens: [cooled magma] [layers] [fossils] [heat + pressure]             |
+--------------------------------------------------------------------------------+
```

Required interactions:

- Click, tap, or keyboard-select an item into a bin. Drag sorting is an optional enhancement after the base loop is playable.
- Tap and hold, or click an inspect button, to reveal hand-lens evidence.
- Use the test tool when the item has a testable property.
- Select a reason token for medium and hard items.

### Evidence Trial

A slower boss-style classification challenge. The player identifies a mystery item by navigating a yes/no key and selecting a final reason.

Example:

```text
Mystery Object: pale rock with shiny crystals

Evidence:
- no visible layers
- made when limestone changed
- heat and pressure involved

Q1: Was it formed from cooled magma?       No
Q2: Was it changed by heat or pressure?    Yes
Q3: Did it form from limestone?            Yes

Answer: Marble
Reason: Marble is metamorphic because heat and pressure changed limestone.
```

Evidence Trial variants:

- follow a key to identify an item
- choose the best next yes/no question
- repair a broken key by replacing one bad question

### Field Notebook

The post-run review screen.

It shows:

- incorrect sorts
- missed evidence
- correct classification
- one-line explanation
- unlocked vocabulary cards
- weak concepts recommended for replay

The Field Notebook is the calm checkpoint-prep layer. It should use clear scientific language and avoid game pressure.

## V1 Content

### Rocks & Rock Cycle

Bins:

- Igneous
- Sedimentary
- Metamorphic

Items:

- Granite
- Basalt
- Sandstone
- Shale
- Limestone
- Slate
- Marble
- Gneiss

Core vocabulary:

- geologist
- crystal
- weathering
- erode
- igneous rock
- intrusive igneous rock
- extrusive igneous rock
- fossil
- sedimentary rock
- metamorphic rock
- burial

Misconception pairs:

- shale vs slate
- limestone vs marble
- granite vs basalt
- sandstone vs shale

Hazards:

- heat and pressure: shale -> slate
- heat and pressure: limestone -> marble
- weathering and erosion: rock -> sediment
- burial and compaction: sediment -> sedimentary rock

### Changes to Materials

Bins:

- Reversible Change
- Irreversible Change

Items:

- Melting ice
- Freezing water
- Dissolving sugar
- Evaporating salt water
- Rusting iron nail
- Boiling egg
- Burning match
- Vinegar mixed with bicarbonate of soda

Core vocabulary:

- reversible
- irreversible
- reactants
- products
- solvent
- solute
- melting point
- boiling point

Misconception pairs:

- melting ice vs boiling egg
- dissolving sugar vs vinegar and bicarbonate
- evaporating water vs burning match
- rusting nail vs reversible physical changes

Hazards:

- heat: ice -> water
- cooling: water -> ice
- evaporation: salt water -> salt residue plus water vapour
- reaction: vinegar and bicarbonate -> gas produced

## Data Architecture

Content is module-driven. The game engine reads module data and renders the same Lab Shift, Evidence Trial, Field Notebook, and mastery logic for every module.

### Module Schema

```ts
type ScienceModule = {
  id: string;
  title: string;
  summary: string;
  categories: Category[];
  items: ScienceItem[];
  trials: EvidenceTrial[];
  hazards: Hazard[];
  glossary: GlossaryTerm[];
};
```

### Category Schema

```ts
type Category = {
  id: string;
  label: string;
  shortRule: string;
  color: string;
};
```

Example:

```json
{
  "id": "metamorphic",
  "label": "Metamorphic",
  "shortRule": "changed by heat or pressure",
  "color": "#a16207"
}
```

### Science Item Schema

```ts
type ScienceItem = {
  id: string;
  name: string;
  categoryId: string;
  visualClues: string[];
  handLensClues: string[];
  testClues: TestClue[];
  reasonTokens: string[];
  correctReason: string;
  explanation: string;
  commonMistakes: string[];
  objectiveIds: string[];
  difficulty: 1 | 2 | 3;
};
```

Example:

```json
{
  "id": "marble",
  "name": "Marble",
  "categoryId": "metamorphic",
  "visualClues": ["pale rock", "shiny crystals", "no visible layers"],
  "handLensClues": ["formed when limestone changed"],
  "testClues": [],
  "reasonTokens": ["cooled magma", "layers and fossils", "heat and pressure changed it"],
  "correctReason": "heat and pressure changed it",
  "explanation": "Marble is metamorphic because heat and pressure changed limestone.",
  "commonMistakes": ["limestone"],
  "objectiveIds": ["rocks.metamorphic", "rocks.evidence"],
  "difficulty": 2
}
```

### Test Clue Schema

```ts
type TestClue = {
  toolId: "hand-lens" | "heat" | "cool" | "acid" | "mix" | "observe";
  label: string;
  result: string;
  meaning: string;
};
```

Example:

```json
{
  "toolId": "mix",
  "label": "Mixing test",
  "result": "bubbles appear",
  "meaning": "gas was produced, which is evidence of a chemical reaction"
}
```

### Evidence Trial Schema

```ts
type EvidenceTrial = {
  id: string;
  itemId: string;
  prompt: string;
  visibleEvidence: string[];
  key: KeyNode;
  finalAnswerId: string;
  finalReason: string;
  distractorAnswerIds: string[];
  objectiveIds: string[];
};

type KeyNode = {
  id: string;
  question: string;
  yes: KeyNodeResult;
  no: KeyNodeResult;
};

type KeyNodeResult =
  | { type: "node"; node: KeyNode }
  | { type: "answer"; itemId: string };
```

### Hazard Schema

```ts
type Hazard = {
  id: string;
  label: string;
  triggerItemId: string;
  transformedItemId: string;
  visualEffect: string;
  explanation: string;
};
```

Example:

```json
{
  "id": "shale-to-slate",
  "label": "Heat + Pressure",
  "triggerItemId": "shale",
  "transformedItemId": "slate",
  "visualEffect": "press-and-heat",
  "explanation": "Slate forms when shale is changed by heat and pressure."
}
```

### Glossary Term Schema

```ts
type GlossaryTerm = {
  id: string;
  term: string;
  definition: string;
  moduleId: string;
  objectiveIds: string[];
};
```

### Mastery Schema

```ts
type MasteryState = {
  moduleId: string;
  objectiveStats: Record<
    string,
    {
      attempts: number;
      correct: number;
      lastSeenAt: string;
      confidence: "weak" | "building" | "strong";
    }
  >;
  unlockedGlossaryIds: string[];
};
```

## Progression

### Levels 1-3: Single Concept

- Slow belt.
- Few bins.
- No hazards.
- Reason token only after every third item.
- Example: intrusive vs extrusive igneous rocks.

### Levels 4-6: Multi-Category Sorting

- Full category set for one module.
- Medium belt speed.
- Hand-lens clues matter.
- Reason token required for difficult items.
- Evidence Trial appears after 8 successful sort attempts.

### Levels 7-9: Transformations

- Hazards appear on the conveyor.
- Player must adapt to changed evidence.
- Field Notebook emphasizes before/after reasoning.
- Example: shale becomes slate after heat and pressure.

### Mixed Review

- Unlocked after both V1 modules reach at least building confidence.
- Mixed objects from rocks and materials.
- Bins are grouped by module context to avoid unfair ambiguity.
- Evidence Trial alternates between classification and material-change reasoning.

## Scoring

Per item:

- correct bin: +10
- correct reason token: +5
- no inspection bonus: +3 for easy items only
- appropriate test used: +3 for testable hard items
- wrong bin: 0 and streak reset
- wrong reason after correct bin: +5 only, because classification was right but evidence was weak

Streak:

- 3 correct: small speed increase
- 5 correct: bonus item
- 8 correct: Evidence Trial trigger

Mastery:

- Update objective stats after every item and trial.
- Confidence becomes building after at least 3 attempts with 70% accuracy.
- Confidence becomes strong after at least 5 attempts with 85% accuracy and one correct Evidence Trial tied to that objective.
- Weak objectives are weighted higher in future spawns.

## Feedback Rules

Correct answer:

- play a short success sound
- show the chosen evidence briefly
- keep conveyor moving

Wrong answer:

- pause for no more than 2 seconds
- show the correct bin and one key evidence sentence
- save mistake to Field Notebook

Wrong reason token:

- keep the sort as partially correct
- show a short message explaining better evidence

Evidence Trial feedback:

- show the path through the yes/no key
- identify the first wrong branch if any
- add the concept to Field Notebook

## Art Direction

The game should look like a bright, clean school science lab with a compact industrial sorting line.

Guidelines:

- scientifically readable objects first, decoration second
- distinct visual silhouettes for common misconception pairs
- color-coded tools and bins, but avoid making answers obvious by color alone
- no oversized landing page; the first screen should be the playable module select
- use icons for tools and compact controls
- keep typography large enough for a child, but dense enough for repeated play

## Audio Direction

- rocks: clinks and chute sounds
- liquids: splashes and bubbling
- correct sort: short positive tone
- wrong sort: soft alert, not harsh
- Lab Shift: upbeat light-industrial loop
- Evidence Trial: slower focused loop
- Field Notebook: calm review soundscape

Audio must be optional and mutable.

## V1 Acceptance Criteria

The V1 design is considered ready for implementation when:

- the game can run one Rocks Lab Shift with at least 8 items
- the game can run one Changes to Materials Lab Shift with at least 6 items
- at least 4 Evidence Trials work end-to-end
- each sorted item updates mastery stats
- Field Notebook shows at least the last 5 mistakes with explanations
- module data lives outside rendering components
- all content can be loaded from typed TypeScript data or JSON-compatible module objects
- production build works as static assets

## First Implementation Milestones

1. Create typed content models and V1 module data.
2. Build the Module Select screen and local mastery store.
3. Build the Lab Shift engine with deterministic spawning, sorting, feedback, and scoring.
4. Add Evidence Tools with visual, hand-lens, and test clue states.
5. Add Reason Tokens and partial-credit scoring.
6. Build the Evidence Trial yes/no key engine.
7. Build Field Notebook mistake review and glossary unlocks.
8. Add hazards for two rock transformations and one material reaction.
9. Add responsive layout and keyboard/mouse/touch support.
10. Add build and browser verification checks.

## Out of Scope for V1

- backend accounts
- multiplayer
- teacher dashboard
- AI-generated questions at runtime
- full Stage 6 curriculum coverage
- 3D physics simulation
- native mobile packaging

## Open Product Decisions

The first implementation can proceed with safe defaults:

- use 2D illustrated item cards instead of 3D models
- store progress in localStorage
- make Lab Shift sessions short, around 3-5 minutes
- use click/tap sorting and keyboard sorting for V1; add drag sorting only after the base loop is verified
- unlock Mixed Review only after both base modules have working mastery data

These decisions should be revisited after the first playable prototype is tested by the child.
