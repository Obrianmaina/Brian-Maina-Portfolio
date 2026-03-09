interface CustomTooltipProps {
    active?: boolean;
    payload?: { value: number | string }[];
    label?: string;
}

export default function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white p-4 border border-gray-100 shadow-xl rounded-xl">
            <p className="text-gray-500 text-sm font-semibold mb-1">{label}</p>
            <p className="text-emerald-600 font-bold text-lg">
                {Number(payload[0].value).toFixed(2)}
            </p>
        </div>
    );
}
