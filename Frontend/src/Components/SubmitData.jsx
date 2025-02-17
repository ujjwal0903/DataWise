import { useState } from "react";
import Footer from "./Footer";

const SubmitData = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {  // 50 MB limit
      setMessage("File is too large. Please upload a smaller file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsLoading(true);  // Start loading

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("File uploaded successfully!");
        setFile(null);
      } else {
        const errorResponse = await response.text();
        setMessage(`Failed to upload the file: ${errorResponse}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);  // End loading
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">Submit Your Data</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg"
      >
        <div className="mb-6">
          <label
            htmlFor="file"
            className="block text-base font-medium text-gray-700 mb-2"
          >
            Upload File
          </label>
          <input
            id="file"
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
        >
          Submit
        </button>
      </form>
      {isLoading && <p>Uploading...</p>}
      {message && <p className="mt-6 text-center text-sm text-gray-700">{message}</p>}
      <Footer />
    </div>
  );
};

export default SubmitData;
