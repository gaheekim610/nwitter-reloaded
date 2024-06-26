import { useEffect, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom"

import { auth } from "./firebase";

import styled, { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

import Layout from "./components/layout";
import ProtectedRoute from "./components/protected-route";
import Home from "./routes/home";
import Profile from "./routes/profile";
import Login from "./routes/login";
import CreateAccount from "./routes/create-account";
import LoadingScreen from "./routes/loading-screen";
import ResetPassword from "./routes/reset-password";

const router = createBrowserRouter([
  {
    path: '/',
    element: ( 
      <ProtectedRoute>
        <Layout/>,
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Home/>
      },
      {
        path: 'profile',
        element: <Profile/>
      }
    ]
  },
  {
    path: '/login',
    element: <Login/>
  },
  {
    path: '/create-account',
    element: <CreateAccount/>
  },
  {
    path: '/reset-password',
    element: <ResetPassword/>
  }
]);

const GlobalStyles = createGlobalStyle`
  ${reset};
  * {
    box-sizing: border-box;
  }
  body {
    background-color: black;
    color: white;
    font-family: system-ui, apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
    sans-serif;
  }
`;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
`;


function App() {
  const [isLoading, setIsLoading] = useState(true);
  const init = async() => {
    await auth.authStateReady();
    // wait for firebase
    setIsLoading(false);
  }

  useEffect(() => {
    init();
  },[])

  return (
    <Wrapper>
      <GlobalStyles/>
      { isLoading ? <LoadingScreen/> : <RouterProvider router = {router}/> }
    </Wrapper>
  )
}

export default App
