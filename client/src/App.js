import logo from './logo.svg';
import './App.css';
import NavBar from './components/Navbar';
import {BrowserRouter,Route} from 'react-router-dom';
import Home from './components/screens/Home';
import Profile from './components/screens/Profile';
import Login from './components/screens/Login';
import Signup from './components/screens/Signup';
import CreatePost from './components/screens/createPost';
import UserProfile from './components/screens/UserProfile';
import FollowingPosts from './components/screens/FollowingPosts';
import Reset from './components/screens/Reset';
import NewPassword from './components/screens/NewPassword';

function App() {
  return (
    <BrowserRouter>
    <NavBar/>
    <Route exact path="/">
      <Home/>
    </Route>
    <Route path="/login">
      <Login/>
    </Route>
    <Route path="/signup">
      <Signup/>
    </Route>
    <Route exact path="/profile">
      <Profile/>
    </Route>
    <Route path="/create">
      <CreatePost/>
    </Route>
    <Route path="/profile/user/:userid">
      <UserProfile/>
    </Route>
    <Route path="/home">
      <FollowingPosts/>
    </Route>
    <Route exact path="/reset-password">
      <Reset/>
    </Route>
    <Route path="/reset-password/:token">
      <NewPassword/>
    </Route>
    </BrowserRouter>
  );
}

export default App;
