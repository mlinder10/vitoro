import { Attempt, ErrorSignature, Question, StudentProfile } from "./model";
import { NBME_LOGIC_GRAPH } from "./logic_graph";
import { Retriever } from "./retriever";
import { chooseNextSteps } from "./flow";
import { updateMastery } from "./profiling";

export class ReasoningEngine {
  constructor(private retriever: Retriever) {}

  diagnose(q: Question, a: Attempt): { concept: string; errors: ErrorSignature[] } {
    const correct = a.chosenIndex === q.correctIndex;
    const concept = q.tags?.[q.tags.length - 1] ?? "unknown";
    const pattern = q.nbmePattern ?? "generic";
    const errors: ErrorSignature[] = [];
    if (!correct) {
      const trap = NBME_LOGIC_GRAPH[pattern]?.common_traps?.[0];
      errors.push({ stage: "discrimination", trap, confidence: 0.7 });
    }
    return { concept, errors };
  }

  async plan(concept: string, errors: ErrorSignature[], profile: StudentProfile) {
    const docs = await this.retriever.fetch([concept], 3);
    const citations = docs.map(d => d.id);
    return chooseNextSteps(errors, profile, concept, citations);
  }

  async tutorOnce(q: Question, a: Attempt, profile: StudentProfile) {
    const { concept, errors } = this.diagnose(q, a);
    const steps = await this.plan(concept, errors, profile);
    const updatedProfile = updateMastery(profile, concept, errors);
    return { concept, errors, steps, updatedProfile };
  }
}
