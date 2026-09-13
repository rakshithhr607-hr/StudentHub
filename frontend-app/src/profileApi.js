const API_URL = import.meta.env.VITE_API_URL;

const handleResponse = async (response) => {
  let data = {};

  try {
    data = await response.json();
  } catch (error) {
    data = {
      message: "Invalid response from server",
    };
  }

  // Session expired / unauthorized
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
      message: data.message || "Something went wrong. Please try again.",
    };
  }

  return {
    success: true,
    ...data,
  };
};


// GET PROFILE
export const getProfile = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Get profile error:", error);

    return {
      success: false,
      message: "Unable to connect to the server.",
    };
  }
};


// UPDATE PROFILE
export const updateProfile = async (profile) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Update profile error:", error);

    return {
      success: false,
      message: "Unable to connect to the server.",
    };
  }
};