import { useState } from "react";
import { Step, Answers } from "../domain/types";
import { STEPS, QUESTION_STEPS, TOTAL_QUESTIONS } from "../domain/constants";
import { evaluateResources } from "../domain/evaluator";

export function useEstudianteSurvey() {
  const [step, setStep] = useState<Step>("welcome");
  const [consent, setConsent] = useState(false);
  const [answers, setAnswers] = useState<Answers>({});
  const [offline, setOffline] = useState(false);

  const questionIndex = QUESTION_STEPS.indexOf(step);
  const progressPct =
    questionIndex >= 0
      ? ((questionIndex + 1) / TOTAL_QUESTIONS) * 100
      : step === "success"
      ? 100
      : 0;

  const next = () => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  };

  const prev = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  };

  const updateAnswer = (key: keyof Answers, value: string | number) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const recommendedResources = evaluateResources(answers);

  const canProceed = () => {
    switch (step) {
      case "consent":
        return consent;
      case "q1":
        return !!answers.q1;
      case "q2":
        return typeof answers.q2 === "number";
      case "q3":
        return !!answers.q3;
      default:
        return true;
    }
  };

  return {
    step,
    consent,
    answers,
    offline,
    questionIndex,
    progressPct,
    recommendedResources,
    next,
    prev,
    updateAnswer,
    setConsent,
    setOffline,
    canProceed: canProceed(),
  };
}
