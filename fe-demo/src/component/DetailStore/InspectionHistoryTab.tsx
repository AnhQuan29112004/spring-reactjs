import { useState } from "react";
import { DataTable, type Column } from "../DataTable";
import DateInput from '../DateInput'
import SearchBar from "../SearchBar";
import { debounceTime, Subject, Subscription, distinctUntilChanged } from "rxjs";

export default function InspectionHistoryTab(){

    const [currentPage, setCurrentPage] = useState(0);
    const [startDate, setStartDate] = useState<Date | undefined>(new Date())
    const [endDate, setEndDate] = useState<Date | undefined>(new Date())
    const [openStartDate, setOpenStartDate] = useState(false);
    const [openEndDate, setOpenEndDate] = useState(false);
    const [search, setSearch] = useState('');
    const searchSubject = new Subject<string>();
    const toggleStartDate = () => setOpenStartDate((prev) => !prev);
    const toggleEndDate = () => setOpenEndDate((prev) => !prev);

  const getClassCssLoaiKiemKe = (value:string) =>{
    if(value === 'Theo kỳ'){
      return 'rounded bg-[#E5F3FF] py-[2px] px-3 text-semibold-12 text-[#1890FF]'
    }
    return 'rounded bg-[#FEF3E6] py-[2px] px-3 text-semibold-12 text-[#FA8C16]' 
  }

  const data = {

    content:[
      {
        id:1,
        ma_kiem_tra:'KKD3/2026',
        ten_dot_kiem_tra:'Kiểm tra đột xuất',
        thoi_gian_kiem_tra:'2026-04-10 14:30:00'
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
      key:'ma_kiem_tra',
      label:'Mã kiểm tra',
      align:'left',
      render:(item:any)=>(
        <span
          className="text-sm text-semibold-14 align-middle underline text-[#0263D1] cursor-pointer"
          
        >
          {item.ma_kiem_tra}
        </span>
      )
    },
    {
      key:'ten_dot_kiem_tra',
      label:'Tên đợt kiểm tra',
      render:(item:any)=>(
        <span className="text-normal-14">{item.ten_dot_kiem_tra}</span>
      )
    },
    {
      key:'thoi_gian_kiem_tra',
      label:'Thời gian kiểm tra',
      render:(item:any)=>(
        <span className="text-ibm-mono-14">{item.thoi_gian_kiem_tra}</span>
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
            <SearchBar search={search} handleSearchChange={setSearch} placeholder="Tìm kiếm theo mã kiểm tra hoặc tên đợt kiểm tra"/>
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