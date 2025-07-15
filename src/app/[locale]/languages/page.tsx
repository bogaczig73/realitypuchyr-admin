'use client'
import React, { useState } from 'react';
import { SUPPORTED_LANGUAGES as INITIAL_LANGUAGES } from '../components/supportedLanguages';
import Wrapper from '../components/wrapper';

export default function LanguagesPage() {
  const [languages, setLanguages] = useState([...INITIAL_LANGUAGES]);
  const [newLang, setNewLang] = useState({ code: '', name: '', flag: '' });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editLang, setEditLang] = useState({ code: '', name: '', flag: '' });

  const handleAdd = () => {
    if (!newLang.code || !newLang.name) return;
    setLanguages([...languages, { ...newLang }]);
    setNewLang({ code: '', name: '', flag: '' });
  };

  const handleEdit = (idx: number) => {
    setEditIndex(idx);
    setEditLang({ ...languages[idx] });
  };

  const handleSave = () => {
    if (editIndex === null) return;
    const updated = [...languages];
    updated[editIndex] = { ...editLang };
    setLanguages(updated);
    setEditIndex(null);
    setEditLang({ code: '', name: '', flag: '' });
  };

  const handleDelete = (idx: number) => {
    setLanguages(languages.filter((_, i) => i !== idx));
  };

  return (
    <Wrapper>
      <div className="container mx-auto py-8">
        <h2 className="text-2xl font-bold mb-4">Supported Languages</h2>
        <div className="mb-6">
          <input
            className="border px-2 py-1 mr-2"
            placeholder="Code"
            value={newLang.code}
            onChange={e => setNewLang({ ...newLang, code: e.target.value })}
          />
          <input
            className="border px-2 py-1 mr-2"
            placeholder="Name"
            value={newLang.name}
            onChange={e => setNewLang({ ...newLang, name: e.target.value })}
          />
          <input
            className="border px-2 py-1 mr-2"
            placeholder="Flag (emoji)"
            value={newLang.flag}
            onChange={e => setNewLang({ ...newLang, flag: e.target.value })}
          />
          <button className="bg-green-600 text-white px-4 py-1 rounded" onClick={handleAdd}>Add</button>
        </div>
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Flag</th>
              <th className="border px-4 py-2">Code</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {languages.map((lang, idx) => (
              <tr key={lang.code}>
                <td className="border px-4 py-2 text-2xl">{lang.flag}</td>
                <td className="border px-4 py-2">
                  {editIndex === idx ? (
                    <input
                      className="border px-2 py-1"
                      value={editLang.code}
                      onChange={e => setEditLang({ ...editLang, code: e.target.value })}
                    />
                  ) : (
                    lang.code
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editIndex === idx ? (
                    <input
                      className="border px-2 py-1"
                      value={editLang.name}
                      onChange={e => setEditLang({ ...editLang, name: e.target.value })}
                    />
                  ) : (
                    lang.name
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editIndex === idx ? (
                    <>
                      <input
                        className="border px-2 py-1 mr-2"
                        value={editLang.flag}
                        onChange={e => setEditLang({ ...editLang, flag: e.target.value })}
                      />
                      <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2" onClick={handleSave}>Save</button>
                      <button className="bg-gray-400 text-white px-2 py-1 rounded" onClick={() => setEditIndex(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleEdit(idx)}>Edit</button>
                      <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleDelete(idx)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Wrapper>
  );
} 