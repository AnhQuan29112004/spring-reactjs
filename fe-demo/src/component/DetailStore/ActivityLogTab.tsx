import { useState } from "react";
import { DataTable, type Column } from "../DataTable";
import DateInput from '../DateInput'
import SearchBar from "../SearchBar";
import { debounceTime, Subject, Subscription, distinctUntilChanged } from "rxjs";

export default function AvtivityLogTax(){
    const [currentPage, setCurrentPage] = useState(0);
    const [startDate, setStartDate] = useState<Date | undefined>(new Date())
    const [endDate, setEndDate] = useState<Date | undefined>(new Date())
    const [openStartDate, setOpenStartDate] = useState(false);
    const [openEndDate, setOpenEndDate] = useState(false);
    const [search, setSearch] = useState('');
    const searchSubject = new Subject<string>();

    const toggleStartDate = () => setOpenStartDate(prev => !prev);
    const toggleEndDate = () => setOpenEndDate(prev => !prev);

    const data = {

        content:[
        {
            id:1,
            nguoi_thuc_hien:'asdasdas',
            hoat_dong:'asdasdasd',
            thoi_gian:'2026-04-10 14:30:00'
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
        key:'nguoi_thuc_hien',
        label:'Người thực hiện',
        align:'left',
        render:(item:any)=>(
            <span
            className="text-sm text-semibold-14 align-middle underline text-[#0263D1] cursor-pointer"
            
            >
            {item.nguoi_thuc_hien}
            </span>
        )
        },
        {
        key:'hoat_dong',
        label:'Hoạt động',
        render:(item:any)=>(
            <span className="text-normal-14">{item.hoat_dong}</span>
        )
        },
        {
        key:'thoi_gian',
        label:'Thời gian',
        render:(item:any)=>(
            <span className="text-ibm-mono-14">{item.thoi_gian}</span>
        )
        }
    ]

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < data.totalPages) {
        setCurrentPage(newPage);
        }
    };

    return (
        <div className="flex flex-col gap-5 w-full">
            <div className="flex gap-[50px] items-center">
                <SearchBar search={search} handleSearchChange={setSearch} placeholder="Tìm kiếm theo người thực hiện hoặc hoạt động"/>
                <div className="flex gap-1.5 items-center">

                <DateInput isOpen={openStartDate} date={startDate} setOpen={toggleStartDate} setDate={setStartDate}/>
                <span className="text-normal-14">-</span>
                <DateInput isOpen={openEndDate} date={endDate} setOpen={toggleEndDate} setDate={setEndDate}/>
                </div>
            </div>
            <DataTable 
                data={data}
                columns={column}
                onPageChange={handlePageChange}
            />
        </div>
    )
}