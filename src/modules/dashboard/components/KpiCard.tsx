interface KpiCardProps {
  label: string;
  value: string;
  sub: string;
  trend?: "up" | "down";
}

export default function KpiCard({ label, value, sub, trend }: KpiCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <p className="text-[11px] text-gray-400 mb-1 uppercase tracking-wider font-semibold">{label}</p>
      <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
      <p className={`text-[11px] mt-1.5 font-medium ${
        trend === "up" ? "text-red-600" : trend === "down" ? "text-green-600" : "text-gray-500"
      }`}>
        {sub}
      </p>
    </div>
  );
}
