export interface StoreState{
    ma_kho?:string;
    ten_kho?:string;
    cap_kho?:string;
    don_vi_quan_ly?:string;
    tinh_thanh?:string;
    phuong_xa?:string;
    dia_chi?:string;
    trang_thai?:string;
    ghi_chu?:string;
    nhan_su?:{
        username?:string,
        role?:string
    }[];
    storage_tree?: any[];
}