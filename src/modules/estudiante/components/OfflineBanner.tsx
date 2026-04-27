export function OfflineBanner({ offline }: { offline: boolean }) {
  if (!offline) return null;
  return (
    <div className="bg-amber-50 border border-amber-300 rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs text-amber-800 mb-4">
      📵 Sin conexión — tus respuestas están guardadas localmente
    </div>
  );
}
