const API_URL = import.meta.env.VITE_API_URL;

// GET ALL SUBJECTS
export const getSubjects = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/subjects`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
};


// CREATE SUBJECT
export const createSubject = async (subject) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/subjects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(subject),
  });

  return await response.json();
};


// DELETE SUBJECT
export const deleteSubject = async (id) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/subjects/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
};