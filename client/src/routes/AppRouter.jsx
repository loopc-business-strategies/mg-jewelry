import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';

import HomePage from '../pages/HomePage';
import ShopPage from '../pages/ShopPage';
import CategoryPage from '../pages/CategoryPage';
import ProductPage from '../pages/ProductPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ProfilePage from '../pages/ProfilePage';
import WishlistPage from '../pages/WishlistPage';
import SearchPage from '../pages/SearchPage';
import ManufacturingPage from '../pages/ManufacturingPage';
import CustomJewelryPage from '../pages/CustomJewelryPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import BlogPage from '../pages/BlogPage';
import BlogPostPage from '../pages/BlogPostPage';
import WholesalePage from '../pages/WholesalePage';
import WholesaleRegisterPage from '../pages/WholesaleRegisterPage';
import WholesaleShopPage from '../pages/WholesaleShopPage';
import WholesaleDashboardPage from '../pages/WholesaleDashboardPage';
import {
  PrivacyPage, TermsPage, RefundPage, ShippingPolicyPage,
  FAQPage, ShippingPage, ReturnsPage, TrackOrderPage,
} from '../pages/LegalPages';

import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminWholesale from '../pages/admin/AdminWholesale';
import AdminCustomers from '../pages/admin/AdminCustomers';
import AdminSettings from '../pages/admin/AdminSettings';
import AdminBlog from '../pages/admin/AdminBlog';

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="shop/:slug" element={<CategoryPage />} />
        <Route path="product/:id" element={<ProductPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="manufacturing" element={<ManufacturingPage />} />
        <Route path="custom-jewelry" element={<CustomJewelryPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:slug" element={<BlogPostPage />} />
        <Route path="wholesale" element={<WholesalePage />} />
        <Route path="wholesale/register" element={<WholesaleRegisterPage />} />
        <Route path="wholesale/shop" element={<WholesaleShopPage />} />
        <Route path="wholesale/dashboard" element={<WholesaleDashboardPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="refund-policy" element={<RefundPage />} />
        <Route path="shipping-policy" element={<ShippingPolicyPage />} />
        <Route path="shipping" element={<ShippingPage />} />
        <Route path="returns" element={<ReturnsPage />} />
        <Route path="faq" element={<FAQPage />} />
        <Route path="track-order" element={<TrackOrderPage />} />
      </Route>

      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="wholesale" element={<AdminWholesale />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="blog" element={<AdminBlog />} />
      </Route>
    </Routes>
  );
}
