import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

function App() {
  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    const response = await fetch("https://kvdb.io/N7cmQg1DwZbADh2Hu3NncF/", {
      headers: {
        Authorization: "Basic " + btoa("resources:"),
      },
    });
    const data = await response.json();
    const resourceKeys = Object.keys(data);
    const resourcePromises = resourceKeys.map((key) =>
      fetch(`https://kvdb.io/N7cmQg1DwZbADh2Hu3NncF/${key}`, {
        headers: {
          Authorization: "Basic " + btoa("resources:"),
        },
      }).then((res) => res.json()),
    );
    const resourcesData = await Promise.all(resourcePromises);
    setResources(resourcesData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newResource = { title, description, url };
    if (editingId) {
      await fetch(`https://kvdb.io/N7cmQg1DwZbADh2Hu3NncF/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa("resources:"),
        },
        body: JSON.stringify(newResource),
      });
      setEditingId(null);
    } else {
      await fetch("https://kvdb.io/N7cmQg1DwZbADh2Hu3NncF/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa("resources:"),
        },
        body: JSON.stringify(newResource),
      });
    }
    setTitle("");
    setDescription("");
    setUrl("");
    fetchResources();
  };

  const handleEdit = (resource) => {
    setEditingId(resource.key);
    setTitle(resource.title);
    setDescription(resource.description);
    setUrl(resource.url);
  };

  const handleDelete = async (id) => {
    await fetch(`https://kvdb.io/N7cmQg1DwZbADh2Hu3NncF/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Basic " + btoa("resources:"),
      },
    });
    fetchResources();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Recursive Legal</h1>
      <p className="text-xl mb-8">Self-improving legal advice for exponential startups.</p>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="input input-bordered w-full" required />
        </div>
        <div className="mb-4">
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="textarea textarea-bordered w-full" required></textarea>
        </div>
        <div className="mb-4">
          <input type="url" placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} className="input input-bordered w-full" required />
        </div>
        <button type="submit" className="btn btn-primary">
          {editingId ? "Update Resource" : "Add Resource"}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource) => (
          <div key={resource.key} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">{resource.title}</h2>
              <p>{resource.description}</p>
              <div className="card-actions justify-end">
                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                  Visit
                </a>
                <button onClick={() => handleEdit(resource)} className="btn btn-info btn-sm">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(resource.key)} className="btn btn-error btn-sm">
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
