import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "@/common/axios";

const Operator = () => {
  const [operators, setOperators] = useState([]);
  const [newOperator, setNewOperator] = useState({ username: "", password: "" });
  const [isAddingOperator, setIsAddingOperator] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    fetchOperators();
  }, []);

  const fetchOperators = async () => {
    try {
      const response = await api.get("/operators");
      setOperators(response.data);
    } catch (error) {
      toast.error("Failed to fetch operators");
    }
  };

  const handleAddOperator = async (e) => {
    e.preventDefault();
    try {
      await api.post("/operators", newOperator);
      toast.success("Operator added successfully");
      setIsAddingOperator(false);
      setNewOperator({ username: "", password: "" });
      fetchOperators();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add operator");
    }
  };

  const handleDeleteOperator = async (id) => {
    if (window.confirm("Are you sure you want to delete this operator?")) {
      try {
        await api.get(`/operators/${id}`);
        toast.success("Operator deleted successfully");
        fetchOperators();
      } catch (error) {
        toast.error("Failed to delete operator");
      }
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/operators/${selectedOperator._id}/password`, {
        newPassword
      });
      toast.success("Password changed successfully");
      setIsChangingPassword(false);
      setSelectedOperator(null);
      setNewPassword("");
    } catch (error) {
      toast.error("Failed to change password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-blue-900 text-white p-4 shadow-md gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">Operator Management</h1>
        <button
          onClick={() => setIsAddingOperator(true)}
          className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
        >
          Add New Operator
        </button>
      </div>

      <div className="container mx-auto px-2 sm:px-6 py-4 sm:py-6">
        <div className="bg-white rounded-md shadow-md overflow-hidden">
          <div className="w-full overflow-x-auto">
            <div className="min-w-max">
              <table className="w-full border-collapse border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left font-medium text-gray-600 border-b whitespace-nowrap">
                      Username
                    </th>
                    <th className="py-3 px-4 text-left font-medium text-gray-600 border-b whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {operators.map((operator) => (
                    <tr key={operator._id} className="hover:bg-gray-100">
                      <td className="py-3 px-4 border-b whitespace-nowrap">
                        {operator.username}
                      </td>
                      <td className="py-3 px-4 border-b whitespace-nowrap">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => {
                              setSelectedOperator(operator);
                              setIsChangingPassword(true);
                            }}
                            className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded"
                          >
                            Change Password
                          </button>
                          <button
                            onClick={() => handleDeleteOperator(operator._id)}
                            className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {isAddingOperator && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add New Operator</h2>
              <form onSubmit={handleAddOperator}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    value={newOperator.username}
                    onChange={(e) => setNewOperator({ ...newOperator, username: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={newOperator.password}
                    onChange={(e) => setNewOperator({ ...newOperator, password: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingOperator(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Add Operator
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isChangingPassword && selectedOperator && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Change Password</h2>
              <form onSubmit={handleChangePassword}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setSelectedOperator(null);
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Operator;
