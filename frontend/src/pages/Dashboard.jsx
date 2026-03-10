import { useQuery } from "@tanstack/react-query";
import api from "../api/client";
import CalendarHeatmap from "react-calendar-heatmap";
import { useState } from "react";

export default function Dashboard() {

  const [selectedDay, setSelectedDay] = useState(null);

  // Main dashboard stats
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await api.get("/dashboard");
      return res.data;
    }
  });

  // Heatmap data
  const { data: heatmap } = useQuery({
    queryKey: ["dashboard-heatmap"],
    queryFn: async () => {
      const res = await api.get("/dashboard/attendance-heatmap");
      return res.data;
    }
  });

  if (isLoading) return <p>Loading dashboard...</p>;

  if (error) return <p>Failed to load dashboard</p>;

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6">

        <div className="bg-blue-200 p-4 rounded">
          <p>Total Employees</p>
          <h2 className="text-xl">{data?.total_employees ?? 0}</h2>
        </div>

        <div className="bg-green-200 p-4 rounded">
          <p>Present Today</p>
          <h2 className="text-xl">{data?.present_today ?? 0}</h2>
        </div>

        <div className="bg-red-200 p-4 rounded">
          <p>Absent Today</p>
          <h2 className="text-xl">{data?.absent_today ?? 0}</h2>
        </div>

      </div>

      {/* Heatmap Section */}
      {heatmap && (
        <div className="mt-10">

  <h2 className="mt-10 flex justify-center">
    Attendance Activity
  </h2>

  <div className="max-w-4xl mx-auto">

    <CalendarHeatmap
      startDate={new Date(new Date().setMonth(new Date().getMonth() - 6))}
      endDate={new Date()}
      values={heatmap}

      classForValue={(value) => {
        if (!value) return "color-empty";

        if (value.count >= 5) return "color-scale-4";
        if (value.count >= 3) return "color-scale-3";
        if (value.count >= 1) return "color-scale-2";

        return "color-empty";
      }}

      onClick={(value) => {
        if (value) setSelectedDay(value);
      }}
    />

  </div>

</div>
      )}

      {/* Selected Day Info */}
      {selectedDay && (
        <div className="mt-6 p-4 bg-blue-100 rounded">

          <p>
            Date: <b>{selectedDay.date}</b>
          </p>

          <p>
            Present Employees: <b>{selectedDay.count}</b>
          </p>

        </div>
      )}

    </div>
  );
}