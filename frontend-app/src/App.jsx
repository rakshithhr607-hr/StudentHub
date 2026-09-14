import { useState, useEffect } from "react";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "./api";

import {
  getSubjects,
  createSubject,
  deleteSubject,
} from "./subjectApi";

import {
  getProfile,
  updateProfile,
} from "./profileApi";

import "./App.css";

function App() {
  const API_URL = import.meta.env.VITE_API_URL;
  // =========================================================
  // SESSION
  // =========================================================

  const savedToken = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  const [page, setPage] = useState(
    savedToken && savedUser ? "dashboard" : "login"
  );

  const [sessionChecking, setSessionChecking] = useState(
    savedToken && savedUser ? true : false
  );

  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // =========================================================
  // PROFILE
  // =========================================================

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    course: "",
    year: "",
  });

  const [profileMessage, setProfileMessage] = useState("");

  // =========================================================
  // LOGIN
  // =========================================================

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [authMessage, setAuthMessage] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // =========================================================
  // REGISTER
  // =========================================================

  const [name, setName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");

  // =========================================================
  // TASK FORM
  // =========================================================

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskSubject, setTaskSubject] = useState("");
  const [taskPriority, setTaskPriority] = useState("Medium");
  const [taskStatus, setTaskStatus] = useState("To Do");
  const [taskDueDate, setTaskDueDate] = useState("");

  // =========================================================
  // SEARCH & FILTER
  // =========================================================

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // =========================================================
  // SUBJECT FORM
  // =========================================================

  const [subjectName, setSubjectName] = useState("");
  const [subjectFaculty, setSubjectFaculty] = useState("");
  const [subjectCode, setSubjectCode] = useState("");

  // =========================================================
  // EDIT TASK
  // =========================================================

  const [editingTask, setEditingTask] = useState(null);

  // =========================================================
  // NAVIGATION HELPER
  // =========================================================

  const navigateTo = (newPage) => {
    setAuthMessage("");
    setProfileMessage("");
    setPage(newPage);
  };

  // =========================================================
  // ACTIVE NAV CLASS
  // =========================================================

  const navClass = (navPage) => {
    return page === navPage ? "active" : "";
  };

  // =========================================================
  // CHECK SAVED SESSION
  // =========================================================

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (!token || !user) {
        setSessionChecking(false);
        return;
      }

      try {
       const response = await fetch(
  `${API_URL}/profile`,
  {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok && data.user) {
          const updatedUser = {
            id: data.user._id,
            name: data.user.name,
            email: data.user.email,
            course: data.user.course,
            year: data.user.year,
          };

          localStorage.setItem(
            "user",
            JSON.stringify(updatedUser)
          );

          setProfile({
            name: data.user.name || "",
            email: data.user.email || "",
            course: data.user.course || "",
            year: data.user.year || "",
          });

          setPage("dashboard");
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          setPage("login");
        }
     } catch (error) {
  console.error("Session check error:", error);

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  setTasks([]);
  setSubjects([]);

  setProfile({
    name: "",
    email: "",
    course: "",
    year: "",
  });

  setPage("login");
} finally {
        setSessionChecking(false);
      }
    };

    checkSession();
  }, []);

  // =========================================================
  // LOAD DATA WHEN PAGE CHANGES
  // =========================================================

  useEffect(() => {
    if (sessionChecking) {
      return;
    }

    if (page === "dashboard" || page === "tasks") {
      loadTasks();
      loadSubjects();
    }

    if (page === "subjects") {
      loadSubjects();
    }

    if (page === "profile") {
      loadProfile();
    }
  }, [page, sessionChecking]);

  // =========================================================
  // LOAD TASKS
  // =========================================================

  const loadTasks = async () => {
    try {
      const data = await getTasks();

      if (data && data.tasks) {
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  // =========================================================
  // LOAD SUBJECTS
  // =========================================================

  const loadSubjects = async () => {
    try {
      const data = await getSubjects();

      if (data && data.subjects) {
        setSubjects(data.subjects);
      }
    } catch (error) {
      console.error("Error loading subjects:", error);
    }
  };

  // =========================================================
  // LOAD PROFILE
  // =========================================================

  const loadProfile = async () => {
    try {
      const data = await getProfile();

      if (data && data.user) {
        setProfile({
          name: data.user.name || "",
          email: data.user.email || "",
          course: data.user.course || "",
          year: data.user.year || "",
        });

        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.user._id,
            name: data.user.name,
            email: data.user.email,
            course: data.user.course,
            year: data.user.year,
          })
        );
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  // =========================================================
  // UPDATE PROFILE
  // =========================================================

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    setProfileMessage("");

    try {
      const data = await updateProfile({
        name: profile.name.trim(),
        course: profile.course.trim(),
        year: profile.year,
      });

      if (data && data.user) {
        setProfile({
          name: data.user.name || "",
          email: data.user.email || "",
          course: data.user.course || "",
          year: data.user.year || "",
        });

        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.user._id,
            name: data.user.name,
            email: data.user.email,
            course: data.user.course,
            year: data.user.year,
          })
        );

        setProfileMessage(
          "Profile updated successfully! ✅"
        );
      } else {
        setProfileMessage(
          data?.message || "Unable to update profile."
        );
      }
    } catch (error) {
      console.error("Update profile error:", error);

      setProfileMessage(
        "Unable to connect to server."
      );
    }
  };

  // =========================================================
  // LOGIN
  // =========================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setAuthMessage("");
    setAuthLoading(true);

    try {
      const response = await fetch(
  `${API_URL}/auth/login`,
  {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: loginEmail.trim(),
            password: loginPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        setLoginEmail("");
        setLoginPassword("");
        setAuthMessage("");

        setProfile({
          name: data.user.name || "",
          email: data.user.email || "",
          course: data.user.course || "",
          year: data.user.year || "",
        });

        setPage("dashboard");
      } else {
        setAuthMessage(
          data.message || "Invalid email or password."
        );
      }
    } catch (error) {
      console.error("Login error:", error);

      setAuthMessage(
        "Unable to connect to server. Please try again."
      );
    } finally {
      setAuthLoading(false);
    }
  };

  // =========================================================
  // REGISTER
  // =========================================================

  const handleRegister = async (e) => {
    e.preventDefault();

    setAuthMessage("");
    setAuthLoading(true);

    try {
      const response = await fetch(
  `${API_URL}/auth/register`,
  {
    method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: registerEmail.trim(),
            password: registerPassword,
            course: course.trim(),
            year,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setAuthMessage(
          "Registration successful! 🎉 Please login."
        );

        setName("");
        setRegisterEmail("");
        setRegisterPassword("");
        setCourse("");
        setYear("");

        setTimeout(() => {
          setAuthMessage("");
          setPage("login");
        }, 1500);
      } else {
        setAuthMessage(
          data.message || "Unable to create account."
        );
      }
    } catch (error) {
      console.error("Registration error:", error);

      setAuthMessage(
        "Unable to connect to server. Please try again."
      );
    } finally {
      setAuthLoading(false);
    }
  };

  // =========================================================
  // CLEAR TASK FORM
  // =========================================================

  const clearTaskForm = () => {
    setTaskTitle("");
    setTaskDescription("");
    setTaskSubject("");
    setTaskPriority("Medium");
    setTaskStatus("To Do");
    setTaskDueDate("");
  };

  // =========================================================
  // CREATE TASK
  // =========================================================

  const handleCreateTask = async (e) => {
    e.preventDefault();

    try {
      const data = await createTask({
        title: taskTitle.trim(),
        description: taskDescription.trim(),
        subject: taskSubject,
        priority: taskPriority,
        status: taskStatus,
        dueDate: taskDueDate,
      });

      if (data && data.task) {
        alert("Task created successfully! 🎉");

        clearTaskForm();

        await loadTasks();

        setPage("tasks");
      } else {
        alert(
          data?.message || "Unable to create task"
        );
      }
    } catch (error) {
      console.error("Create task error:", error);

      alert("Unable to connect to server.");
    }
  };

  // =========================================================
  // START EDITING TASK
  // =========================================================

  const handleEdit = (task) => {
    setEditingTask(task);

    setTaskTitle(task.title || "");
    setTaskDescription(task.description || "");
    setTaskSubject(task.subject || "");
    setTaskPriority(task.priority || "Medium");
    setTaskStatus(task.status || "To Do");

    setTaskDueDate(
      task.dueDate
        ? new Date(task.dueDate)
            .toISOString()
            .split("T")[0]
        : ""
    );

    setPage("edit-task");
  };

  // =========================================================
  // UPDATE TASK
  // =========================================================

  const handleUpdateTask = async (e) => {
    e.preventDefault();

    if (!editingTask) {
      return;
    }

    try {
      const data = await updateTask(
        editingTask._id,
        {
          title: taskTitle.trim(),
          description: taskDescription.trim(),
          subject: taskSubject,
          priority: taskPriority,
          status: taskStatus,
          dueDate: taskDueDate,
        }
      );

      if (data && data.task) {
        alert("Task updated successfully! ✅");

        clearTaskForm();

        setEditingTask(null);

        await loadTasks();

        setPage("tasks");
      } else {
        alert(
          data?.message || "Unable to update task"
        );
      }
    } catch (error) {
      console.error("Update task error:", error);

      alert("Unable to update task.");
    }
  };

  // =========================================================
  // DELETE TASK
  // =========================================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const data = await deleteTask(id);

      if (
        data &&
        data.message === "Task deleted successfully"
      ) {
        alert("Task deleted successfully! 🗑️");

        await loadTasks();
      } else {
        alert(
          data?.message || "Unable to delete task"
        );
      }
    } catch (error) {
      console.error("Delete task error:", error);

      alert("Unable to delete task.");
    }
  };

  // =========================================================
  // CHANGE TASK STATUS
  // =========================================================

  const handleStatusChange = async (
    task,
    newStatus
  ) => {
    try {
      const data = await updateTask(
        task._id,
        {
          title: task.title,
          description: task.description || "",
          subject: task.subject || "",
          priority: task.priority || "Medium",
          status: newStatus,
          dueDate: task.dueDate,
        }
      );

      if (data && data.task) {
        await loadTasks();
      } else {
        alert(
          data?.message || "Unable to change status"
        );
      }
    } catch (error) {
      console.error("Status update error:", error);

      alert("Unable to change status.");
    }
  };

  // =========================================================
  // CREATE SUBJECT
  // =========================================================

  const handleCreateSubject = async (e) => {
    e.preventDefault();

    try {
      const data = await createSubject({
        name: subjectName.trim(),
        faculty: subjectFaculty.trim(),
        code: subjectCode.trim(),
      });

      if (data && data.subject) {
        alert("Subject added successfully! 📚");

        setSubjectName("");
        setSubjectFaculty("");
        setSubjectCode("");

        await loadSubjects();
      } else {
        alert(
          data?.message || "Unable to add subject"
        );
      }
    } catch (error) {
      console.error("Create subject error:", error);

      alert("Unable to connect to server.");
    }
  };

  // =========================================================
  // DELETE SUBJECT
  // =========================================================

  const handleDeleteSubject = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this subject?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const data = await deleteSubject(id);

      if (
        data &&
        data.message === "Subject deleted successfully"
      ) {
        alert("Subject deleted successfully! 🗑️");

        await loadSubjects();
      } else {
        alert(
          data?.message || "Unable to delete subject"
        );
      }
    } catch (error) {
      console.error("Delete subject error:", error);

      alert("Unable to delete subject.");
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setTasks([]);
    setSubjects([]);

    setSubjectName("");
    setSubjectFaculty("");
    setSubjectCode("");

    setSearchTerm("");
    setStatusFilter("All");
    setPriorityFilter("All");

    setProfile({
      name: "",
      email: "",
      course: "",
      year: "",
    });

    setProfileMessage("");

    setLoginEmail("");
    setLoginPassword("");

    setAuthMessage("");

    setEditingTask(null);

    clearTaskForm();

    setPage("login");
  };

  // =========================================================
  // SESSION CHECKING SCREEN
  // =========================================================

  if (sessionChecking) {
    return (
      <div className="app">
        <main className="login-page">
          <div className="login-card">
            <div className="login-icon">
              🎓
            </div>

            <h1>StudentHub</h1>

            <p className="login-subtitle">
              Checking your session...
            </p>

            <p
              style={{
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              Please wait...
            </p>
          </div>
        </main>
      </div>
    );
  }

  // =========================================================
  // EDIT TASK PAGE
  // =========================================================

  if (page === "edit-task") {
    return (
      <div className="app">
        <nav className="navbar">
          <div
            className="logo"
            onClick={() => navigateTo("dashboard")}
          >
            🎓 StudentHub
          </div>

          <div className="nav-links">
            <span
              className={navClass("dashboard")}
              onClick={() => navigateTo("dashboard")}
            >
              Dashboard
            </span>

            <span
              className={navClass("tasks")}
              onClick={() => navigateTo("tasks")}
            >
              Tasks
            </span>

            <span
              className={navClass("subjects")}
              onClick={() => navigateTo("subjects")}
            >
              Subjects
            </span>

            <span
              className={navClass("profile")}
              onClick={() => navigateTo("profile")}
            >
              Profile
            </span>
          </div>
        </nav>

        <main className="login-page">
          <div className="login-card">
            <div className="login-icon">
              ✏️
            </div>

            <h1>Edit Task</h1>

            <p className="login-subtitle">
              Update your task details
            </p>

            <form onSubmit={handleUpdateTask}>
              <label>Task Title</label>

              <input
                type="text"
                value={taskTitle}
                onChange={(e) =>
                  setTaskTitle(e.target.value)
                }
                required
              />

              <label>Description</label>

              <input
                type="text"
                value={taskDescription}
                onChange={(e) =>
                  setTaskDescription(
                    e.target.value
                  )
                }
              />

              <label>Subject</label>

              <select
                value={taskSubject}
                onChange={(e) =>
                  setTaskSubject(e.target.value)
                }
              >
                <option value="">
                  -- Select Subject --
                </option>

                {taskSubject &&
                  !subjects.some(
                    (subject) =>
                      subject.name === taskSubject
                  ) && (
                    <option value={taskSubject}>
                      {taskSubject}
                    </option>
                  )}

                {subjects.map((subject) => (
                  <option
                    key={subject._id}
                    value={subject.name}
                  >
                    {subject.name}
                  </option>
                ))}
              </select>

              <label>Priority</label>

              <select
                value={taskPriority}
                onChange={(e) =>
                  setTaskPriority(e.target.value)
                }
              >
                <option value="Low">Low</option>
                <option value="Medium">
                  Medium
                </option>
                <option value="High">High</option>
              </select>

              <label>Status</label>

              <select
                value={taskStatus}
                onChange={(e) =>
                  setTaskStatus(e.target.value)
                }
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">
                  In Progress
                </option>
                <option value="Done">Done</option>
              </select>

              <label>Due Date</label>

              <input
                type="date"
                value={taskDueDate}
                onChange={(e) =>
                  setTaskDueDate(e.target.value)
                }
                required
              />

              <button
                className="login-btn"
                type="submit"
              >
                Save Changes
              </button>

              <button
                type="button"
                className="add-task-btn"
                onClick={() => {
                  clearTaskForm();
                  setEditingTask(null);
                  setPage("tasks");
                }}
              >
                ← Cancel
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  // =========================================================
  // ADD TASK PAGE
  // =========================================================

  if (page === "add-task") {
    return (
      <div className="app">
        <nav className="navbar">
          <div
            className="logo"
            onClick={() => navigateTo("dashboard")}
          >
            🎓 StudentHub
          </div>

          <div className="nav-links">
            <span
              className={navClass("dashboard")}
              onClick={() => navigateTo("dashboard")}
            >
              Dashboard
            </span>

            <span
              className={navClass("tasks")}
              onClick={() => navigateTo("tasks")}
            >
              Tasks
            </span>

            <span
              className={navClass("subjects")}
              onClick={() => navigateTo("subjects")}
            >
              Subjects
            </span>

            <span
              className={navClass("profile")}
              onClick={() => navigateTo("profile")}
            >
              Profile
            </span>
          </div>
        </nav>

        <main className="login-page">
          <div className="login-card">
            <div className="login-icon">
              📋
            </div>

            <h1>Add New Task</h1>

            <p className="login-subtitle">
              Create a task and manage your
              academic work
            </p>

            <form onSubmit={handleCreateTask}>
              <label>Task Title</label>

              <input
                type="text"
                placeholder="Enter task title"
                value={taskTitle}
                onChange={(e) =>
                  setTaskTitle(e.target.value)
                }
                required
              />

              <label>Description</label>

              <input
                type="text"
                placeholder="Enter task description"
                value={taskDescription}
                onChange={(e) =>
                  setTaskDescription(
                    e.target.value
                  )
                }
              />

              <label>Subject</label>

              <select
                value={taskSubject}
                onChange={(e) =>
                  setTaskSubject(e.target.value)
                }
              >
                <option value="">
                  -- Select Subject --
                </option>

                {subjects.map((subject) => (
                  <option
                    key={subject._id}
                    value={subject.name}
                  >
                    {subject.name}
                  </option>
                ))}
              </select>

              <label>Priority</label>

              <select
                value={taskPriority}
                onChange={(e) =>
                  setTaskPriority(e.target.value)
                }
              >
                <option value="Low">Low</option>
                <option value="Medium">
                  Medium
                </option>
                <option value="High">High</option>
              </select>

              <label>Status</label>

              <select
                value={taskStatus}
                onChange={(e) =>
                  setTaskStatus(e.target.value)
                }
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">
                  In Progress
                </option>
                <option value="Done">Done</option>
              </select>

              <label>Due Date</label>

              <input
                type="date"
                value={taskDueDate}
                onChange={(e) =>
                  setTaskDueDate(e.target.value)
                }
                required
              />

              <button
                className="login-btn"
                type="submit"
              >
                Create Task
              </button>

              <button
                type="button"
                className="add-task-btn"
                onClick={() => setPage("tasks")}
              >
                ← Back to Tasks
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  // =========================================================
  // SUBJECTS PAGE
  // =========================================================

  if (page === "subjects") {
    return (
      <div className="app">
        <nav className="navbar">
          <div
            className="logo"
            onClick={() => navigateTo("dashboard")}
          >
            🎓 StudentHub
          </div>

          <div className="nav-links">
            <span
              className={navClass("dashboard")}
              onClick={() => navigateTo("dashboard")}
            >
              Dashboard
            </span>

            <span
              className={navClass("tasks")}
              onClick={() => navigateTo("tasks")}
            >
              Tasks
            </span>

            <span
              className={navClass("subjects")}
            >
              Subjects
            </span>

            <span
              className={navClass("profile")}
              onClick={() => navigateTo("profile")}
            >
              Profile
            </span>
          </div>
        </nav>

        <main className="dashboard">
          <div className="dashboard-header">
            <h1>📚 Subjects</h1>

            <p>
              Manage your subjects, faculty and
              subject codes.
            </p>
          </div>

          <div
            className="login-card"
            style={{
              maxWidth: "650px",
              margin: "30px auto",
            }}
          >
            <div className="login-icon">
              📖
            </div>

            <h2>Add New Subject</h2>

            <p className="login-subtitle">
              Add a subject to organize your
              academic tasks.
            </p>

            <form onSubmit={handleCreateSubject}>
              <label>Subject Name</label>

              <input
                type="text"
                placeholder="Example: Mathematics"
                value={subjectName}
                onChange={(e) =>
                  setSubjectName(e.target.value)
                }
                required
              />

              <label>Faculty Name</label>

              <input
                type="text"
                placeholder="Example: Dr. Kumar"
                value={subjectFaculty}
                onChange={(e) =>
                  setSubjectFaculty(
                    e.target.value
                  )
                }
              />

              <label>Subject Code</label>

              <input
                type="text"
                placeholder="Example: BMATS201"
                value={subjectCode}
                onChange={(e) =>
                  setSubjectCode(e.target.value)
                }
              />

              <button
                className="login-btn"
                type="submit"
              >
                + Add Subject
              </button>
            </form>
          </div>

          <div className="task-list">
            <h2>Your Subjects</h2>

            {subjects.length === 0 ? (
              <p className="no-tasks">
                No subjects added yet. Add your
                first subject above.
              </p>
            ) : (
              subjects.map((subject) => (
                <div
                  className="task-card"
                  key={subject._id}
                >
                  <div className="task-info">
                    <h3>
                      📘 {subject.name}
                    </h3>

                    <p>
                      <strong>
                        Faculty:
                      </strong>{" "}
                      {subject.faculty ||
                        "Not specified"}
                    </p>

                    <p>
                      <strong>
                        Code:
                      </strong>{" "}
                      {subject.code ||
                        "Not specified"}
                    </p>

                    <p>
                      <strong>
                        Tasks:
                      </strong>{" "}
                      {subject.totalTasks || 0}
                      {" · "}
                      {subject.completedTasks ||
                        0}
                      {" completed"}
                    </p>
                  </div>

                  <div className="task-details">
                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDeleteSubject(
                          subject._id
                        )
                      }
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            type="button"
            className="add-task-btn"
            onClick={() =>
              navigateTo("dashboard")
            }
          >
            ← Back to Dashboard
          </button>
        </main>
      </div>
    );
  }

  // =========================================================
  // PROFILE & SETTINGS PAGE
  // =========================================================

  if (page === "profile") {
    return (
      <div className="app">
        <nav className="navbar">
          <div
            className="logo"
            onClick={() => navigateTo("dashboard")}
          >
            🎓 StudentHub
          </div>

          <div className="nav-links">
            <span
              className={navClass("dashboard")}
              onClick={() => navigateTo("dashboard")}
            >
              Dashboard
            </span>

            <span
              className={navClass("tasks")}
              onClick={() => navigateTo("tasks")}
            >
              Tasks
            </span>

            <span
              className={navClass("subjects")}
              onClick={() => navigateTo("subjects")}
            >
              Subjects
            </span>

            <span
              className={navClass("profile")}
            >
              Profile
            </span>
          </div>
        </nav>

        <main className="dashboard">
          <div className="dashboard-header">
            <h1>👤 Profile & Settings</h1>

            <p>
              Manage your personal and academic
              information.
            </p>
          </div>

          <div
            className="login-card"
            style={{
              maxWidth: "650px",
              margin: "30px auto",
            }}
          >
            <div className="login-icon">
              👤
            </div>

            <h2>My Profile</h2>

            <p className="login-subtitle">
              Update your StudentHub profile
              information.
            </p>

            <form
              onSubmit={handleUpdateProfile}
            >
              <label>Full Name</label>

              <input
                type="text"
                placeholder="Enter your name"
                value={profile.name}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    name: e.target.value,
                  })
                }
                required
              />

              <label>Email Address</label>

              <input
                type="email"
                value={profile.email}
                readOnly
                disabled
              />

              <label>Course</label>

              <input
                type="text"
                placeholder="Example: Information Science and Engineering"
                value={profile.course}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    course: e.target.value,
                  })
                }
              />

              <label>Year</label>

              <select
                value={profile.year}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    year: e.target.value,
                  })
                }
              >
                <option value="">
                  Select Year
                </option>

                <option value="1st Year">
                  1st Year
                </option>

                <option value="2nd Year">
                  2nd Year
                </option>

                <option value="3rd Year">
                  3rd Year
                </option>

                <option value="4th Year">
                  4th Year
                </option>
              </select>

              <button
                className="login-btn"
                type="submit"
              >
                Save Changes
              </button>
            </form>

            {profileMessage && (
              <p
                style={{
                  marginTop: "18px",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                {profileMessage}
              </p>
            )}
          </div>

          <div
            className="login-card"
            style={{
              maxWidth: "650px",
              margin: "30px auto",
            }}
          >
            <h2>⚙️ Account Settings</h2>

            <p className="login-subtitle">
              Your account email is used for
              login and cannot be changed here.
            </p>

            <button
              type="button"
              className="delete-btn"
              style={{
                width: "100%",
                marginTop: "10px",
              }}
              onClick={handleLogout}
            >
              🚪 Logout
            </button>
          </div>

          <button
            type="button"
            className="add-task-btn"
            onClick={() =>
              navigateTo("dashboard")
            }
          >
            ← Back to Dashboard
          </button>
        </main>
      </div>
    );
  }

  // =========================================================
  // TASKS PAGE
  // =========================================================

  if (page === "tasks") {
    const filteredTasks = tasks.filter((task) => {
      const search = searchTerm
        .toLowerCase()
        .trim();

      const title = (task.title || "")
        .toLowerCase();

      const subject = (task.subject || "")
        .toLowerCase();

      const matchesSearch =
        title.includes(search) ||
        subject.includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        task.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });

    return (
      <div className="app">
        <nav className="navbar">
          <div
            className="logo"
            onClick={() => navigateTo("dashboard")}
          >
            🎓 StudentHub
          </div>

          <div className="nav-links">
            <span
              className={navClass("dashboard")}
              onClick={() => navigateTo("dashboard")}
            >
              Dashboard
            </span>

            <span
              className={navClass("tasks")}
            >
              Tasks
            </span>

            <span
              className={navClass("subjects")}
              onClick={() => navigateTo("subjects")}
            >
              Subjects
            </span>

            <span
              className={navClass("profile")}
              onClick={() => navigateTo("profile")}
            >
              Profile
            </span>
          </div>
        </nav>

        <main className="dashboard">
          <div className="dashboard-header">
            <h1>📋 Tasks</h1>

            <p>
              Manage your assignments and
              academic tasks.
            </p>
          </div>

          <button
            className="add-task-btn"
            onClick={() =>
              setPage("add-task")
            }
          >
            + Add New Task
          </button>

          <div className="task-list">
            <h2>Your Tasks</h2>

            <div className="task-filters">
              <input
                type="text"
                placeholder="🔎 Search tasks or subjects..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >
                <option value="All">
                  All Status
                </option>

                <option value="To Do">
                  To Do
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Done">
                  Done
                </option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(
                    e.target.value
                  )
                }
              >
                <option value="All">
                  All Priority
                </option>

                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>
              </select>
            </div>

            {filteredTasks.length === 0 ? (
              <p className="no-tasks">
                {tasks.length === 0
                  ? "No tasks available. Click + Add New Task to create your first task."
                  : "No tasks match your search or filters."}
              </p>
            ) : (
              filteredTasks.map((task) => (
                <div
                  className="task-card"
                  key={task._id}
                  onClick={() =>
                    handleEdit(task)
                  }
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <div className="task-info">
                    <h3>{task.title}</h3>

                    <p>
                      {task.description ||
                        "No description"}
                    </p>

                    <p>
                      <strong>
                        Subject:
                      </strong>{" "}
                      {task.subject ||
                        "No subject"}
                    </p>

                    <p>
                      <strong>
                        Due Date:
                      </strong>{" "}
                      {new Date(
                        task.dueDate
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div
                    className="task-details"
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                  >
                    <span>
                      Priority:{" "}
                      <strong>
                        {task.priority}
                      </strong>
                    </span>

                    <select
                      value={task.status}
                      onClick={(e) =>
                        e.stopPropagation()
                      }
                      onChange={(e) =>
                        handleStatusChange(
                          task,
                          e.target.value
                        )
                      }
                    >
                      <option value="To Do">
                        To Do
                      </option>

                      <option value="In Progress">
                        In Progress
                      </option>

                      <option value="Done">
                        Done
                      </option>
                    </select>

                    <button
                      className="edit-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(task);
                      }}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(
                          task._id
                        );
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* =================================================
              KANBAN BOARD
          ================================================= */}

          <div className="kanban-board">
            <h2>📌 Kanban Board</h2>

            <div className="kanban-columns">
              {[
                "To Do",
                "In Progress",
                "Done",
              ].map((status) => {
                const columnTasks =
                  filteredTasks.filter(
                    (task) =>
                      task.status === status
                  );

                const className =
                  status === "To Do"
                    ? "todo"
                    : status === "In Progress"
                    ? "progress"
                    : "done";

                return (
                  <div
                    className={`kanban-column ${className}`}
                    key={status}
                  >
                    <h3>
                      {status === "Done"
                        ? "Completed"
                        : status}
                    </h3>

                    {columnTasks.length === 0 ? (
                      <p className="kanban-empty">
                        No tasks here
                      </p>
                    ) : (
                      columnTasks.map((task) => (
                        <div
                          className="kanban-task"
                          key={task._id}
                          onClick={() =>
                            handleEdit(task)
                          }
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          <h4>{task.title}</h4>

                          <p>
                            {task.subject ||
                              "No subject"}
                          </p>

                          <small>
                            Due:{" "}
                            {new Date(
                              task.dueDate
                            ).toLocaleDateString()}
                          </small>

                          <select
                            value={task.status}
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                            onChange={(e) =>
                              handleStatusChange(
                                task,
                                e.target.value
                              )
                            }
                          >
                            <option value="To Do">
                              To Do
                            </option>

                            <option value="In Progress">
                              In Progress
                            </option>

                            <option value="Done">
                              Done
                            </option>
                          </select>
                        </div>
                      ))
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // =========================================================
  // DASHBOARD
  // =========================================================

  if (page === "dashboard") {
    let user = null;

    try {
      user = JSON.parse(
        localStorage.getItem("user")
      );
    } catch (error) {
      user = null;
    }

    const completedTasks = tasks.filter(
      (task) => task.status === "Done"
    ).length;

    const pendingTasks = tasks.filter(
      (task) => task.status !== "Done"
    ).length;

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const overdueTasks = tasks.filter(
      (task) => {
        const due = new Date(
          task.dueDate
        );

        due.setHours(0, 0, 0, 0);

        return (
          task.status !== "Done" &&
          due < today
        );
      }
    ).length;

    const completionRate =
      tasks.length === 0
        ? 0
        : Math.round(
            (completedTasks /
              tasks.length) *
              100
          );

    return (
      <div className="app">
        <nav className="navbar">
          <div
            className="logo"
            onClick={() => navigateTo("dashboard")}
          >
            🎓 StudentHub
          </div>

          <div className="nav-links">
            <span
              className={navClass("dashboard")}
            >
              Dashboard
            </span>

            <span
              className={navClass("tasks")}
              onClick={() => navigateTo("tasks")}
            >
              Tasks
            </span>

            <span
              className={navClass("subjects")}
              onClick={() => navigateTo("subjects")}
            >
              Subjects
            </span>

            <span
              className={navClass("profile")}
              onClick={() => navigateTo("profile")}
            >
              Profile
            </span>
          </div>
        </nav>

        <main className="dashboard">
          <div className="dashboard-header">
            <h1>
              Welcome,{" "}
              {user?.name || "Student"}! 👋
            </h1>

            <p>
              Manage your tasks, assignments
              and academic activities from
              one place.
            </p>
          </div>

          {/* =================================================
              DASHBOARD CARDS
          ================================================= */}

          <div className="dashboard-cards">
            <div className="dashboard-card">
              <div className="card-icon">
                📋
              </div>

              <h3>Total Tasks</h3>

              <p>{tasks.length}</p>
            </div>

            <div className="dashboard-card">
              <div className="card-icon">
                ⏳
              </div>

              <h3>Pending Tasks</h3>

              <p>{pendingTasks}</p>
            </div>

            <div className="dashboard-card">
              <div className="card-icon">
                ✅
              </div>

              <h3>Completed Tasks</h3>

              <p>{completedTasks}</p>
            </div>

            <div className="dashboard-card">
              <div className="card-icon">
                📚
              </div>

              <h3>Subjects</h3>

              <p>{subjects.length}</p>
            </div>
          </div>

          {/* =================================================
              PRODUCTIVITY ANALYTICS
          ================================================= */}

          <div className="analytics-section">
            <div className="analytics-header">
              <div>
                <h2>
                  📊 Productivity Analytics
                </h2>

                <p>
                  Track your academic task
                  progress at a glance.
                </p>
              </div>

              <div className="completion-rate">
                <strong>
                  {completionRate}%
                </strong>

                <span>
                  Completion Rate
                </span>
              </div>
            </div>

            <div className="analytics-cards">
              <div className="analytics-card">
                <span className="analytics-icon">
                  📝
                </span>

                <div>
                  <h3>{tasks.length}</h3>

                  <p>Total Tasks</p>
                </div>
              </div>

              <div className="analytics-card">
                <span className="analytics-icon">
                  ✅
                </span>

                <div>
                  <h3>
                    {completedTasks}
                  </h3>

                  <p>Completed</p>
                </div>
              </div>

              <div className="analytics-card">
                <span className="analytics-icon">
                  ⏳
                </span>

                <div>
                  <h3>
                    {pendingTasks}
                  </h3>

                  <p>Pending</p>
                </div>
              </div>

              <div className="analytics-card">
                <span className="analytics-icon">
                  ⚠️
                </span>

                <div>
                  <h3>
                    {overdueTasks}
                  </h3>

                  <p>Overdue</p>
                </div>
              </div>
            </div>

            <div className="progress-container">
              <div className="progress-title">
                <span>
                  Overall Progress
                </span>

                <strong>
                  {completionRate}%
                </strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${completionRate}%`,
                  }}
                />
              </div>

              <p className="progress-message">
                {tasks.length === 0
                  ? "Add your first task to start tracking your productivity."
                  : completionRate === 100
                  ? "🎉 Excellent! All your tasks are completed."
                  : completionRate >= 75
                  ? "🔥 Great progress! Keep going."
                  : completionRate >= 50
                  ? "💪 You're halfway there. Stay focused."
                  : "🚀 Keep working — every completed task counts!"}
              </p>
            </div>
          </div>

          {/* =================================================
              QUICK TASK BUTTON
          ================================================= */}

          <button
            className="add-task-btn"
            onClick={() =>
              navigateTo("tasks")
            }
          >
            📋 View All Tasks
          </button>
        </main>
      </div>
    );
  }

  // =========================================================
  // REGISTER PAGE
  // =========================================================

  if (page === "register") {
    return (
      <div className="app">
        <nav className="navbar">
          <div
            className="logo"
            onClick={() => navigateTo("login")}
          >
            🎓 StudentHub
          </div>

          <div className="nav-links">
            <span
              onClick={() => navigateTo("login")}
            >
              Login
            </span>
          </div>
        </nav>

        <main className="login-page">
          <div className="login-card">
            <div className="login-icon">
              📝
            </div>

            <h1>Create Account</h1>

            <p className="login-subtitle">
              Join StudentHub and organize
              your studies
            </p>

            <form onSubmit={handleRegister}>
              <label>Full Name</label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setAuthMessage("");
                }}
                required
              />

              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={registerEmail}
                onChange={(e) => {
                  setRegisterEmail(
                    e.target.value
                  );
                  setAuthMessage("");
                }}
                required
              />

              <label>Password</label>

              <input
                type="password"
                placeholder="Minimum 6 characters"
                value={registerPassword}
                onChange={(e) => {
                  setRegisterPassword(
                    e.target.value
                  );
                  setAuthMessage("");
                }}
                minLength="6"
                required
              />

              <label>Course</label>

              <input
                type="text"
                placeholder="Example: ISE"
                value={course}
                onChange={(e) => {
                  setCourse(e.target.value);
                  setAuthMessage("");
                }}
              />

              <label>Year</label>

              <select
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                  setAuthMessage("");
                }}
              >
                <option value="">
                  Select Year
                </option>

                <option value="1st Year">
                  1st Year
                </option>

                <option value="2nd Year">
                  2nd Year
                </option>

                <option value="3rd Year">
                  3rd Year
                </option>

                <option value="4th Year">
                  4th Year
                </option>
              </select>

              <button
                className="login-btn"
                type="submit"
                disabled={authLoading}
              >
                {authLoading
                  ? "Creating Account..."
                  : "Create Account"}
              </button>
            </form>

            {authMessage && (
              <p
                style={{
                  marginTop: "18px",
                  textAlign: "center",
                  color: "#ff6b6b",
                  fontWeight: "600",
                }}
              >
                {authMessage}
              </p>
            )}

            <p className="login-note">
              Already have an account?{" "}

              <span
                onClick={() =>
                  navigateTo("login")
                }
              >
                Login
              </span>
            </p>
          </div>
        </main>
      </div>
    );
  }

  // =========================================================
  // LOGIN PAGE
  // =========================================================

  return (
    <div className="app">
      <nav className="navbar">
        <div
          className="logo"
          onClick={() => navigateTo("login")}
        >
          🎓 StudentHub
        </div>

        <div className="nav-links">
          <span className="active">
            Home
          </span>

          <span
            onClick={() =>
              navigateTo("register")
            }
          >
            Register
          </span>
        </div>
      </nav>

      <main className="login-page">
        <div className="login-card">
          <div className="login-icon">
            🎓
          </div>

          <h1>Welcome Back</h1>

          <p className="login-subtitle">
            Login to manage your academic life
          </p>

          <form onSubmit={handleLogin}>
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={loginEmail}
              onChange={(e) => {
                setLoginEmail(e.target.value);
                setAuthMessage("");
              }}
              required
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={loginPassword}
              onChange={(e) => {
                setLoginPassword(
                  e.target.value
                );
                setAuthMessage("");
              }}
              required
            />

            <button
              className="login-btn"
              type="submit"
              disabled={authLoading}
            >
              {authLoading
                ? "Logging in..."
                : "Login"}
            </button>
          </form>

          {authMessage && (
            <p
              style={{
                marginTop: "18px",
                textAlign: "center",
                color: "#ff6b6b",
                fontWeight: "600",
              }}
            >
              {authMessage}
            </p>
          )}

          <p className="login-note">
            Don't have an account?{" "}

            <span
              onClick={() =>
                navigateTo("register")
              }
            >
              Create Account
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;