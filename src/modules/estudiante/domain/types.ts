export type Step = "welcome" | "consent" | "q1" | "q2" | "q3" | "q4" | "success";

export type ResourceItem = {
  icon: string;
  text: string;
};

export type ResourceCategory = "economico" | "academico" | "emocional" | "default";

export type Answers = {
  q1?: string;
  q2?: number;
  q3?: string;
  q4?: string;
};
