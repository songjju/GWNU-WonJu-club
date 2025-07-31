import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="notfound-title">404</h1>
        <p className="notfound-lead">페이지를 찾을 수 없습니다.</p>
        <p className="notfound-text">
          원하는 페이지를 찾을 수 없습니다. 다시 시도하거나 홈페이지로
          돌아가세요.
        </p>
        <Link to="/" className="notfound-button">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
