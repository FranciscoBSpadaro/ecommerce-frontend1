import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Ecommerce/Home';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import VerifyEmail from './components/Auth/VerifyEmail';
import Logoff from './components/Auth/Logoff';
import CreateProduct from './components/Ecommerce/CreateProduct'
import CreateCategory from './components/Ecommerce/CreateCategory'
import AdminDashboard from './components/Admin/AdminDashboard'
import EditProducts from './components/Admin/EditProducts'
import EditCategories from './components/Admin/EditCategories'
import EditUsers from './components/Admin/EditUsers'
import Password from './components/Auth/Password'
import Profile from './components/Ecommerce/Profile'
import ForgotPassword from './components/Auth/ForgotPassword'


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/logoff" element={<Logoff />} />
      <Route path="/verifyemail" element={<VerifyEmail />} />
      <Route path="/createproduct" element={<CreateProduct />} />
      <Route path="/createcategory" element={<CreateCategory />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/EditProducts" element={<EditProducts />} />
      <Route path="/admin/EditCategories" element={<EditCategories />} />
      <Route path="/admin/EditUsers" element={<EditUsers />} />
      <Route path="/password" element={<Password />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      {/* Defina outras rotas aqui */}
    </Routes>
  );
};

export default AppRoutes;
