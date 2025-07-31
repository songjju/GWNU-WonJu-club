import React, { useState } from "react";
import CreateClubForm from "./CreateClubForm";
import CreateClub from "./CreateClub";

const CreateClubPage = () => {
  const [clubs, setClubs] = useState([]);

  const addClub = (newClub) => {
    setClubs([...clubs, newClub]);
    console.log("새로운 동아리 정보:", newClub);
  };

  return (
    <div>
      {/* <CreateClubForm addClub={addClub} /> */}
      <CreateClub />
    </div>
  );
};

export default CreateClubPage;
