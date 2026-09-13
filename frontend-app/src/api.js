const API_URL = import.meta.env.VITE_API_URL;

// =========================
// GET AUTH TOKEN
// =========================

const getToken = () => {
  return localStorage.getItem("token");
};

// =========================
// HANDLE API RESPONSE
// =========================

const handleResponse = async (response) => {
  let data = {};

  try {
    data = await response.json();
  } catch (error) {
    data = {
      message: "Invalid response from server",
    };
  }

  // JWT expired / unauthorized
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Your session has expired. Please login again.");

    window.location.href = "/";

    return null;
  }

  // Other server errors
  if (!response.ok) {
    return {
      success: false,
      message:
        data.message ||
        "Something went wrong. Please try again.",
    };
  }

  return {
    success: true,
    ...data,
  };
};

// =========================
// GET ALL TASKS
// =========================

export const getTasks = async () => {
  try {
    const token = getToken();

    const response = await fetch(`${API_URL}/tasks`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Get tasks error:", error);

    return {
      success: false,
      message:
        "Unable to connect to the server.",
    };
  }
};

// =========================
// CREATE TASK
// =========================

export const createTask = async (task) => {
  try {
    const token = getToken();

    const response = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Create task error:", error);

    return {
      success: false,
      message:
        "Unable to connect to the server.",
    };
  }
};

// =========================
// UPDATE TASK
// =========================

export const updateTask = async (id, task) => {
  try {
    const token = getToken();

    const response = await fetch(
      `${API_URL}/tasks/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      }
    );

    return await handleResponse(response);
  } catch (error) {
    console.error("Update task error:", error);

    return {
      success: false,
      message:
        "Unable to connect to the server.",
    };
  }
};

// =========================
// DELETE TASK
// =========================

export const deleteTask = async (id) => {
  try {
    const token = getToken();

    const response = await fetch(
      `${API_URL}/tasks/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return await handleResponse(response);
  } catch (error) {
    console.error("Delete task error:", error);

    return {
      success: false,
      message:
        "Unable to connect to the server.",
    };
  }
};