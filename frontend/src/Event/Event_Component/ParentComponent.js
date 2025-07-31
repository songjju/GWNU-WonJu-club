import React, { useState } from "react";
import CreateEvent from "./CreateEvent";
import EventCard from "../Main/EventCard";

function ParentComponent() {
  const [events, setEvents] = useState([]);

  const handleCreateEvent = (eventData) => {
    setEvents([...events, eventData]); // 새 이벤트를 이벤트 배열에 추가합니다.
  };

  return (
    <div>
      {/* CreateEvent 컴포넌트에 onCreateEvent 콜백 함수를 전달합니다. */}
      <CreateEvent onCreateEvent={handleCreateEvent} />
      {/* EventCard 컴포넌트에 현재 이벤트 데이터 배열을 전달합니다. */}
      <EventCard events={events} />
    </div>
  );
}

export default ParentComponent;
