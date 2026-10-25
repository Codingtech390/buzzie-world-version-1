"use client";

import type {
  ProductDiaryData,
  ProductDiaryEntry,
  ProductDiarySpecification,
} from "@/types/product";

interface ProductDiaryEditorProps {
  value: ProductDiaryData;
  onChange: (value: ProductDiaryData) => void;
  disabled?: boolean;
}

const inputClass =
  "w-full rounded-xl border border-border/70 bg-background px-3.5 py-3 text-sm text-foreground outline-none transition focus:border-[#C391EE] focus:ring-2 focus:ring-[#C391EE]/15 disabled:cursor-not-allowed disabled:opacity-50";

export default function ProductDiaryEditor({
  value,
  onChange,
  disabled = false,
}: ProductDiaryEditorProps) {
  function updateSection<K extends keyof ProductDiaryData>(
    section: K,
    changes: Partial<ProductDiaryData[K]>,
  ) {
    onChange({
      ...value,
      [section]: {
        ...value[section],
        ...changes,
      },
    });
  }

  function updateTextEntry(
    section: "overview" | "keyFeatures" | "benefits",
    index: number,
    changes: Partial<ProductDiaryEntry>,
  ) {
    const entries = value[section].entries.map((entry, i) =>
      i === index ? { ...entry, ...changes } : entry,
    );
    updateSection(section, { entries });
  }

  function addTextEntry(section: "overview" | "keyFeatures" | "benefits") {
    updateSection(section, {
      entries: [...value[section].entries, { title: "", description: "" }],
    });
  }

  function removeTextEntry(section: "overview" | "keyFeatures" | "benefits", index: number) {
    updateSection(section, {
      entries: value[section].entries.filter((_, i) => i !== index),
    });
  }

  function moveTextEntry(
    section: "overview" | "keyFeatures" | "benefits",
    index: number,
    offset: -1 | 1,
  ) {
    const entries = [...value[section].entries];
    const target = index + offset;
    if (target < 0 || target >= entries.length) return;
    [entries[index], entries[target]] = [entries[target], entries[index]];
    updateSection(section, { entries });
  }

  function updateSpecification(index: number, changes: Partial<ProductDiarySpecification>) {
    updateSection("specifications", {
      entries: value.specifications.entries.map((entry, i) =>
        i === index ? { ...entry, ...changes } : entry,
      ),
    });
  }

  function addSpecification() {
    updateSection("specifications", {
      entries: [...value.specifications.entries, { label: "", value: "" }],
    });
  }

  function removeSpecification(index: number) {
    updateSection("specifications", {
      entries: value.specifications.entries.filter((_, i) => i !== index),
    });
  }

  function moveSpecification(index: number, offset: -1 | 1) {
    const entries = [...value.specifications.entries];
    const target = index + offset;
    if (target < 0 || target >= entries.length) return;
    [entries[index], entries[target]] = [entries[target], entries[index]];
    updateSection("specifications", { entries });
  }

  function renderSectionHeader(
    section: "overview" | "keyFeatures" | "specifications" | "benefits",
  ) {
    const data = value[section];

    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
            Eyebrow / small label
          </span>
          <input
            className={inputClass}
            value={data.eyebrow}
            disabled={disabled}
            onChange={(event) => updateSection(section, { eyebrow: event.target.value })}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
            Main heading
          </span>
          <input
            className={inputClass}
            value={data.title}
            disabled={disabled}
            onChange={(event) => updateSection(section, { title: event.target.value })}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
            Introductory text
          </span>
          <textarea
            className={inputClass}
            rows={3}
            value={data.intro}
            disabled={disabled}
            onChange={(event) => updateSection(section, { intro: event.target.value })}
          />
        </label>
      </div>
    );
  }

  function renderTextEntries(section: "overview" | "keyFeatures" | "benefits", entryLabel: string) {
    const entries = value[section].entries;

    return (
      <div className="mt-5 space-y-3">
        {entries.map((entry, index) => (
          <div
            key={`${section}-${index}`}
            className="rounded-2xl border border-border/60 bg-muted/[0.12] p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">
                {entryLabel} {index + 1}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={disabled || index === 0}
                  className="rounded-lg border px-2.5 py-1.5 text-xs disabled:opacity-40"
                  onClick={() => moveTextEntry(section, index, -1)}
                >
                  Move up
                </button>
                <button
                  type="button"
                  disabled={disabled || index === entries.length - 1}
                  className="rounded-lg border px-2.5 py-1.5 text-xs disabled:opacity-40"
                  onClick={() => moveTextEntry(section, index, 1)}
                >
                  Move down
                </button>
                <button
                  type="button"
                  disabled={disabled}
                  className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#C44770] disabled:opacity-40"
                  onClick={() => removeTextEntry(section, index)}
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="grid gap-3">
              <label>
                <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Heading / title
                </span>
                <input
                  className={inputClass}
                  value={entry.title}
                  disabled={disabled}
                  onChange={(event) =>
                    updateTextEntry(section, index, {
                      title: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Description
                </span>
                <textarea
                  className={inputClass}
                  rows={3}
                  value={entry.description}
                  disabled={disabled}
                  onChange={(event) =>
                    updateTextEntry(section, index, {
                      description: event.target.value,
                    })
                  }
                />
              </label>
            </div>
          </div>
        ))}

        <button
          type="button"
          disabled={disabled}
          className="rounded-xl bg-[#C391EE] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#B074E4] disabled:opacity-50"
          onClick={() => addTextEntry(section)}
        >
          + Add {entryLabel}
        </button>
      </div>
    );
  }

  return (
    <section className="rounded-[26px] bg-background/95 p-5 shadow-[0_8px_30px_rgba(20,20,30,0.045)] sm:p-7">
      <div className="mb-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A5BC2]">
          PRODUCT CONTENT
        </span>
        <h2 className="mt-1 font-playpen text-lg font-bold text-foreground">Product Diary</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Edit the Overview, Key Features, Specification, and Benefits content displayed on the
          product page.
        </p>
      </div>

      <div className="space-y-8">
        <section className="rounded-2xl border border-border/60 p-4 sm:p-5">
          <h3 className="mb-4 font-playpen text-base font-semibold">01. Overview</h3>
          {renderSectionHeader("overview")}
          {renderTextEntries("overview", "Content entry")}
        </section>

        <section className="rounded-2xl border border-border/60 p-4 sm:p-5">
          <h3 className="mb-4 font-playpen text-base font-semibold">02. Key Features</h3>
          {renderSectionHeader("keyFeatures")}
          {renderTextEntries("keyFeatures", "Feature")}
        </section>

        <section className="rounded-2xl border border-border/60 p-4 sm:p-5">
          <h3 className="mb-4 font-playpen text-base font-semibold">03. Specification</h3>
          {renderSectionHeader("specifications")}

          <div className="mt-5 space-y-3">
            {value.specifications.entries.map((entry, index) => (
              <div
                key={`spec-${index}`}
                className="grid gap-3 rounded-2xl border border-border/60 bg-muted/[0.12] p-4 sm:grid-cols-[1fr_1.5fr_auto]"
              >
                <label>
                  <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Label
                  </span>
                  <input
                    className={inputClass}
                    value={entry.label}
                    disabled={disabled}
                    onChange={(event) => updateSpecification(index, { label: event.target.value })}
                  />
                </label>

                <label>
                  <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Value
                  </span>
                  <input
                    className={inputClass}
                    value={entry.value}
                    disabled={disabled}
                    onChange={(event) => updateSpecification(index, { value: event.target.value })}
                  />
                </label>

                <div className="flex flex-wrap items-end gap-2">
                  <button
                    type="button"
                    disabled={disabled || index === 0}
                    className="rounded-lg border px-2.5 py-2 text-xs disabled:opacity-40"
                    onClick={() => moveSpecification(index, -1)}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={disabled || index === value.specifications.entries.length - 1}
                    className="rounded-lg border px-2.5 py-2 text-xs disabled:opacity-40"
                    onClick={() => moveSpecification(index, 1)}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    disabled={disabled}
                    className="rounded-lg px-2.5 py-2 text-xs font-semibold text-[#C44770] disabled:opacity-40"
                    onClick={() => removeSpecification(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            disabled={disabled}
            className="mt-4 rounded-xl bg-[#C391EE] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#B074E4] disabled:opacity-50"
            onClick={addSpecification}
          >
            + Add specification
          </button>
        </section>

        <section className="rounded-2xl border border-border/60 p-4 sm:p-5">
          <h3 className="mb-4 font-playpen text-base font-semibold">04. Benefits</h3>
          {renderSectionHeader("benefits")}
          {renderTextEntries("benefits", "Benefit")}
        </section>
      </div>
    </section>
  );
}
