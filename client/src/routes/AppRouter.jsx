import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';

import HomePage from '../pages/HomePage';
import ProductsPage from '../pages/ProductsPage';
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
import AboutPage from '../pages/AboutPage';
import ManufacturingPage from '../pages/ManufacturingPage';
import MarketsPage from '../pages/MarketsPage';
import GoldBuyingPage from '../pages/GoldBuyingPage';
import ContactPage from '../pages/ContactPage';
import BlogPage from '../pages/BlogPage';
import BlogPostPage from '../pages/BlogPostPage';
import BuyersPage from '../pages/BuyersPage';
import BuyerRegisterPage from '../pages/BuyerRegisterPage';
import BuyerDashboardPage from '../pages/BuyerDashboardPage';
import RFQPage from '../pages/RFQPage';
import CustomJewelryPage from '../pages/CustomJewelryPage';
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
import AdminBuyers from '../pages/admin/AdminBuyers';
import AdminGoldBuying from '../pages/admin/AdminGoldBuying';
import AdminRFQs from '../pages/admin/AdminRFQs';
import AdminQuotes from '../pages/admin/AdminQuotes';
import AdminCustomers from '../pages/admin/AdminCustomers';
import AdminSettings from '../pages/admin/AdminSettings';
import AdminBlog from '../pages/admin/AdminBlog';

function ShopSlugRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/products/${slug}`} replace />;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:slug" element={<ProductsPage />} />
        <Route path="shop" element={<Navigate to="/products" replace />} />
        <Route path="shop/:slug" element={<ShopSlugRedirect />} />
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
        <Route path="markets" element={<MarketsPage />} />
        <Route path="gold-buying" element={<GoldBuyingPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:slug" element={<BlogPostPage />} />
        <Route path="buyers" element={<BuyersPage />} />
        <Route path="buyers/register" element={<BuyerRegisterPage />} />
        <Route path="buyers/dashboard" element={<BuyerDashboardPage />} />
        <Route path="rfq" element={<RFQPage />} />
        <Route path="wholesale" element={<Navigate to="/buyers" replace />} />
        <Route path="wholesale/register" element={<Navigate to="/buyers/register" replace />} />
        <Route path="wholesale/dashboard" element={<Navigate to="/buyers/dashboard" replace />} />
        <Route path="wholesale/shop" element={<WholesaleShopPage />} />
        <Route path="custom-jewelry" element={<CustomJewelryPage />} />
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
        <Route path="gold-buying" element={<AdminGoldBuying />} />
        <Route path="buyers" element={<AdminBuyers />} />
        <Route path="rfqs" element={<AdminRFQs />} />
        <Route path="quotes" element={<AdminQuotes />} />
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
