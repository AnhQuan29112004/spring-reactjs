import { useState } from "react"

export default function Overview(){
    
    return (
        <div className="w-full flex flex-col border border-[#0505050F]">
            <div className="grid grid-cols-2 w-full">
                <div className="flex w-full">
                    <div className="w-[25%] py-4 pl-6 bg-[#00000005] border-r border-[#0505050F]">
                        <span className="text-semibold-14 no-underline flex justify-start items-center text-[#000000A6]">Mã kho</span>
                    </div>
                    <div className="w-[75%] py-4 pl-6 border-r border-[#0505050F]">
                        <span className="text-ibm-mono-14 font-semibold text-[#1E5631] flex justify-start items-center">KC-CATPHB-001</span>  
                    </div>
                </div>
                <div className="flex w-full">
                    <div className="w-[25%] py-4 pl-6 bg-[#00000005] border-r border-[#0505050F]">
                        <span className="text-semibold-14 no-underline flex justify-start items-center text-[#000000A6]">Tên kho</span>
                    </div>
                    <div className="w-[75%] py-4 pl-6 border-r border-[#0505050F]">
                        <span className="text-semibold-14 text-[#000000E0] no-underline flex justify-start items-center">Kho vật chứng Công an Thành phố Hà Nội - Khu A</span>  
                    </div>
                </div>
            </div>
        </div>
    )
}