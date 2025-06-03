'use client';

import React, { useState } from 'react';

export default function TestUpload() {
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (files.length === 0) {
            setError('Please select at least one file');
            return;
        }

        setUploading(true);
        setError(null);
        setResults([]);

        try {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append('images', file);
            });

            const response = await fetch('http://localhost:3003/api/properties/test-upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            setResults(Array.isArray(data) ? data : [data]);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Test S3 Upload</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-2">
                        Select images (you can select multiple):
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            className="block w-full mt-1"
                        />
                    </label>
                    {files.length > 0 && (
                        <div className="mt-2">
                            <p className="text-sm text-gray-600">
                                Selected {files.length} file(s):
                            </p>
                            <ul className="mt-1 text-sm text-gray-500">
                                {files.map((file, index) => (
                                    <li key={index}>
                                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={uploading || files.length === 0}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
                >
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
            </form>

            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                    Error: {error}
                </div>
            )}

            {results.length > 0 && (
                <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
                    <h2 className="font-bold">Upload Successful!</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {results.map((result, index) => (
                            <div key={index} className="border rounded p-2">
                                <p className="text-sm break-all">Image URL: {result.imageUrl}</p>
                                {result.imageUrl && (
                                    <div className="mt-2">
                                        <img
                                            src={result.imageUrl}
                                            alt={`Uploaded ${index + 1}`}
                                            className="w-full h-48 object-cover rounded"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
} 