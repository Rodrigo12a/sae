import { Answers, ResourceItem } from "./types";
import { RESOURCES_DB } from "./constants";

export function evaluateResources(answers: Answers): ResourceItem[] {
  if (answers.q1 === "trabajo") return RESOURCES_DB.economico;
  if (typeof answers.q2 === "number" && answers.q2 <= 2) return RESOURCES_DB.academico;
  if (answers.q3 === "mal") return RESOURCES_DB.emocional;
  return RESOURCES_DB.default;
}
