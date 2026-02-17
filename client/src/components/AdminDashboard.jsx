import { useState, useEffect } from "react";
import { CheckSquare, ArrowLeft, Users, Check, X, Trash2 } from "lucide-react";
import axios from "axios";

const AdminDashboard = (currentUser) => {
  const [users, setUsers] = useState([]);
  console.log(currentUser, "currentUser in AdminDashboard");
  const [selectedUser, setSelectedUser] = useState(null);
  // const [userTasks, setUserTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [DeleteLoading, setDeleteLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios
        .get(
          "https://backend-assignment-1-e7a1.onrender.com/api/users/admin/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((res) => {
          console.log(res.data);
          const filtered = res.data.filter((u) => u.role !== "admin");
          setUsers(filtered);
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUsers();
    };
    fetchData();
  }, []);

  const handleSelectUser = (profile) => {
    setSelectedUser(profile);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setDeleteLoading(true);
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `https://backend-assignment-1-e7a1.onrender.com/api/users/admin/delete/${selectedUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      await fetchUsers();
      setSelectedUser(null);
      setDeleteLoading(false);
    } catch (error) {
      console.log(error);
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (selectedUser) {
    const completedCount =
      selectedUser.tasks?.filter((t) => t.status === "completed").length || 0;
    return (
      <div>
        <button
          onClick={() => setSelectedUser(null)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Users
        </button>

        <div className="bg-white rounded-xl border border-gray-100 shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-lg font-bold text-purple-500">
              {(selectedUser.name || selectedUser.email)[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedUser.name || "No Name"}
              </h2>
              <p className="text-sm text-gray-500">{selectedUser.email}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Joined {new Date(selectedUser.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={handleDeleteUser}
              disabled={DeleteLoading}
              className="w-full rounded-xl bg-red-500 text-white font-semibold py-3 text-sm shadow-lg hover:opacity-90 active:scale-[0.98] transition-all duration-150 cursor-pointer"
            >
              {DeleteLoading ? (
                "Deleting User..."
              ) : (
                <span>
                  {" "}
                  <Trash2 className="h-4 w-4" /> Delete User{" "}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-800">
            Tasks ({completedCount}/{selectedUser.tasks?.length || 0} completed)
          </h3>
        </div>

        <div className="space-y-3">
          {selectedUser.tasks?.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm">
              No tasks found for this user.
            </div>
          ) : (
            selectedUser.tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white rounded-xl border border-gray-100 shadow-lg px-5 py-4 flex items-center gap-4"
              >
                <div
                  className={`flex-shrink-0 h-5 w-5 rounded-md border-2 flex items-center justify-center ${
                    task.status === "completed"
                      ? "bg-purple-500 border-purple-600"
                      : "border-gray-300 hover:border-purple-500/50 cursor-pointer"
                  }`}
                >
                  {task.status === "completed" && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>
                <span
                  className={`flex-1 text-sm ${
                    task.status === "completed"
                      ? "line-through text-gray-400"
                      : "text-gray-900"
                  }`}
                >
                  {task.name}
                </span>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    task.status === "completed"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {task.status === "completed" ? "Completed" : "Pending"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Users className="h-5 w-5 text-purple-500" />
          <h1 className="text-2xl font-bold text-gray-900">All Users</h1>
        </div>
        <p className="text-sm text-gray-500">{users.length} registered users</p>
      </div>

      <div className="space-y-3">
        {users.map((profile) => (
          <button
            key={profile._id}
            onClick={() => handleSelectUser(profile)}
            className="w-full text-left bg-white rounded-xl border border-gray-100 shadow-lg hover:shadow-xl px-5 py-4 flex items-center gap-4 transition-all duration-200 cursor-pointer"
          >
            <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center text-sm font-bold text-primary">
              {(profile.name || profile.email)[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {profile.name || "No Name"}
              </p>
              <p className="text-xs text-gray-500 truncate">{profile.email}</p>
            </div>
            <span className="text-xs text-gray-500">
              {new Date(profile.createdAt).toLocaleDateString()}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
