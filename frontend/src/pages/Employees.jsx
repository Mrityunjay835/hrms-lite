import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import api from "../api/client";

export default function Employees() {

  const queryClient = useQueryClient();

  const [message, setMessage] = useState("");
const [type, setType] = useState("");
  const [form, setForm] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: ""
  });

  // Fetch employees
  const { data, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await api.get("/employees");
      return res.data;
    }
  });

  // Create employee
const createEmployee = useMutation({
  mutationFn: async (newEmployee) => {
    return api.post("/employees", newEmployee);
  },

  onSuccess: () => {
    setType("success");
    setMessage("Employee added successfully");

    queryClient.invalidateQueries(["employees"]);

    setTimeout(() => setMessage(""), 3000);
  },

  onError: (error) => {
    setType("error");

    setMessage(
      error.response?.data?.detail || "Failed to create employee"
    );

    setTimeout(() => setMessage(""), 3000);
  }
});

  // Delete employee
  const deleteEmployee = useMutation({
    mutationFn: async (id) => {
      return api.delete(`/employees/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
    }
  });

const handleSubmit = (e) => {
  e.preventDefault();

  if (
    !form.employee_id ||
    !form.full_name ||
    !form.email ||
    !form.department
  ) {
    setType("error");
    setMessage("Please fill all fields");

    setTimeout(() => {
      setMessage("");
    }, 3000);

    return;
  }

  createEmployee.mutate(form);

  setForm({
    employee_id: "",
    full_name: "",
    email: "",
    department: ""
  });
};

  if (isLoading) return <p>Loading employees...</p>;

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">Employees</h1>

      {message && (
  <div
    className={`mb-4 p-3 rounded text-white ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    }`}
  >
    {message}
  </div>
)}

      {/* Employee Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-4 gap-4 mb-6"
      >

        <input
          className="border p-2"
          placeholder="Employee ID"
          value={form.employee_id}
          onChange={(e) =>
            setForm({ ...form, employee_id: e.target.value })
          }
        />

        <input
          className="border p-2"
          placeholder="Full Name"
          value={form.full_name}
          onChange={(e) =>
            setForm({ ...form, full_name: e.target.value })
          }
        />

        <input
          className="border p-2"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          className="border p-2"
          placeholder="Department"
          value={form.department}
          onChange={(e) =>
            setForm({ ...form, department: e.target.value })
          }
        />

        <button
          className="bg-blue-500 text-white p-2 col-span-4"
        >
          Add Employee
        </button>

      </form>

      {/* Employee Table */}
      <table className="border w-full">

        <thead className="bg-gray-200">
          <tr>
            <th>ID</th>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((emp) => (
            <tr key={emp.id} className="border text-center">

              <td>{emp.id}</td>
              <td>{emp.employee_id}</td>
              <td>{emp.full_name}</td>
              <td>{emp.email}</td>
              <td>{emp.department}</td>

              <td>
                <button
                  className="bg-red-500 text-white px-3 py-1"
                  onClick={() => deleteEmployee.mutate(emp.id)}
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}