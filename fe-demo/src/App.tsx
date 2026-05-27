import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./page/Login";
import Register from "./page/Register";
import Home from "./page/Home";
import Store from "./page/Store";
import CommandManagementPage from "./page/CommandManagement";
import UserAdmin from "./page/UserAdmin";
import PrivateRoute from "./component/PrivateRoute";
import { Layout } from "./component/Layout";
import { PopupProvider } from "./component/PopupProvider";
import CreateCommand from "./page/CreateCommand";
import DetailCommand from "./page/DetailCommand";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>

      <PopupProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout>
                    <Home />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/quan-ly-lenh/tiep-nhan-van-ban"
              element={
                <PrivateRoute vanThuOnly>
                  <Layout>
                    <CreateCommand />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/quan-ly-lenh/chi-tiet-van-ban/:id"
              element={
                <PrivateRoute vanThuOnly>
                  <Layout>
                    <DetailCommand />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/store"
              element={
                <PrivateRoute lanhDaoOnly>
                  <Layout>
                    <Store />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/quan-ly-lenh"
              element={
                <PrivateRoute vanThuOnly>
                  <Layout>
                    <CommandManagementPage />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute lanhDaoOnly>
                  <Layout>
                    <UserAdmin />
                  </Layout>
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </PopupProvider>
    </QueryClientProvider>
  );
}
