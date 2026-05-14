import { useMemo, useState } from "react";

type Category = {
  id: string;
  label: string;
  rule: string;
};

type ScienceItem = {
  id: string;
  name: string;
  categoryId: string;
  visualClue: string;
  lensClue: string;
  testClue: string;
  reasonTokens: string[];
  correctReason: string;
  explanation: string;
};

type ScienceModule = {
  id: string;
  title: string;
  summary: string;
  categories: Category[];
  items: ScienceItem[];
  trialPrompt: string;
  trialAnswer: string;
};

type Mistake = {
  itemName: string;
  selectedCategory: string;
  correctCategory: string;
  selectedReason: string;
  correctReason: string;
  explanation: string;
};

const modules: ScienceModule[] = [
  {
    id: "rocks",
    title: "Rocks and Rock Cycle",
    summary: "Sort rocks by formation evidence, then explain the clue.",
    categories: [
      { id: "igneous", label: "Igneous", rule: "cooled magma or lava" },
      { id: "sedimentary", label: "Sedimentary", rule: "layers, grains, or fossils" },
      { id: "metamorphic", label: "Metamorphic", rule: "changed by heat and pressure" },
    ],
    items: [
      {
        id: "granite",
        name: "Granite",
        categoryId: "igneous",
        visualClue: "large interlocking crystals",
        lensClue: "no layers or fossils",
        testClue: "formed slowly under the surface",
        reasonTokens: ["cooled magma", "visible layers", "heat and pressure"],
        correctReason: "cooled magma",
        explanation: "Granite is igneous because magma cooled slowly and made large crystals.",
      },
      {
        id: "shale",
        name: "Shale",
        categoryId: "sedimentary",
        visualClue: "thin flat layers",
        lensClue: "tiny grains pressed together",
        testClue: "breaks along bedding planes",
        reasonTokens: ["fossil evidence", "thin layers", "melted rock"],
        correctReason: "thin layers",
        explanation: "Shale is sedimentary because mud particles were compacted into layers.",
      },
      {
        id: "marble",
        name: "Marble",
        categoryId: "metamorphic",
        visualClue: "pale rock with shiny crystals",
        lensClue: "crystals are fused together",
        testClue: "limestone changed by heat and pressure",
        reasonTokens: ["heat and pressure", "fast cooling", "loose sediment"],
        correctReason: "heat and pressure",
        explanation: "Marble is metamorphic because limestone changed under heat and pressure.",
      },
    ],
    trialPrompt: "A pale rock has shiny fused crystals and no layers. Was it changed by heat and pressure?",
    trialAnswer: "Yes. That evidence identifies marble as a metamorphic rock.",
  },
  {
    id: "materials",
    title: "Changes to Materials",
    summary: "Classify changes as reversible or irreversible using observed evidence.",
    categories: [
      { id: "reversible", label: "Reversible Change", rule: "material can be changed back" },
      { id: "irreversible", label: "Irreversible Change", rule: "new material is made" },
    ],
    items: [
      {
        id: "melting-ice",
        name: "Melting Ice",
        categoryId: "reversible",
        visualClue: "solid water becomes liquid water",
        lensClue: "no new substance appears",
        testClue: "cooling can freeze it again",
        reasonTokens: ["can change back", "gas produced", "new solid formed"],
        correctReason: "can change back",
        explanation: "Melting ice is reversible because cooling the water forms ice again.",
      },
      {
        id: "rusting-nail",
        name: "Rusting Nail",
        categoryId: "irreversible",
        visualClue: "orange-brown coating appears",
        lensClue: "surface changes texture",
        testClue: "iron reacts with oxygen and water",
        reasonTokens: ["new material formed", "only shape changed", "can evaporate"],
        correctReason: "new material formed",
        explanation: "Rusting is irreversible because iron oxide forms as a new material.",
      },
      {
        id: "dissolving-sugar",
        name: "Dissolving Sugar",
        categoryId: "reversible",
        visualClue: "sugar disappears in water",
        lensClue: "solution stays clear",
        testClue: "evaporation leaves sugar behind",
        reasonTokens: ["can recover solute", "burning happened", "gas produced"],
        correctReason: "can recover solute",
        explanation: "Dissolving sugar is reversible because evaporation can recover the sugar.",
      },
    ],
    trialPrompt: "A liquid bubbles after vinegar is mixed with bicarbonate of soda. Is that irreversible?",
    trialAnswer: "Yes. Gas production is evidence that a new material was made.",
  },
];

