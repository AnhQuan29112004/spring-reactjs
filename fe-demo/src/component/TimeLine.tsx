import dot_green_icon from "../assets/dot-green.svg";

export default function TimelineItem({ title, description, time, isLast }: any) {
  return (
    <div className="flex gap-3">
      {/* LEFT */}
      <div className="flex flex-col items-center pt-[5px]">
        {/* dot */}
        <img src={dot_green_icon} />

        {/* line chỉ xuất hiện nếu KHÔNG phải item cuối */}
        {!isLast && (
          <div className="flex-1 bg-[#0505050F] w-[2px]"></div>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex flex-col items-start pb-4 gap-[3px]">
        <p className="text-left text-bold-14">{title}</p>
        <p className="text-left text-black/90 text-normal-14">{description}</p>
        <p className="text-left text-medium text-[#909090]">{time}</p>
      </div>
    </div>
  );
};