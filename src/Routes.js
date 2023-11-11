import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Ecommerce/Home';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import VerifyEmail from './components/Auth/VerifyEmail';
import Logoff from './components/Auth/Logoff';
import CreateProduct from './components/Admin/CreateProduct';
import CreateCategory from './components/Admin/CreateCategory';
import AdminDashboard from './components/Admin/AdminDashboard';
import UploadImages from './components/Admin/UploadImages';
import EditProducts from './components/Admin/EditProducts';
import EditCategories from './components/Admin/EditCategories';
import EditUsers from './components/Admin/EditUsers';
import Password from './components/Auth/Password';
import Profile from './components/Ecommerce/Profile';
import ForgotPassword from './components/Auth/ForgotPassword';

function AppRoutes({ isAdmin }) {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/logoff" element={<Logoff />} />
      <Route path="/verifyemail" element={<VerifyEmail />} />
      <Route path="/password" element={<Password />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      {isAdmin ? (
        <>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/editProducts" element={<EditProducts />} />
          <Route path="/admin/editCategories" element={<EditCategories />} />
          <Route path="/admin/editUsers" element={<EditUsers />} />
          <Route path="/admin/createproduct" element={<CreateProduct />} />
          <Route path="/admin/createcategory" element={<CreateCategory />} />
          <Route path="/admin/uploads" element={<UploadImages />} />
        </>
      ) : (
        <Route path="/" element={<Navigate replace to="/login" />} />
      )}
    </Routes>
  );
}

export default AppRoutes;
