import React from "react";
import { Link } from "react-router-dom";

const docs = [
  {
    id: "1aII0plMyWGVFCUEZldjCUscgCTPr8d4XKuyR2SIK_hM",
    title: "Giới thiệu sản phẩm A",
  },
  {
    id: "17WvpuPDSGOdizkk2RnuCBA3Ex-Snwe74Ko81iBV6MBE",
    title: "Giới thiệu sản phẩm B",
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          📚 Danh sách tài liệu
        </h1>
        <div className="space-y-4">
          {docs.map((doc) => (
            <Link
              key={doc.id}
              to={`/doc/${doc.id}`}
              className="block p-4 bg-white rounded-xl shadow hover:shadow-lg transition duration-200 border border-gray-200 hover:border-blue-400"
            >
              <h2 className="text-lg font-semibold text-blue-600 hover:underline">
                {doc.title}
              </h2>
              <p className="text-sm text-gray-500">Nhấn để xem chi tiết →</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
