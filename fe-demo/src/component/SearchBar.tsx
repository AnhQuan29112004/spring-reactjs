import search_icon from '../assets/search-icon.svg'
export default function SearchBar({search, handleSearchChange, placeholder}:{
    search:string,
    handleSearchChange:(value:string)=>void
    placeholder?:string
}){
    return(
        <div className="relative flex w-2/5 items-center">
          <div className="absolute left-3">
            <img src={search_icon} alt="" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={placeholder?placeholder:"Tìm kiếm văn bản"}
            className="h-11 w-full rounded-[8px] border border-[#D9D9D9] bg-white px-8 text-sm text-[#222222] outline-none transition placeholder:font-ibm focus:border-[#00854C]"
          />
        </div>
    )
}