function App() {
  const [moduleId, setModuleId] = useState(modules[0].id);
  const [itemIndex, setItemIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedReason, setSelectedReason] = useState("");
  const [feedback, setFeedback] = useState("Pick a reason token, then sort the object.");
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [trialOpen, setTrialOpen] = useState(false);

  const module = useMemo(
    () => modules.find((entry) => entry.id === moduleId) ?? modules[0],
    [moduleId],
  );
  const currentItem = module.items[itemIndex % module.items.length];
  const correctCategory = module.categories.find((category) => category.id === currentItem.categoryId);
  const mastery = Math.min(100, Math.round((score / 720) * 100));

  function selectModule(nextModuleId: string) {
    setModuleId(nextModuleId);
    setItemIndex(0);
    setScore(0);
    setStreak(0);
    setSelectedReason("");
    setMistakes([]);
    setTrialOpen(false);
    setFeedback("Pick a reason token, then sort the object.");
  }

  function sortInto(category: Category) {
    const reasonMatches = selectedReason === currentItem.correctReason;
    const categoryMatches = category.id === currentItem.categoryId;
    const isCorrect = reasonMatches && categoryMatches;

    if (isCorrect) {
      const nextStreak = streak + 1;
      setScore((value) => value + 100 + nextStreak * 20);
      setStreak(nextStreak);
      setFeedback(`${currentItem.name}: correct. ${currentItem.explanation}`);
    } else {
      setStreak(0);
      setMistakes((records) => [
        {
          itemName: currentItem.name,
          selectedCategory: category.label,
          correctCategory: correctCategory?.label ?? currentItem.categoryId,
          selectedReason: selectedReason || "none selected",
          correctReason: currentItem.correctReason,
          explanation: currentItem.explanation,
        },
        ...records,
      ]);
      setFeedback(`${currentItem.name}: review the evidence before the next sort.`);
    }

    const nextIndex = itemIndex + 1;
    setItemIndex(nextIndex);
    setSelectedReason("");
    setTrialOpen(nextIndex > 0 && nextIndex % module.items.length === 0);
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Cambridge Primary Science practice</p>
          <h1>Kid Science</h1>
        </div>
        <div className="score-strip" aria-label="Session score">
          <span>Score {score}</span>
          <span>Streak {streak}</span>
          <span>Mastery {mastery}%</span>
        </div>
      </header>

      <section className="module-select" aria-label="Module select">
        {modules.map((entry) => (
          <button
            className={`module-card ${entry.id === module.id ? "is-active" : ""}`}
            type="button"
            key={entry.id}
            onClick={() => selectModule(entry.id)}
          >
            <span>{entry.title}</span>
            <small>{entry.summary}</small>
          </button>
        ))}
      </section>

      <section className="lab-layout" aria-label="Lab shift">
        <aside className="tool-panel">
          <h2>Evidence Tools</h2>
          <dl>
            <div>
              <dt>Eye</dt>
              <dd>{currentItem.visualClue}</dd>
            </div>
            <div>
              <dt>Lens</dt>
              <dd>{currentItem.lensClue}</dd>
            </div>
            <div>
              <dt>Test</dt>
              <dd>{currentItem.testClue}</dd>
            </div>
          </dl>
        </aside>

        <section className="conveyor" aria-live="polite">
          <div className="belt">
            <span className="belt-line" aria-hidden="true" />
            <article className="sort-object">
              <span className="object-code">{currentItem.id.slice(0, 2).toUpperCase()}</span>
              <h2>{currentItem.name}</h2>
              <p>{currentItem.visualClue}</p>
            </article>
          </div>

          <div className="reason-bank" aria-label="Reason tokens">
            {currentItem.reasonTokens.map((reason) => (
              <button
                className={selectedReason === reason ? "is-selected" : ""}
                type="button"
                key={reason}
                onClick={() => setSelectedReason(reason)}
              >
                {reason}
              </button>
            ))}
          </div>

          <div className="category-grid" aria-label="Sorting bins">
            {module.categories.map((category) => (
              <button
                className="category-bin"
                type="button"
                key={category.id}
                onClick={() => sortInto(category)}
              >
                <span>{category.label}</span>
                <small>{category.rule}</small>
              </button>
            ))}
          </div>

          <p className="feedback">{feedback}</p>
        </section>

        <aside className="field-notebook">
          <h2>Field Notebook</h2>
          {trialOpen ? (
            <article className="trial-card">
              <h3>Evidence Trial</h3>
              <p>{module.trialPrompt}</p>
              <strong>{module.trialAnswer}</strong>
              <button type="button" onClick={() => setTrialOpen(false)}>
                Continue shift
              </button>
            </article>
          ) : (
            <article className="trial-card">
              <h3>Next Trial</h3>
              <p>Sort every object in this module to unlock the evidence trial.</p>
            </article>
          )}

          <div className="mistake-list">
            <h3>Review Queue</h3>
            {mistakes.length === 0 ? (
              <p>No mistakes yet.</p>
            ) : (
              mistakes.slice(0, 3).map((mistake) => (
                <article key={`${mistake.itemName}-${mistake.selectedCategory}`}>
                  <strong>{mistake.itemName}</strong>
                  <span>
                    {mistake.selectedCategory} to {mistake.correctCategory}
                  </span>
                  <small>
                    Reason: {mistake.correctReason}. {mistake.explanation}
                  </small>
                </article>
              ))
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}

export default App;
