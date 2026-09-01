import type { MedEdge, MedNode } from "@/components/three/MedicationNetwork3D";

interface Rule {
  a: string;
  b: string;
  level: "moderate" | "severe";
  note: string;
}

/**
 * Reference-only interaction rules (generic drug names, lower-cased).
 * Informational — never a substitute for a pharmacist's review.
 */
const RULES: Rule[] = [
  { a: "aspirin", b: "warfarin", level: "severe", note: "Combined blood-thinning sharply raises bleeding risk." },
  { a: "aspirin", b: "ibuprofen", level: "moderate", note: "Ibuprofen can blunt aspirin's cardioprotective effect." },
  { a: "warfarin", b: "ibuprofen", level: "severe", note: "NSAID plus anticoagulant: high GI bleeding risk." },
  { a: "lisinopril", b: "ibuprofen", level: "moderate", note: "NSAIDs reduce ACE-inhibitor effect and strain kidneys." },
  { a: "lisinopril", b: "spironolactone", level: "moderate", note: "Both raise potassium — monitor for hyperkalemia." },
  { a: "metformin", b: "prednisone", level: "moderate", note: "Steroids raise blood glucose, opposing metformin." },
  { a: "simvastatin", b: "amlodipine", level: "moderate", note: "Amlodipine raises statin levels — muscle toxicity risk." },
  { a: "simvastatin", b: "clarithromycin", level: "severe", note: "Strong CYP3A4 inhibition can cause rhabdomyolysis." },
  { a: "sertraline", b: "tramadol", level: "severe", note: "Serotonin syndrome risk." },
  { a: "levothyroxine", b: "calcium", level: "moderate", note: "Calcium blocks levothyroxine absorption — separate by 4 hours." },
  { a: "amoxicillin", b: "warfarin", level: "moderate", note: "Antibiotics can potentiate warfarin — check INR." },
];

const norm = (name: string) => name.trim().toLowerCase();

export interface InteractionGraph {
  nodes: MedNode[];
  edges: MedEdge[];
}

export const buildInteractionGraph = (
  meds: { id: string; name: string }[],
): InteractionGraph => {
  const nodes: MedNode[] = meds.map((m) => ({ id: m.id, name: m.name }));
  const edges: MedEdge[] = [];

  for (let i = 0; i < meds.length; i++) {
    for (let j = i + 1; j < meds.length; j++) {
      const x = norm(meds[i].name);
      const y = norm(meds[j].name);
      const rule = RULES.find(
        (r) =>
          (x.includes(r.a) && y.includes(r.b)) || (x.includes(r.b) && y.includes(r.a)),
      );
      if (rule) {
        edges.push({
          source: meds[i].id,
          target: meds[j].id,
          level: rule.level,
          note: rule.note,
        });
      }
    }
  }

  return { nodes, edges };
};
