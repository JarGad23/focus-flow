"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { CreateCalendar } from "./_components/create-calendar";
import { CreateForm } from "./_components/create-form";

const Page = () => {
  const [date, setDate] = useState(new Date());
  const searchParams = useSearchParams();

  const type = searchParams.get("type") || "";
  return (
    <div className="w-full p-4 lg:p-8 flex flex-col lg:flex-row gap-y-4 gap-x-8">
      <CreateCalendar date={date} setDate={setDate} />
      <CreateForm type={type} date={date} />
    </div>
  );
};

export default Page;
