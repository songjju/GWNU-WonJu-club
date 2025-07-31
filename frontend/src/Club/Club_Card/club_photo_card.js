import "./card.scss";
import { useNavigate } from "react-router-dom";

export const PhotoCard = ({ album_id, title, img_url, username, date }) => {
  const navigate = useNavigate();
  return (
    <div
      className="card-wrapper"
      onClick={() => {
        navigate("club/<str:club_name>/albums/${album_id}/");
      }}
    >
      <div className="card-body-img">
        <img src={img_url} />
      </div>
      <div className="card-body-text">
        <div className="card-body-text-title">{title}</div>
      </div>
      <div className="card-footer">
        <div className="username">{username}</div>
        <div className="date">{date}</div>
      </div>
    </div>
  );
};
