import { path } from "framer-motion/client";

export const routes = [
  {
    path: "/",
    breadcrumb: "Trang chủ",
  },
  {
    path: "/quan-ly-kho",
    breadcrumb: "Quản lý kho",
    disabled:true
  },
  {
    path: "/quan-ly-kho/danh-sach-kho",
    breadcrumb: "Danh sách kho",
  },
  {
    path: "/quan-ly-lenh",
    breadcrumb: "Quản lý lệnh",
  },
  {
    path: "/quan-ly-lenh/tiep-nhan-van-ban",
    breadcrumb: "Tiếp nhận văn bản",
  },
  {
    path: "/quan-ly-lenh/chi-tiet-van-ban",
    breadcrumb: "Chi tiết văn bản",
    appendId: true,
  },
  {
    path: "/quan-ly-lenh/chi-tiet-van-ban/chinh-sua-van-ban",
    breadcrumb: "Chỉnh sửa văn bản",
    appendId: true,
  },
  {
    path:"/quan-ly-kho/danh-sach-kho/them-moi-kho",
    breadcrumb:"Thêm mới kho vật chứng/tài liệu, đồ vật"
  },
  {
    path:"/quan-ly-kho/danh-sach-kho/chi-tiet-kho",
    breadcrumb:"Chi tiết kho"
  }
];