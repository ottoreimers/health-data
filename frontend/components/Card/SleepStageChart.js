import { Card, CardContent } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function SleepStagesChart({ sleep }) {
  const timeToMinutes = (timeString) => {
    if (!timeString) return 0;
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return hours * 60 + minutes + seconds / 60;
  };

  const formatMinutes = (minutes) => {
    if (!minutes && minutes !== 0) return "";
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);

    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const data = [
    {
      name: "Deep",
      minutes: timeToMinutes(sleep.deep_sleep),
    },
    {
      name: "Light",
      minutes: timeToMinutes(sleep.light_sleep),
    },
    {
      name: "REM",
      minutes: timeToMinutes(sleep.rem_sleep),
    },
    {
      name: "Awake",
      minutes: timeToMinutes(sleep.awake),
    },
  ];

  return (
    <Card>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart layout="horizontal" data={data}>
            <YAxis
              type="number"
              tickFormatter={formatMinutes}
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "12px" }}
            />
            <XAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "12px" }}
            />
            <Tooltip
              formatter={(value) => [`${formatMinutes(value)}`, "Duration"]}
              cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
              contentStyle={{
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                padding: "8px 12px",
                fontSize: "12px",
              }}
            />
            <Bar
              dataKey="minutes"
              fill="#a5d86e"
              radius={[4, 4, 4, 4]}
              barSize={26}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
