'use client'
import React, { useState } from "react";

export default function FileUpload() {
    const [files, setFiles] = useState<File[]>([]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...newFiles]);
        }
    }

    function removeFile(index: number) {
        setFiles(prev => prev.filter((_, i) => i !== index));
    }

    return (
        <div>
            <p className="font-medium mb-4">Upload property documents and files here.</p>
            
            <div className="space-y-2 mb-4">
                {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm truncate max-w-xs">{file.name}</span>
                            <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-600"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>

            {files.length === 0 && (
                <div className="preview-box flex justify-center rounded-md shadow-sm dark:shadow-gray-800 overflow-hidden bg-gray-50 dark:bg-slate-800 text-slate-400 p-2 text-center small w-auto max-h-60">
                    Supports PDF, DOC, DOCX, XLS, XLSX. Max file size: 10MB.
                </div>
            )}

            <input 
                type="file" 
                id="input-files" 
                name="files" 
                accept=".pdf,.doc,.docx,.xls,.xlsx" 
                onChange={handleChange} 
                multiple 
                className="hidden"
            />
            <label 
                className="btn-upload btn bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 text-white rounded-md mt-6 cursor-pointer" 
                htmlFor="input-files"
            >
                Upload Files
            </label>
        </div>
    );
} 