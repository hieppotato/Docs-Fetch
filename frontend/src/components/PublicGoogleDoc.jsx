import React, { useEffect, useState } from "react";

const PublicGoogleDoc = ({ fileId, apiKey }) => {
  const [html, setHtml] = useState("Đang tải nội dung...");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        // Fetch HTML từ Google Docs
        const res = await fetch(
          `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/html&key=${apiKey}`
        );
        if (!res.ok) throw new Error("Không thể tải nội dung tài liệu.");
        const htmlText = await res.text();
        setHtml(htmlText);

        // Tìm các URL ảnh trong HTML
        const imageUrls = Array.from(htmlText.matchAll(/src="(https:\/\/[^\s]+)"/g))
          .map(match => match[1]);

        if (imageUrls.length > 0) {
          // Gửi URL ảnh về backend để lưu 
          const imageRes = await fetch('http://localhost:5000/api/download-images', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrls }),
          });

          const data = await imageRes.json();
          console.log('Saved image URLs:', data.paths);
          // Thay các URL ảnh trong HTML bằng đường dẫn mới
          let updatedHtml = htmlText;
          data.paths.forEach((savedPath, index) => {
            const fullUrl = `http://localhost:5000${savedPath}`;
            updatedHtml = updatedHtml.replace(imageUrls[index], fullUrl);
          });
          setHtml(updatedHtml);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchDoc();
  }, [fileId, apiKey]);

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  
  return (
    <div className="flex justify-center p-4 bg-gray-100 min-h-screen">
      <div
        className="bg-white shadow-md overflow-auto border border-gray-300"
        style={{
          width: '794px',
          height: '1123px',
          padding: '2rem',
        }}
      >
        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
};

export default PublicGoogleDoc;
