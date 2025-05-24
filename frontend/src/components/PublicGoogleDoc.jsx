import React, { useEffect, useState } from "react";

const PublicGoogleDoc = ({ fileId, apiKey }) => {
  const [html, setHtml] = useState("Đang tải nội dung...");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/html&key=${apiKey}`
        );
        if (!res.ok) throw new Error("Không thể tải nội dung tài liệu.");
        const htmlText = await res.text();
  
        // Tìm URL ảnh
        const imageUrls = Array.from(htmlText.matchAll(/src="(https:\/\/[^\s]+)"/g))
          .map(match => match[1]);
  
        let updatedHtml = htmlText;
  
        if (imageUrls.length > 0) {
          const cachedMap = JSON.parse(localStorage.getItem(`imageCache_${fileId}`) || '{}');
  
          const urlsToDownload = imageUrls.filter(url => !cachedMap[url]);
  
          let updatedMap = { ...cachedMap };
  
          if (urlsToDownload.length > 0) {
            const imageRes = await fetch('http://localhost:5000/api/download-images', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ imageUrls: urlsToDownload }),
            });
  
            const data = await imageRes.json();
  
            urlsToDownload.forEach((url, index) => {
              const fullUrl = data.paths[index]; 
              updatedMap[url] = fullUrl;
            });
  
            localStorage.setItem(`imageCache_${fileId}`, JSON.stringify(updatedMap));
          }
  
          // Thay thế toàn bộ URL ảnh trong HTML
          imageUrls.forEach((originalUrl) => {
            if (updatedMap[originalUrl]) {
              updatedHtml = updatedHtml.replace(originalUrl, updatedMap[originalUrl]);
            }
          });
        }
  
        setHtml(updatedHtml);
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
