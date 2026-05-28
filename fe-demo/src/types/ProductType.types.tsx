export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface PtoductFilterValues{
  cap_kho?:string;
  trang_thai?:string;
  don_vi_quan_ly?:string;
  can_bo_quan_ly?:string
}