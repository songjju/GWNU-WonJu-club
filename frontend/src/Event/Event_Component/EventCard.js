import "../Event_Style/EventCard.css";
import { useNavigate } from "react-router-dom";

export const EventCard = ({
  title,
  content,
  photo,
  username,
  start_time,
  end_time,
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
        <img src={photo} />
      </div>
      <div className="eventcard-body-text">
        <div className="eventcard-body-text-title">{title}</div>
        <div className="eventcard-body-text-content">{content}</div>
      </div>
      <div className="eventcard-footer">
        <div className="username">{username}</div>
        <div className="date">
          {start_time}-{end_time}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
