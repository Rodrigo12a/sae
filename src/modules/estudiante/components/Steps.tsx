import { Answers, ResourceItem } from "../domain/types";

export function WelcomeStep({ next, offline, setOffline }: { next: () => void, offline: boolean, setOffline: (val: boolean) => void }) {
  return (
    <div className="text-center">
      <div className="text-5xl mb-4">👋</div>
      <h1 className="text-lg font-medium text-gray-900 mb-2">Hola, Sofía</h1>
      <p className="text-sm text-gray-500 leading-relaxed mb-5">
        Esta encuesta nos ayuda a conocer tu situación para ofrecerte el apoyo adecuado.
        Es completamente confidencial.
      </p>
      <div className="bg-gray-50 rounded-xl px-4 py-2.5 text-xs text-gray-400 mb-6">
        ⏱ Tiempo estimado: 3–5 minutos
      </div>
      <label className="flex items-center justify-center gap-2 text-[11px] text-gray-300 mb-5 cursor-pointer select-none">
        <input type="checkbox" checked={offline} onChange={e => setOffline(e.target.checked)} className="w-3 h-3" />
        Simular modo offline
      </label>
      <button
        onClick={next}
        className="w-full py-3 bg-[#1F4E79] text-white text-sm font-medium rounded-xl hover:bg-[#1a4368] transition-colors"
      >
        Comenzar →
      </button>
    </div>
  );
}

