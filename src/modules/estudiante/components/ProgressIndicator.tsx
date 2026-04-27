export function ProgressIndicator({ questionIndex, totalQuestions, progressPct }: { questionIndex: number, totalQuestions: number, progressPct: number }) {
  if (questionIndex < 0) return null;
  return (
    <div className="mb-5">
      <div className="h-1 bg-gray-200 rounded-full overflow-hidden mb-1.5">
        <div
          className="h-full bg-[#a10500] rounded-full transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <p className="text-center text-[11px] text-gray-400">
        Sección {questionIndex + 1} de {totalQuestions}
      </p>
    </div>
  );
}
