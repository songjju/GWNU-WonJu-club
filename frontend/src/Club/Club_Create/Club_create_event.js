import React, { useState,useEffect } from 'react';
import { Form, Button, InputGroup, FormControl, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import EventCard from '../../Event/Event_Component/EventCard';
import {useParams} from 'react-router';
import ClubHeader from '../Club_Component/Club_head'
import API_BASE_URL from '../../config/apiConfig'; // API 설정 임포트

const ClubCreateEvent = ({ onCreateEvent }) => {
    const {club_name} = useParams(); 
    const [club, setClub] = useState(club_name);
  const [title, setTitle] = useState('');
  const [start_time, setStartTime] = useState('');
  const [end_time, setEndTime] = useState('');
  const [content, setContent] = useState('');
  const [photo, setPhoto] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showEventCard, setShowEventCard] = useState(false); // 이벤트 카드 활성화 상태
  const [eventData, setEventData] = useState(null); // 이벤트 데이터 상태 추가
  const token = localStorage.getItem('token')

  const handlePhotoDelete = (index) => {
    setPhoto(photo.filter((_, i) => i !== index));
  };

  useEffect(() => {
  if (location.state && location.state.club_name) {
    setClub(location.state.club_name);
  }
}, [location.state]);
  // 등록 완료 메시지를 닫는 함수
  const handleCloseMessage = () => {
    setShowSuccessMessage(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
      fetch(`${API_BASE_URL}/club_board/event/`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          Authorization: `Token ${token}`
        },
        // 생성할 사용자 정보(데이터)
        body: JSON.stringify({
          title: title,
          start_time: start_time,
          end_time: end_time,
          content: content,
          club_name: club, // club 이름도 전달
          // photo
        })
      })
      .then(res => {
        console.log(res)
        const responseData = res.data;
        // console.log(responseData)
      });

      try {
        if (typeof onCreateEvent === 'function') {
          onCreateEvent(responseData);
          setTitle('');
          setStartTime('');
          setEndTime('');
          setContent('');
          setPhoto([]);
          setShowSuccessMessage(true); // 등록 완료 메시지를 표시합니다.
          setEventData(responseData); // 이벤트 데이터 상태 업데이트
        }
        } catch (error) {
          console.error('Error:', error);
        }
      }

  // 이벤트 카드를 활성화하는 함수
  const handleActivateEventCard = () => {
    if (eventData) {
      setShowEventCard(true);
    }
  };

  return (
    <div>
       <ClubHeader clubName={club} />
      <Form onSubmit={handleSubmit} style={{ padding: '5px' }}>
        {showSuccessMessage && (
          <Alert variant="success">
            등록이 완료되었습니다.
            <Button variant="outline-success" size="sm" onClick={handleCloseMessage}>
              닫기
            </Button>
          </Alert>
        )}
        <h2 style={{ fontWeight: 'bold', textAlign: 'left', fontSize: '18px' }}>일정 등록</h2>
        <InputGroup className="mb-3 " style={{ marginBottom: "5%" }}>
          <InputGroup.Text>제목</InputGroup.Text>
          <FormControl
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "30%" }}
          />
        </InputGroup>
        <InputGroup className="mb-3" style={{ marginBottom: "5%" }}>
          <InputGroup.Text>기간 설정</InputGroup.Text>
          <FormControl
            type="date"
            value={start_time}
            onChange={(e) => setStartTime(e.target.value)}
            style={{ width: "40%" }}
          />
          <FormControl
            type="date"
            value={end_time}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </InputGroup>
        <InputGroup className="mb-3" style={{ marginBottom: "5%" }}>
          <InputGroup.Text>내용</InputGroup.Text>
          <FormControl
            as="textarea"
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ height: '100px' }}
          />
        </InputGroup>
        <InputGroup className="mb-3" style={{ marginBottom: "5%" }}>
          <InputGroup.Text>사진첨부</InputGroup.Text>
          <FormControl
            type="file"
            multiple
            onChange={(e) => setPhoto([...photo, ...e.target.files])}
          />
          {photo.map((image, index) => (
            <div key={index}>
              <img src={URL.createObjectURL(image)} alt={`image-${index}`} width="200" height="240" />
              <Button variant="danger" onClick={() => handlePhotoDelete(index)}>삭제</Button>
            </div>
          ))}
        </InputGroup>
        <Button variant="primary" type="submit" onClick={handleActivateEventCard}>
          등록완료
        </Button>
        <Button variant="secondary" type="button">취소</Button>
      </Form>
      {/* showEventCard 상태가 true이고 eventData가 있을 때만 EventCard를 렌더링 */}
      {showEventCard && eventData && <EventCard events={[eventData]} />}
    </div>
  );
};

export default ClubCreateEvent;
