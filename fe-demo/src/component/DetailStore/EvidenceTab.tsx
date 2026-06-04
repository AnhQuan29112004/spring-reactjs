import { useState } from "react";
import { DataTable, type Column } from "../DataTable";

export default function EvidenceTab(){
    const [currentPage, setCurrentPage] = useState(0);


    const data = {

        content:[
        {
            id:1,
            ma_vat_chung:'KKD3/2026',
            ten_vat_chung:'Kiểm kê tháng 3',
            loai_vat_chung:'Kiểm kê tháng 3',
            nhom_vat_chung:'Đột xuất',
            ma_vu_an:'2026-04-10 14:30:00',
            phan_loai:'ádasd',
            ten_vu_an:'ádasdasd'
        }
        ],
        totalPages:1,
        totalElements:1,
        number:0,
        first:true,
        last:false
    }
    

    const column: Column<any>[]=[
        {
        key:'ma_vat_chung',
        label:'Mã vật chứng',
        align:'left',
        render:(item:any)=>(
            <span
            className="text-sm text-semibold-14 align-middle underline text-[#0263D1] cursor-pointer"
            
            >
            {item.ma_vat_chung}
            </span>
        )
        },
        {
        key:'ten_vat_chung',
        label:'Tên vật chứng',
        render:(item:any)=>(
            <span className="text-normal-14">{item.ten_vat_chung}</span>
        )
        },
        {
        key:'loai_vat_chung',
        label:'Loại vật chứng',
        render:(item:any)=>(
            <span className="text-normal-14">{item.loai_vat_chung}</span>
        )
        },
        {
        key:'nhom_vat_chung',
        label:'Nhóm vật chứng',
        render:(item:any)=>(
            <span className="text-normal-14">{item.nhom_vat_chung}</span>
        )
        },
        {
        key:'ma_vu_an',
        label:'Mã vụ án',
        render:(item:any)=>(
            <span className="text-normal-14">{item.ma_vu_an}</span>
        )
        },
        {
        key:'phan_loai',
        label:'Phân loại',
        render:(item:any)=>(
            <span className="text-normal-14">{item.phan_loai}</span>
        )
        },
        {
        key:'ten_vu_an',
        label:'Tên vụ án',
        render:(item:any)=>(
            <span className="text-normal-14">{item.ten_vu_an}</span>
        )
        }
    ]

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < data.totalPages) {
        setCurrentPage(newPage);
        }
    };
    return (
        <DataTable 
            data={data}
            columns={column}
            onPageChange={handlePageChange}
        />
    )
}