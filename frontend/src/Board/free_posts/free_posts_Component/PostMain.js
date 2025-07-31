import PostList from "./PostList.js";
import { Route, Routes, Link } from "react-router-dom";
import PostView from "./PostView.js";
import WritePost from "./WritePost.js";
import PostForm from "./PostForm.js";
import "../free_posts_Style/PostMain.css";
const PostMain = () => {
  // const [searchTerm, setSearchTerm] = useState("");
  // const [filteredSearchTerm, setFilteredSearchTerm] = useState("");
  // const handleSearchChange = (e) => {
  //   setSearchTerm(e.target.value);
  // };
  // const handleSearch = () => {
  //   setFilteredSearchTerm(searchTerm);
  // };

  return (
    <div className="content-provider">
      <Routes>
        {/* 게시판 */}
        <Route path="/" element={<PostList />} />

        {/* 글쓰기 */}
        {/* <Route path='write' element={<PostForm />} />   */}
        <Route path="write" element={<WritePost />} />

        {/* 특정 게시글 */}
        <Route path="postView/:postId" element={<PostView />} />
        {/* <Route path='write' element={<WritePost />} /> */}

        {/* 게시글 수정 */}
        <Route path="postView/:postId/edit" element={<PostForm />} />
      </Routes>
    </div>
  );
};

export default PostMain;
