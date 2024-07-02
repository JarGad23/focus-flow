import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <section>
      <Navbar />
      <MaxWidthWrapper>
        <div className="pt-40 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="w-[65%] flex flex-col gap-y-2">
              <h1 className="text-5xl">
                <span className="text-primary">F</span>ocus
                <span className="text-primary">F</span>low
              </h1>
              <div className="flex flex-col gap-y-4">
                <h2 className="text-5xl font-bold leading-relaxed">
                  Plan your day to maximize your <br />
                  <span className="bg-primary text-white p-2">Focus</span> on
                  work.{" "}
                </h2>
                <p>
                  FocusFlow is designed to make your day-to-day and weekly
                  planning a breeze. With our intuitive interface, you can
                  quickly create tasks and events to ensure you stay on top of
                  your schedule. Every feature in FocusFlow is free and
                  user-friendly, crafted to help you achieve your goals without
                  the hassle.
                </p>
              </div>
            </div>
            <div>{/* Image */}</div>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
