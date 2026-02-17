import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const UserDashboard = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [completedCount, setCompletedCount] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem("token");

  const fetchMyTasks = async (pageNumber = 1) => {
    try {
      await axios
        .get(
          `https://backend-assignment-1-e7a1.onrender.com/api/tasks/my?page=${pageNumber}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((res) => {
          console.log(res.data);
          setTasks(res.data.tasks);
          setCompletedCount(
            res.data.tasks.filter((t) => t.status === "completed").length,
          );
          setPage(res.data.page);
          setTotalPages(res.data.totalPages);
        });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        await fetchMyTasks();
      };
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchMyTasks(page);
    };
    fetchData();
  }, [page]);

  const addTask = async () => {
    const trimmed = newTask.trim();
    if (!trimmed || !user) return;
    await axios
      .post(
        "https://backend-assignment-1-e7a1.onrender.com/api/tasks",
        { name: trimmed },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => {
        console.log(res.data);
        setTasks([res.data, ...tasks]);
        toast.success("Task added successfully");
        setNewTask("");
      });
  };

  const deleteTask = async (id) => {
    await axios
      .delete(
        `https://backend-assignment-1-e7a1.onrender.com/api/tasks/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then(() => {
        setTasks(tasks.filter((t) => t._id !== id));
        toast.success("Task deleted successfully");
      });
  };

  const toggleComplete = async (id) => {
    const task = tasks.find((t) => t._id === id);
    if (!task) return;
    await axios
      .put(
        `https://backend-assignment-1-e7a1.onrender.com/api/tasks/${id}`,
        { status: task?.status === "pending" ? "completed" : "pending" },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => {
        console.log(res.data);
        setTasks(
          tasks.map((t) =>
            t._id === id ? { ...t, status: res.data.status } : t,
          ),
        );
        if (res.data.status === "completed") {
          toast("Task completed! Great job!", { icon: "🎉" });
        }
      });
    setCompletedCount(tasks.filter((t) => t.status === "completed").length);
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setEditText(task.name);
  };

  const saveEdit = async (id) => {
    const trimmed = editText.trim();
    if (!trimmed) return;
    await axios
      .put(
        `https://backend-assignment-1-e7a1.onrender.com/api/tasks/${id}`,
        { name: trimmed },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => {
        console.log(res.data);
        setTasks(
          tasks.map((t) => (t._id === id ? { ...t, name: trimmed } : t)),
        );
        setEditingId(null);
        toast.success("Task updated successfully");
      });
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Your Tasks</h1>
        <p className="text-sm text-gray-600 mt-1">
          {completedCount} of {tasks?.length} completed
        </p>
      </div>

      <div className="flex gap-3 mb-8">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg transition-all"
          placeholder="Add a new task..."
        />
        <button
          onClick={addTask}
          className="rounded-xl bg-purple-500 text-white px-5 py-3 text-sm font-semibold shadow-xl hover:opacity-90 active:scale-[0.97] transition-all duration-150 flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>

      <div className="space-y-3">
        {tasks?.length === 0 && (
          <div className="text-center py-16 text-gray-600 text-sm">
            No tasks yet. Add one above to get started!
          </div>
        )}
        {tasks?.map((task) => (
          <div
            key={task._id}
            className="group bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl px-5 py-4 flex items-center gap-4 transition-all duration-200"
          >
            <button
              onClick={() => toggleComplete(task._id)}
              className={`flex-shrink-0 h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all duration-150 cursor-pointer ${
                task.status === "completed"
                  ? "bg-purple-500 border-purple-600"
                  : "border-gray-300 hover:border-purple-500/50"
              }`}
            >
              {task.status === "completed" && (
                <Check className="h-3 w-3 text-white" />
              )}
            </button>

            {editingId === task._id ? (
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit(task._id)}
                  className="flex-1 rounded-lg border border-purple-300 bg-gray-100 px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300 "
                  autoFocus
                />
                <button
                  onClick={() => saveEdit(task._id)}
                  className="text-purple-500 hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <span
                className={`flex-1 text-sm transition-all ${task.status === "completed" ? "line-through text-gray-400" : "text-gray-900"}`}
              >
                {task.name}
              </span>
            )}

            {editingId !== task._id && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <button
                  onClick={() => startEdit(task)}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-purple-500 hover:bg-purple-500/10 transition-all cursor-pointer"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}

        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-6 gap-3">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="rounded-lg border border-purple-600 bg-purple-500 px-4 py-2 text-sm font-medium text-white hover:bg-purple-600 transition-all cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="rounded-lg border border-purple-600 bg-purple-500 px-4 py-2 text-sm font-medium text-white hover:bg-purple-600 transition-all cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
