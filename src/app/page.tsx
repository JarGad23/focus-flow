import { Footer } from "@/components/footer";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <section className="w-full h-full bg-slate-50">
      <Navbar />
      <MaxWidthWrapper className="h-auto xl:h-[calc(100%-4rem)] max-w-screen-2xl">
        <div className="pt-12 lg:pt-28 flex flex-col">
          <div className="flex flex-col gap-y-12 xl:flex-row xl:justify-between xl:gap-x-12">
            <div className="w-full xl:w-1/2 flex flex-col gap-y-2 px-8 xl:px-0">
              <h1 className="text-center xl:text-left text-4xl hidden lg:block">
                <span className="text-primary">F</span>ocus
                <span className="text-primary">F</span>low
              </h1>
              <div className="w-full mx-auto flex flex-col items-center text-center xl:text-left xl:items-start gap-y-8">
                <h2 className="leading-snug md:leading-snug lg:leading-snug text-5xl lg:text-6xl font-bold">
                  Plan your day to maximize your <br />
                  <span className="bg-primary text-white p-1 lg:p-2">
                    Focus
                  </span>
                  and productivity
                </h2>
                <p className="text-lg text-neutral-900 font-[500]">
                  FocusFlow is designed to make your day-to-day and weekly
                  planning a breeze. With our intuitive interface, you can
                  quickly create tasks and events to ensure you stay on top of
                  your schedule.
                </p>
                <div className="flex flex-col text-center gap-y-2">
                  <div className="flex items-center gap-x-2 font-semibold">
                    <Check className="text-green-500 size-5" />
                    Full functionality, Completely Free.
                  </div>
                  <div className="flex items-center gap-x-2 font-semibold">
                    <Check className="text-green-500 size-5" />
                    User-Friendly Interface for Easy Planning.
                  </div>
                  <div className="flex items-center gap-x-2 font-semibold">
                    <Check className="text-green-500 size-5" />
                    Modern design.
                  </div>
                  <div className="flex items-center gap-x-2 font-semibold">
                    <Check className="text-green-500 size-5" />
                    Effortless Planning, Maximum Productivity.
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full xl:w-1/2 relative">
              <Image
                alt="board"
                src="/board.PNG"
                width={700}
                height={500}
                quality={100}
                className="w-3/4 xl:w-full mx-auto shadow-xl rounded-lg"
              />
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
      <div className="w-full bg-slate-200 mt-8 xl:mt-0 pb-24">
        <MaxWidthWrapper>
          <div className="w-full flex flex-col items-center pt-28 px-8">
            <h3 className="text-center text-5xl xl:text-6xl font-bold text-neutral-900">
              What users say about <span className="text-primary">F</span>ocus
              <span className="text-primary">F</span>low
            </h3>
            <div className="w-full flex flex-col gap-y-8 lg:flex-row lg:gap-x-20 mt-24">
              <div className="w-full lg:w-1/2 flex flex-col gap-y-6">
                <p className="text-justify text-lg font-[500] text-neutral-900">
                  &quot;FocusFlow has{" "}
                  <span className="text-primary">
                    transformed the way I plan my days
                  </span>
                  . The ease of use and intuitive design make it a joy to use. I
                  can&apos;t imagine managing my tasks without it! I highly
                  recommend that app for anyone looking to improve their
                  productivity.&quot;
                </p>
                <div className="w-full flex justify-between">
                  <div className="relative flex items-center gap-x-4">
                    <Image
                      alt="user"
                      src="/user-img.png"
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    <div className="flex flex-col">
                      <p className="font-bold">Emilly</p>
                      <span className="text-sm flex items-center gap-x-2 text-muted-foreground">
                        <Check className=" text-green-500 size-4" />
                        Verified User
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-x-1">
                    <Star className="text-primary fill-primary size-4" />
                    <Star className="text-primary fill-primary  size-4" />
                    <Star className="text-primary fill-primary  size-4" />
                    <Star className="text-primary fill-primary  size-4" />
                    <Star className="text-primary fill-primary  size-4" />
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 flex flex-col gap-y-6">
                <p className="text-justify text-lg font-[500] text-neutral-900">
                  &quot;I love how FocusFlow allows me to plan my month with
                  events and my week with tasks. It&apos;s the perfect tool to
                  stay organized and focused on my work. The best part about
                  FocusFlow is the{" "}
                  <span className="text-primary">
                    interface is incredibly user-friendly
                  </span>
                  .&quot;
                </p>
                <div className="w-full flex justify-between">
                  <div className="relative flex items-center gap-x-4">
                    <Image
                      alt="user"
                      src="/user-img.png"
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    <div className="flex flex-col">
                      <p className="font-bold">Andrew</p>
                      <span className="text-sm flex items-center gap-x-2 text-muted-foreground">
                        <Check className=" text-green-500 size-4" />
                        Verified User
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-x-1">
                    <Star className="text-primary fill-primary size-4" />
                    <Star className="text-primary fill-primary  size-4" />
                    <Star className="text-primary fill-primary  size-4" />
                    <Star className="text-primary fill-primary  size-4" />
                    <Star className="text-primary fill-primary  size-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative w-full flex flex-col gap-y-8 lg:flex-row gap-x-20 mt-16">
            <div className="w-full lg:w-[60%] bg-neutral-100 rounded-lg p-4 shadow-lg">
              <Image
                alt="creation task"
                src="/task-creation.PNG"
                width={700}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="w-full lg:w-[40%] bg-neutral-100 rounded-lg p-4 shadow-lg">
              <Image
                alt="creation task"
                src="/task-review.PNG"
                width={700}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
          <div className="w-full flex justify-center mt-12">
            <Link href="/dashboard">
              <Button size="lg">
                Start planning your days now <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </MaxWidthWrapper>
      </div>
      <Footer />
    </section>
  );
}
