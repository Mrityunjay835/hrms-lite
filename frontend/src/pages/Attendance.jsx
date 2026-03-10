import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import api from "../api/client";
import CalendarHeatmap from "react-calendar-heatmap";

export default function Attendance() {

  const queryClient = useQueryClient();

  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const [form, setForm] = useState({
    employee_id: "",
    date: "",
    status: "Present",
  });

  const [selectedEmployee, setSelectedEmployee] = useState("");

  // Load employees
  const { data: employees, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await api.get("/employees");
      return res.data;
    },
  });

  // Attendance records
  const { data: attendance } = useQuery({
    queryKey: ["attendance", selectedEmployee],
    enabled: !!selectedEmployee,
    queryFn: async () => {
      const res = await api.get(`/attendance/${selectedEmployee}`);
      return res.data;
    },
  });

  // Attendance summary
  const { data: summary } = useQuery({
    queryKey: ["attendance-summary", selectedEmployee],
    enabled: !!selectedEmployee,
    queryFn: async () => {
      const res = await api.get(`/attendance/summary/${selectedEmployee}`);
      return res.data;
    },
  });

  // Heatmap data (must come AFTER attendance query)
  const heatmapData = useMemo(() => {
    if (!attendance) return [];

    return attendance.map((record) => ({
      date: record.date,
      status: record.status,
    }));
  }, [attendance]);

  // Mark attendance
  const markAttendance = useMutation({
    mutationFn: async (data) => {
      return api.post("/attendance", data);
    },

    onSuccess: () => {
      setType("success");
      setMessage("Attendance marked successfully ✅");

      queryClient.invalidateQueries(["attendance"]);

      setTimeout(() => {
        setMessage("");
      }, 4000);
    },

    onError: (error) => {
      setType("error");
      setMessage(error.response?.data?.detail || "Error marking attendance");

      setTimeout(() => {
        setMessage("");
      }, 4000);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    markAttendance.mutate(form);
  };

  if (isLoading) return <p>Loading employees...</p>;

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">Attendance</h1>

      {message && (
        <div
          className={`mb-4 p-3 rounded text-white ${
            type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {message}
        </div>
      )}

      {/* Mark Attendance */}
      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 mb-6">

        <select
          className="border p-2"
          value={form.employee_id}
          onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
        >
          <option value="">Select Employee</option>

          {employees?.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.full_name}
            </option>
          ))}

        </select>

        <input
          type="date"
          className="border p-2"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <select
          className="border p-2"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>

        <button className="bg-blue-500 text-white p-2 col-span-3">
          Submit Attendance
        </button>

      </form>

      {/* Select Employee */}
      <div className="mb-4">

        <select
          className="border p-2"
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        >

          <option value="">View Attendance By Employee</option>

          {employees?.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.full_name}
            </option>
          ))}

        </select>

      </div>

      {/* Total Present Days */}
      {summary && (
        <div className="mb-4 bg-green-200 p-3 rounded">
          Total Present Days: {summary.total_present_days}
        </div>
      )}

      {/* Heatmap */}
      {heatmapData.length > 0 && (
        <div className="mt-10">

          <h2 className="text-xl font-bold mb-4">
            Attendance Calendar
          </h2>

          <CalendarHeatmap
            startDate={new Date("2026-01-01")}
            endDate={new Date("2026-12-31")}
            values={heatmapData}

            classForValue={(value) => {
              if (!value) return "color-empty";

              if (value.status === "Present") return "color-present";

              if (value.status === "Absent") return "color-absent";

              return "color-empty";
            }}
          />

        </div>
      )}

      {/* Attendance Table */}
      {attendance && (
        <table className="border w-full mt-6">

          <thead className="bg-gray-200">
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {attendance.map((record) => (
              <tr key={record.id} className="text-center border">
                <td>{record.id}</td>
                <td>{record.date}</td>
                <td>{record.status}</td>
              </tr>
            ))}
          </tbody>

        </table>
      )}

    </div>
  );
}