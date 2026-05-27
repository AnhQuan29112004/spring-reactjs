import home from "../assets/home.svg";
import store from "../assets/store.svg";
import quan_ly_lenh from "../assets/quan-ly-lenh.svg";
import { isLanhDao, isThuKho, isVanThu } from "../util/token";

export const menuItems = {
    'LanhDao':[
        { to: "/", label: "Trang chủ", icons: home },
        { to: "/store", label: "Danh sách kho", icons:store },
    ],
    'VanThu':[
        { to: "/", label: "Trang chủ", icons: home },
        { to: "/quan-ly-lenh", label: "Quản lý lệnh", icons:quan_ly_lenh },
    ],
    'ThuKho':[
        { to: "/", label: "Trang chủ", icons: home },
        { to: "/store", label: "Danh sách kho", icons:store },
    ]
}

export const getMenu = () =>{
    if(isLanhDao()){
        return menuItems['LanhDao'];
    }
    else if (isThuKho()){
        return menuItems['ThuKho'];
    }
    else {
        return menuItems['VanThu'];
    }
}
