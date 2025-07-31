import React from "react";
import { Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import profileImage from "../../Assets/profile.jpg";

const ProfileCard = ({ name, memberLevel }) => {
  return (
    <Card className="profile-card text-center">
      <Card.Img variant="top" src={profileImage} />
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>{memberLevel}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ProfileCard;
