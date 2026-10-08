import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LoginRedirect from '../components/LoginRedirect';

import HomePage from '../pages/HomePage';
import ShopPage from '../pages/ShopPage';
import CategoryPage from '../pages/CategoryPage';
import ProductPage from '../pages/ProductPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import SearchPage from '../pages/SearchPage';
import GoldBuyingPage from '../pages/GoldBuyingPage';
import CustomJewelryPage from '../pages/CustomJewelryPage';
import AboutPage from '../pages/AboutPage';
import OurMGPage from '../pages/OurMGPage';
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

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="shop/:slug" element={<CategoryPage />} />
        <Route path="product/:id" element={<ProductPage />} />
        <Route path="cart" element={<Navigate to="/shop" replace />} />
        <Route path="checkout" element={<Navigate to="/shop" replace />} />
        <Route path="wishlist" element={<Navigate to="/shop" replace />} />
        <Route path="login" element={<LoginRedirect />} />
        <Route path="signup" element={<LoginRedirect mode="signup" />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="profile" element={<Navigate to="/" replace />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="gold-buying" element={<GoldBuyingPage />} />
        <Route path="manufacturing" element={<Navigate to="/custom-jewelry" replace />} />
        <Route path="custom-jewelry" element={<CustomJewelryPage />} />
        <Route path="our-mg" element={<OurMGPage />} />
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

      <Route path="admin/*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