export function ConsentStep({ consent, setConsent, next }: { consent: boolean, setConsent: (c: boolean) => void, next: () => void }) {
  return (
    <div>
      <h2 className="text-base font-medium text-gray-900 mb-3">Aviso de privacidad</h2>
      <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-600 leading-relaxed mb-4">
        <p className="font-medium text-gray-800 mb-1">v1.2 · Abril 2026</p>
        Tus datos se usarán exclusivamente para seguimiento académico personalizado dentro de la institución.
        Puedes retirar tu consentimiento en cualquier momento contactando a tu tutor.
        <br /><br />
        Datos tratados: situación socioeconómica, hábitos académicos y bienestar general. <strong>Nunca</strong> se compartirán con terceros externos.
      </div>
      <button
        onClick={() => setConsent(!consent)}
        className="flex items-center gap-3 w-full text-left mb-5"
      >
        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${consent ? "bg-[#2E75B6] border-[#2E75B6]" : "border-gray-300"}`}>
          {consent && <span className="text-white text-[10px]">✓</span>}
        </div>
        <span className="text-xs text-gray-700">
          Acepto el uso de mis datos para acompañamiento académico personalizado
        </span>
      </button>
      <button
        onClick={next}
        disabled={!consent}
        className={`w-full py-3 text-sm font-medium rounded-xl transition-colors ${consent
          ? "bg-[#1F4E79] text-white hover:bg-[#1a4368]"
          : "bg-gray-100 text-gray-300 cursor-not-allowed"
          }`}
      >
        Acepto y continuar →
      </button>
      <p className="text-center text-[11px] text-gray-300 mt-3">
        No, gracias — al no participar no recibirás seguimiento personalizado.
      </p>
    </div>
  );
}

export function Question1Step({ answers, updateAnswer, next, prev, canProceed }: { answers: Answers, updateAnswer: (key: keyof Answers, v: string) => void, next: () => void, prev: () => void, canProceed: boolean }) {
  const options = [
    { value: "familia", icon: "🏠", label: "Apoyo de mi familia" },
    { value: "trabajo", icon: "💼", label: "Trabajo propio" },
    { value: "beca", icon: "🎓", label: "Beca institucional" },
    { value: "combo", icon: "🤝", label: "Combinación de varios" },
  ];
  return (
    <div>
      <h2 className="text-sm font-medium text-gray-900 mb-4 leading-relaxed">
        ¿Cuál es tu principal fuente de financiamiento para estudiar?
      </h2>
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => updateAnswer("q1", opt.value)}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 mb-2 text-sm text-left transition-all ${answers.q1 === opt.value
            ? "border-[#a10500] bg-red-50 text-slate-900"
            : "border-gray-200 hover:border-[#a10500] text-gray-700"
            }`}
        >
          <span className="text-lg">{opt.icon}</span>
          {opt.label}
        </button>
      ))}
      <div className="flex gap-2 mt-4">
        <button onClick={prev} className="px-5 py-2.5 text-sm border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50">← Anterior</button>
        <button
          onClick={next}
          disabled={!canProceed}
          className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-colors ${canProceed ? "bg-[#a10500] text-white hover:bg-amber-400" : "bg-gray-100 text-gray-300 cursor-not-allowed"}`}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}

export function Question2Step({ answers, updateAnswer, next, prev, canProceed }: { answers: Answers, updateAnswer: (key: keyof Answers, v: number) => void, next: () => void, prev: () => void, canProceed: boolean }) {
  return (
    <div>
      <h2 className="text-sm font-medium text-gray-900 mb-4 leading-relaxed">
        ¿Qué tan satisfecho/a estás con tu desempeño académico este semestre?
      </h2>
      <div className="flex gap-2 mb-1">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            onClick={() => updateAnswer("q2", n)}
            className={`flex-1 h-10 rounded-xl border-2 text-sm font-medium transition-all ${answers.q2 === n
              ? "bg-[#2E75B6] border-[#2E75B6] text-white"
              : "border-gray-200 text-gray-500 hover:border-[#2E75B6]"
              }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 mb-5">
        <span>Muy insatisfecho/a</span><span>Muy satisfecho/a</span>
      </div>
      <div className="flex gap-2">
        <button onClick={prev} className="px-5 py-2.5 text-sm border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50">← Anterior</button>
        <button
          onClick={next}
          disabled={!canProceed}
          className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-colors ${canProceed ? "bg-[#1F4E79] text-white hover:bg-[#1a4368]" : "bg-gray-100 text-gray-300 cursor-not-allowed"}`}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}

export function Question3Step({ answers, updateAnswer, next, prev, canProceed }: { answers: Answers, updateAnswer: (key: keyof Answers, v: string) => void, next: () => void, prev: () => void, canProceed: boolean }) {
  const options = [
    { value: "bien", icon: "😊", label: "Bien, me siento motivado/a" },
    { value: "regular", icon: "😐", label: "Regular, con altibajos" },
    { value: "mal", icon: "😔", label: "Mal, me siento agotado/a o triste" },
    { value: "prefiero", icon: "🤐", label: "Prefiero no responder" },
  ];
  return (
    <div>
      <h2 className="text-sm font-medium text-gray-900 mb-4 leading-relaxed">
        En general, ¿cómo describes tu estado de ánimo en las últimas semanas?
      </h2>
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => updateAnswer("q3", opt.value)}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 mb-2 text-sm text-left transition-all ${answers.q3 === opt.value
            ? "border-[#2E75B6] bg-[#EBF3FA] text-[#1F4E79]"
            : "border-gray-200 hover:border-gray-300 text-gray-700"
            }`}
        >
          <span className="text-lg">{opt.icon}</span>
          {opt.label}
        </button>
      ))}
      <div className="flex gap-2 mt-4">
        <button onClick={prev} className="px-5 py-2.5 text-sm border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50">← Anterior</button>
        <button
          onClick={next}
          disabled={!canProceed}
          className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-colors ${canProceed ? "bg-[#1F4E79] text-white hover:bg-[#1a4368]" : "bg-gray-100 text-gray-300 cursor-not-allowed"}`}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}

export function Question4Step({ answers, updateAnswer, next, prev }: { answers: Answers, updateAnswer: (key: keyof Answers, v: string) => void, next: () => void, prev: () => void }) {
  return (
    <div>
      <h2 className="text-sm font-medium text-gray-900 mb-2 leading-relaxed">
        ¿Hay algo que te gustaría que tu institución supiera para poder apoyarte mejor?
      </h2>
      <p className="text-[11px] text-gray-400 mb-3">Opcional — respuesta confidencial</p>
      <textarea
        value={answers.q4 ?? ""}
        onChange={e => updateAnswer("q4", e.target.value)}
        className="w-full text-sm border-2 border-gray-200 rounded-xl p-3 resize-none focus:outline-none focus:border-[#2E75B6] transition-colors"
        rows={4}
        placeholder="Escribe aquí lo que desees compartir..."
      />
      <div className="flex gap-2 mt-4">
        <button onClick={prev} className="px-5 py-2.5 text-sm border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50">← Anterior</button>
        <button
          onClick={next}
          className="flex-1 py-2.5 text-sm font-medium rounded-xl bg-[#1F4E79] text-white hover:bg-[#1a4368] transition-colors"
        >
          Enviar respuestas →
        </button>
      </div>
    </div>
  );
}

export function SuccessStep({ recommendedResources }: { recommendedResources: ResourceItem[] }) {
  return (
    <div className="text-center">
      <div className="text-5xl mb-4">✅</div>
      <h1 className="text-lg font-medium text-gray-900 mb-2">¡Gracias, Sofía!</h1>
      <p className="text-sm text-gray-500 leading-relaxed mb-5">
        Tus respuestas fueron recibidas correctamente. Tu tutor académico podrá orientarte de manera personalizada.
      </p>
      <div className="bg-[#EBF3FA] border border-[#2E75B6]/20 rounded-xl p-4 text-left mb-4">
        <p className="text-xs font-medium text-[#1F4E79] mb-3">Recursos disponibles para ti:</p>
        <div className="space-y-2">
          {recommendedResources.map((r, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
              <span className="text-base leading-none mt-0.5">{r.icon}</span>
              <span>{r.text}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-[11px] text-gray-300">Puedes cerrar esta ventana</p>
    </div>
  );
}
