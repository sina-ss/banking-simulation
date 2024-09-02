import { FlipWords } from "@/components/ui/flip-words";
import { TEXT } from "@/constants/textConstants";

export default function Home() {
  return (
    <main className="">
      <div className="flex justify-center items-center px-4">
        <div className="text-4xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
          سیزا
          <FlipWords words={TEXT.HOME.WORDS} /> <br />
        </div>
      </div>
    </main>
  );
}
