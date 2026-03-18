import { TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CustomTooltip from "./CustomTooltip";
import { ChartDataPoint } from "../types";
import { formatYAxis } from "../utils";

interface RevenueChartProps {
    data: ChartDataPoint[];
    title: string;
    color?: string;
    gradientId: string;
    iconColor?: string;
}

export default function RevenueChart({
    data, title, color = "#10b981", gradientId, iconColor = "text-emerald-500"
}: RevenueChartProps) {
    if (!data.length) return null;

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-80 flex flex-col">
            <h3 className={`text-lg font-bold text-gray-800 mb-6 flex items-center`}>
                <TrendingUp size={20} className={`mr-2 ${iconColor}`} /> {title}
            </h3>
            <div className="flex-1 w-full h-full min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    {/* Increased the bottom margin from 0 to 20 to accommodate the XAxis labels */}
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                        <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} dy={10} />
                        <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke={color}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill={`url(#${gradientId})`}
                            dot={{ r: 4, fill: "#ffffff", stroke: color, strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: color, stroke: "#ffffff", strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}