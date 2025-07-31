import "./club_event_card.css";
import { useNavigate } from "react-router-dom";

export const EventCard = ({
  board_id,
  title,
  content,
  img,
  username,
  date,
}) => {
  const navigate = useNavigate();
  return (
    <div
      className="eventcard-wrapper"
      onClick={() => {
        navigate(`/board/${board_id}`);
      }}
    >
      <div className="eventcard-body-img">
        <img src={img} />
      </div>
      <div className="eventcard-body-text">
        <div className="eventcard-body-text-title">{title}</div>
        <div className="eventcard-body-text-content">{content}</div>
      </div>
      <div className="eventcard-footer">
        <div className="username">{username}</div>
        <div className="date">{date}</div>
      </div>
    </div>
  );
};

export default EventCard();
