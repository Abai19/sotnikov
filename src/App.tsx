import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Albums from './pages/albums';
import Todos from './pages/todos';
import Posts from './pages/posts';
import Header from './components/header';

function App() {
	
  return (
    <Router>
		<Header />
        <Routes>
          	<Route path="/" element={<Posts />} />
          	<Route path="/posts" element={<Posts />} />
          	<Route path="/todos" element={<Todos />} />
          	<Route path="/albums" element={<Albums />} />
        </Routes>
    </Router>
  )
}

export default App
