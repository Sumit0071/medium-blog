
import './App.css'
import { Signin } from './pages/signin'
import { Signup } from './pages/signup'
import { Blog } from './pages/blog'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  

  return (
    <>
      <BrowserRouter>
        <ToastContainer/>
        <Routes>
          <Route path="/signup" element={<Signup/>}  />
          <Route path="/signin" element={<Signin/>} />
          <Route path="/blog/:id" element={<Blog/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
