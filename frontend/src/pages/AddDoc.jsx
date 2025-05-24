import React, { useState } from 'react'
import { MdAdd } from 'react-icons/md';
import axios from 'axios';

const AddDoc = ({ getAllDocs, onClose}) => {

  const [title, setTitle] = useState("");
  const [id, setid] = useState("");
  const [error, setError] = useState("");

  const addNewDoc = async () => {
    try{
      const response = await axios.post("http://localhost:5000/upload-docs-id", {
        title,
        id,
      })
      if(response.data && response.data.newDoc){
        getAllDocs();
        onClose();
      }

    }catch(error){
      if(error.response && 
        error.response.data && 
        error.response.data.message
      ){
        setError(error.response.data.message);
      }else{
        setError("An unexpected error occurred.Please try again!")
      }
    }
  }



  return (
    <div className="flex-1 flex flex-col gap-2 pt-4">
        <label className="input-label">ID Docs</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="input id docs"
          value={id}
          onChange={({target}) => setid(target.value)}
        />
        
        <div className="flex flex-col gap-2 mt-4">
          <label className="input-label">Title</label>
          <textarea
           type="text"
           className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
           placeholder="Your Title"
           rows={10}
           value={title}
           onChange={({ target }) => setTitle(target.value)}
           />
        </div> 
        <button className="btn-small flex items-center gap-1" onClick={addNewDoc}>
            <MdAdd className="text-lg" /> ADD DOCS
        </button>
        <button className="btn-small flex items-center gap-1" onClick={onClose}>
            <MdAdd className="text-lg" /> Close
        </button>
      </div>
  )
}

export default AddDoc