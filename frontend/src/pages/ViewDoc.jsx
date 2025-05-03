import React from "react";
import { useParams } from "react-router-dom";
import PublicGoogleDoc from "../components/PublicGoogleDoc";

const apiKey = "AIzaSyD5d98Fnl3woMJtDsx3ja7j7BTYqVaZqNA"; 

const ViewDoc = () => {
  const { id } = useParams();

  return (
    <div className="p-4">
      <PublicGoogleDoc fileId={id} apiKey={apiKey} />
    </div>
  );
};

export default ViewDoc;