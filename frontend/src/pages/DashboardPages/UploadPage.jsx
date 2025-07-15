// pages/UploadPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { FaUpload, FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import { useThemeStore } from '../../store/themeStore';
import usePostStore from '../../store/postStore';

const UploadPage = () => {
  const { isDark } = useThemeStore();
  const { isLoading, error, success, uploadPost, fetchPost, clearMessages } = usePostStore();

  const [caption, setCaption] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const fileInputRef = useRef();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) {
      alert('You can upload a maximum of 10 images.');
      return;
    }

    const newImages = [...images, ...files];
    const newPreviews = [...imagePreviews, ...files.map((file) => URL.createObjectURL(file))];

    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleRemoveImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    if (images.length <= 1) fileInputRef.current.value = '';
  };

  const handlePost = async () => {
    if (images.length === 0 || !caption.trim()) {
      alert('Please add a caption and at least one image.');
      return;
    }

    const formData = new FormData();
    images.forEach((img) => formData.append('post_image', img));
    formData.append('caption', caption);
    formData.append('privacy', privacy);

    try {
      await uploadPost(formData);
      await fetchPost();
      setCaption('');
      setPrivacy('public');
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      setImages([]);
      setImagePreviews([]);
      fileInputRef.current.value = '';
    } catch (err) {
      console.error('Upload failed:', err.message);
    }
  };

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => clearMessages(), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  useEffect(() => {
    return () => imagePreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [imagePreviews]);

  return (
    <div className={`min-h-screen px-4 py-6 ${isDark ? 'bg-[#111111]' : 'bg-[#f3f6fa]'}`}>
      <div className="max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-6">
          <FaUpload className="text-[#288683] text-2xl" />
          <h2 className={`text-2xl font-extrabold ${isDark ? 'text-white' : 'text-gray-800'}`}>Upload Content</h2>
        </div>

        {success && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{success}</div>}
        {error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{error}</div>}

        <div className="space-y-6">
          <div>
            <label htmlFor="dropzone-file">
              {imagePreviews.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img src={preview} alt={`preview-${index}`} className="max-h-24 object-contain" />
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                        onClick={() => handleRemoveImage(index)}
                        disabled={isLoading}
                      >
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg">
                  <FaCloudUploadAlt className="w-10 h-10 text-gray-500" />
                  <p>Click to upload or drag and drop</p>
                  <p className="text-xs">JPG, PNG, GIF (Max 10 images, 5MB each)</p>
                </div>
              )}
              <input
                type="file"
                id="dropzone-file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                disabled={isLoading}
              />
            </label>
          </div>

          <textarea
            placeholder="Write your thoughts..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            disabled={isLoading}
            className="w-full p-3 border rounded"
          />

          <select
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value)}
            disabled={isLoading}
            className="w-full p-3 border rounded"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="friends">Friends Only</option>
          </select>

          <button
            type="button"
            onClick={handlePost}
            disabled={isLoading}
            className={`px-6 py-3 text-white font-semibold rounded ${
              isLoading ? 'bg-gray-500' : 'bg-[#288683] hover:bg-[#1e6e66]'
            }`}
          >
            {isLoading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
