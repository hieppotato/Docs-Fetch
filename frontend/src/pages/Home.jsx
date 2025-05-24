import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdAdd } from "react-icons/md"
import Modal from 'react-modal';
import AddDoc from "./AddDoc";
import axios from "axios";

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

  const [allDocs, setAllDocs] = useState([]);
  const [openAddModal, setOpenAddModal] = useState({
      isShown: false,
      data: null,
    });

  // const handleAddData = (data) => {
  //       setOpenAddModal({ isShown: true, data });
  // };

  const getAllDocs = async () => {
      
      try {
          const response = await axios.get("http://localhost:5000/get-all-docs");
        if (response.data && response.data) {
          setAllDocs(response.data);
        }
      } catch (error) {
          console.log("An unexpected error occurred. Please try again");
      }
  }

  useEffect(() => {
    getAllDocs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          📚 Danh sách tài liệu
        </h1>
        <div className="space-y-4">
          {allDocs.map((doc) => (
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

          <div>
        <Modal 
              isOpen={openAddModal.isShown}
              onRequestClose={() => {}}
              style={{
                  overlay: {
                      backgroundColor: "rgba(0,0,0,0.2)",
                      zIndex: 999,
                  },
              }}
              appElement={document.getElementById("root")}
              className="w-[80vw] md:w-[40%] h-[80vh] bg-white rounded-lg mx-auto mt-14 p-5 overflow-y-scroll z-50 relative"
            >
            <AddDoc
                type={openAddModal.type}
                docInfo={openAddModal.data}
                onClose={() => {
                    setOpenAddModal({ isShown: false, type: "add", data: null});
                }}
                getAllDocs={getAllDocs} 
            />
            </Modal>
            
            
            <button
                className="w-16 h-16 flex items-center justify-center rounded-full bg-black hover:bg-pornhub-200 fixed right-10 bottom-10"
                onClick={() => {
                setOpenAddModal({ isShown: true, type: "add", data: null });
                }}
            >
                <MdAdd className="text-[32px] text-white" />
            </button>        
        </div>
    </div>
  );
};

export default Home;
