import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import{ createBrowserRouter ,RouterProvider} from 'react-router-dom';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import QuestionForm from './components/QuestionForm.jsx';
import Header from './components/Header.jsx';
import Profile from './components/Profile.jsx';
import Home from './components/Home.jsx';
import Answer from './components/Answer.jsx'
import Summary from './components/Summary.jsx'
import ProfileSetup from './components/Profilesetup.jsx';
import EditQuestion from './components/Edit.jsx';
import PostAnswer from './components/PostAnswer.jsx'


const router = createBrowserRouter([
  {
    path:"/",
    element:<Home/>
  },
  {
    path:"/register",
    element:<Register/>
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
    path:"/dashboard",
    element:<Dashboard/>
  },
  {
    path:"/question",
    element:<QuestionForm/>
  },
  {
    path:"/profile",
    element:<Profile/>
  },
  {
    path:"/answer",
    element:<Answer/>
  },
  {
    path:"/summary/:questionId",
    element:<Summary/>
  },
  {
    path:"/profilesetup",
    element:<ProfileSetup/>
  },
  {
    path:"/edit/:questionId",
    element:<EditQuestion/>
  },
  {
    path:"/answers/:questionId",
    element:<PostAnswer/>
  },
  
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)
