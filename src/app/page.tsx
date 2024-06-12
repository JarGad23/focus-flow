import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <section>
      <Navbar />
      <div className="px-4 sm:px-6 lg:px-8">
        Main Page
        <Button>Main Button</Button>
      </div>
    </section>
  );
}
