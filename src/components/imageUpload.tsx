'use client'
import React, { useState } from "react";
import Image from "next/image";

export default function ImageUpload() {
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [mainImageIndex, setMainImageIndex] = useState<number | null>(null);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...newFiles]);
            
            // Create previews for new files
            const newPreviews = newFiles.map(file => {
                try {
                    return URL.createObjectURL(file);
                } catch (error) {
                    console.error('Error creating preview:', error);
                    return '/placeholder-image.jpg'; // Fallback image
                }
            });
            setPreviews(prev => [...prev, ...newPreviews]);

            // If this is the first image, set it as main
            if (previews.length === 0) {
                setMainImageIndex(0);
            }
        }
    }

    function removeFile(index: number) {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => {
            const previewToRemove = prev[index];
            if (previewToRemove && previewToRemove.startsWith('blob:')) {
                URL.revokeObjectURL(previewToRemove); // Clean up the object URL
            }
            return prev.filter((_, i) => i !== index);
        });

        // If we're removing the main image, set the first remaining image as main
        if (index === mainImageIndex) {
            setMainImageIndex(files.length > 1 ? 0 : null);
        } else if (index < mainImageIndex!) {
            // If we remove an image before the main image, adjust the main image index
            setMainImageIndex(mainImageIndex! - 1);
        }
    }

    function setMainImage(index: number) {
        setMainImageIndex(index);
    }

    return (
        <div>
            <p className="font-medium mb-4">Upload your property images here. You can upload up to 10 images.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                {previews.map((preview, index) => (
                    <div key={index} className="relative">
                        <div className="relative w-full h-48">
                            <Image 
                                src={preview || '/placeholder-image.jpg'} 
                                alt={`Preview ${index + 1}`} 
                                fill
                                style={{ objectFit: 'cover' }}
                                className={`rounded-lg ${mainImageIndex === index ? 'ring-2 ring-green-500' : ''}`}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/placeholder-image.jpg';
                                }}
                            />
                            {mainImageIndex === index && (
                                <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-sm">
                                    Main Image
                                </div>
                            )}
                        </div>
                        <div className="absolute top-2 right-2 flex gap-2">
                            <button
                                type="button"
                                onClick={() => setMainImage(index)}
                                className={`bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-green-600 ${mainImageIndex === index ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={mainImageIndex === index}
                                title="Set as main image"
                            >
                                ★
                            </button>
                            <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                title="Remove image"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {previews.length === 0 && (
                <div className="preview-box flex justify-center rounded-md shadow-sm dark:shadow-gray-800 overflow-hidden bg-gray-50 dark:bg-slate-800 text-slate-400 p-2 text-center small w-auto max-h-60">
                    Supports JPG, PNG and MP4 videos. Max file size: 10MB.
                </div>
            )}

            <input 
                type="file" 
                id="input-file" 
                name="images" 
                accept="image/*" 
                onChange={handleChange} 
                multiple 
                className="hidden"
            />
            <label 
                className="btn-upload btn bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 text-white rounded-md mt-6 cursor-pointer" 
                htmlFor="input-file"
            >
                Upload Images
            </label>
        </div>
    );
}