import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import EEme from "./Eeme.jsx";
import { BACKEND_URL } from "../config.js";

function Journal() {
  const [searchParams] = useSearchParams();
  const date = searchParams.get("q");

  const [journal, setJournal] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ content: "", mood: 3, todos: [] });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEeme, setShowEeme] = useState(false);

  const moodEmojis = [
    { emoji: "😭", value: 1, label: "Very Sad" },
    { emoji: "🙁", value: 2, label: "Sad" },
    { emoji: "😐", value: 3, label: "Neutral" },
    { emoji: "🙂", value: 4, label: "Happy" },
    { emoji: "😄", value: 5, label: "Very Happy" },
  ];

  useEffect(() => {
    if (!date) return;

    setLoading(true);
    fetch(`${BACKEND_URL}/api/users/journal?q=${date}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.journal) {
          setJournal(data.journal);
          setForm({
            content: data.journal.content,
            mood: data.journal.mood,
            todos: data.journal.todos || [],
          });
        } else {
          setJournal(null);
        }
      })
      .catch((err) => setError("Failed to fetch journal: " + err.message))
      .finally(() => setLoading(false));
  }, [date]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "mood" ? parseInt(value) : value,
    }));
  };

  const handleMoodChange = (moodValue) => {
    setForm((prev) => ({ ...prev, mood: moodValue }));
  };

  const handleSave = () => {
    if (form.mood < 1 || form.mood > 5) {
      alert("Mood must be between 1 and 5.");
      return;
    }

    fetch(`${BACKEND_URL}/api/users/journal?q=${date}`, {
      method: journal ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        setJournal(data.journal);
        setIsEditing(false);
        setError(null);
        // Refresh the page after save
        window.location.reload();
      })
      .catch((err) => {
        alert("Failed to update journal: " + err.message);
      });
  };
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const formatted_date = `${date.slice(0, 2)} ${
    months[parseInt(date.slice(2, 4)) - 1]
  }, ${date.slice(4)}`;

  if (error) {
    return (
      <div className="w-full max-w-lg mx-auto my-10 text-center text-red-700 font-semibold bg-red-100 border border-red-300 p-6 rounded-lg shadow-md">
        <span role="img" aria-label="error" className="mr-2">
          ️⚠️
        </span>{" "}
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-screen min-h-screen bg-[#FFE3BB] flex flex-col items-center justify-center text-xl text-gray-500">
        <span
          role="img"
          aria-label="loading"
          className="animate-spin inline-block mr-3 text-2xl"
        >
          ⏳
        </span>
        Loading your thoughts...
      </div>
    );
  }

  if (!date) {
    return (
      <div className="w-screen min-h-screen bg-[#FFE3BB] flex flex-col items-center justify-center py-12 px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-700">
            <span role="img" aria-label="calendar" className="mr-2 text-3xl">
              📅
            </span>
            No date selected. Please pick a date from the calendar.
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-[#FFE3BB] flex flex-col items-center justify-start py-10 px-2 sm:px-4">
      <h2 className="text-4xl font-bold text-[#03A6A1] mb-6 text-center">
        <span role="img" aria-label="journal" className="mr-2">
          📝
        </span>{" "}
        Journal Entry - {formatted_date}
      </h2>

      {/* Mobile Eeme toggle button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-[#03A6A1] text-white rounded-full shadow-lg p-4 sm:hidden flex items-center justify-center"
        onClick={() => setShowEeme(true)}
        aria-label="Open AI Assistant"
      >
        <span role="img" aria-label="ai" className="text-2xl">
          🤖
        </span>
      </button>

      {/* Eeme side panel for mobile */}
      <div
        className={`fixed inset-0 z-50 bg-black bg-opacity-40 transition-opacity duration-300 ${
          showEeme
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } sm:hidden`}
        onClick={() => setShowEeme(false)}
      >
        <div
          className={`fixed top-0 right-0 h-full w-11/12 max-w-sm bg-white shadow-lg border-l border-gray-200 transition-transform duration-300 ${
            showEeme ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-[#03A6A1]">
              Eeme AI Assistant
            </h3>
            <button
              className="text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setShowEeme(false)}
              aria-label="Close AI Assistant"
            >
              &times;
            </button>
          </div>
          <div className="h-[calc(100%-64px)] overflow-y-auto p-2">
            <EEme date={date} />
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row w-full max-w-6xl mx-auto gap-6">
        {/* Main journal area */}
        <div className="w-full sm:w-2/3 pr-0 sm:pr-4">
          {!isEditing ? (
            journal ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 h-full flex flex-col space-y-6">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-700 text-lg mb-2">
                    <span role="img" aria-label="text" className="mr-2">
                      ✍️
                    </span>{" "}
                    My Day
                  </h3>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {journal.content}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="sm:w-1/4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 h-full">
                      <h3 className="font-semibold text-gray-700 text-lg mb-2">
                        <span role="img" aria-label="mood" className="mr-2">
                          ♥️
                        </span>{" "}
                        Mood
                      </h3>
                      <p className="text-gray-600 text-2xl">
                        {moodEmojis.find((m) => m.value === journal.mood)
                          ?.emoji || journal.mood}
                      </p>
                    </div>
                  </div>
                  <div className="sm:w-3/4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 h-full">
                      <h3 className="font-semibold text-gray-700 text-lg mb-2">
                        <span
                          role="img"
                          aria-label="checklist"
                          className="mr-2"
                        >
                          ✅
                        </span>{" "}
                        Todos
                      </h3>
                      {journal.todos.length > 0 ? (
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {journal.todos.map((todo, index) => (
                            <li key={index}>{todo}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 italic">
                          No todos for today.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-auto bg-[#03A6A1] hover:bg-[#028A80] text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 ease-in-out self-start flex items-center shadow hover:shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#03A6A1] focus:ring-offset-2"
                >
                  <span role="img" aria-label="edit" className="mr-2">
                    ✏️
                  </span>{" "}
                  Edit
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 h-full flex flex-col items-center justify-center text-center space-y-6">
                <span role="img" aria-label="empty page" className="text-6xl">
                  🙃
                </span>
                <p className="text-xl text-gray-600">
                  Looks like this page is empty.
                </p>
                <p className="text-gray-500">
                  Ready to jot down some thoughts for {formatted_date}?
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-[#FF4F0F] to-[#FF703A] hover:from-[#E0450D] hover:to-[#FF4F0F] text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 ease-in-out text-lg flex items-center shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#FF4F0F] focus:ring-offset-2"
                >
                  <span role="img" aria-label="plus" className="mr-2">
                    ➕
                  </span>{" "}
                  Create Entry
                </button>
              </div>
            )
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 h-full flex flex-col space-y-6">
              <div>
                <label
                  htmlFor="content"
                  className="block text-md text-gray-600 font-medium mb-1.5"
                >
                  <span role="img" aria-label="text" className="mr-1">
                    ✍️
                  </span>{" "}
                  What{"'"}s on your mind?
                </label>
                <textarea
                  name="content"
                  id="content"
                  value={form.content}
                  onChange={handleChange}
                  placeholder="Write your journal..."
                  rows="10"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03A6A1] focus:border-[#03A6A1] focus:ring-offset-1 resize-y shadow-sm hover:border-gray-400 transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="mood"
                  className="block text-md text-gray-600 font-medium mb-1.5"
                >
                  <span role="img" aria-label="mood" className="mr-1">
                    ♥️
                  </span>{" "}
                  How are you feeling?
                </label>
                <div className="flex flex-wrap gap-2 sm:space-x-3 justify-around p-2 bg-gray-50 rounded-lg border border-gray-200">
                  {moodEmojis.map(({ emoji, value, label }) => (
                    <button
                      key={value}
                      type="button"
                      aria-label={label}
                      onClick={() => handleMoodChange(value)}
                      className={`text-3xl sm:text-4xl p-2 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#03A6A1] ${
                        form.mood === value
                          ? "bg-[#03A6A1] bg-opacity-20 scale-110 ring-2 ring-[#03A6A1]"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-md text-gray-600 font-medium mb-1.5">
                  <span role="img" aria-label="checklist" className="mr-1">
                    ✅
                  </span>{" "}
                  Any tasks for today?
                </label>
                <ul className="space-y-3">
                  {form.todos.map((todo, idx) => (
                    <li
                      key={idx}
                      className="flex items-center space-x-3 p-2 bg-gray-50 rounded-md border border-gray-200"
                    >
                      <input
                        type="text"
                        value={todo}
                        placeholder="New todo..."
                        onChange={(e) => {
                          const newTodos = [...form.todos];
                          newTodos[idx] = e.target.value;
                          setForm({ ...form, todos: newTodos });
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#03A6A1] focus:border-[#03A6A1] bg-white"
                      />
                      <button
                        onClick={() => {
                          const newTodos = form.todos.filter(
                            (_, i) => i !== idx
                          );
                          setForm({ ...form, todos: newTodos });
                        }}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-100 transition-all transform hover:scale-110"
                        aria-label="Remove todo"
                      >
                        <span role="img" aria-hidden="true">
                          🗑️
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() =>
                    setForm({ ...form, todos: [...form.todos, ""] })
                  }
                  className="mt-3 text-sm text-[#03A6A1] hover:text-[#028A80] font-semibold flex items-center transition-colors transform hover:translate-x-1"
                >
                  <span role="img" aria-label="plus" className="mr-1">
                    ➕
                  </span>{" "}
                  Add Todo
                </button>
              </div>
              <div className="flex justify-end space-x-4 mt-auto">
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 ease-in-out flex items-center shadow hover:shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  <span role="img" aria-label="cancel" className="mr-2">
                    ❌
                  </span>{" "}
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-[#03A6A1] hover:bg-[#028A80] text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 ease-in-out flex items-center shadow hover:shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#03A6A1] focus:ring-offset-2"
                >
                  <span role="img" aria-label="save" className="mr-2">
                    💾
                  </span>{" "}
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Eeme always visible on desktop */}
        <div className="hidden sm:block w-1/3 pl-0 sm:pl-4">
          <EEme date={date} />
        </div>
      </div>
    </div>
  );
}

export default Journal;
