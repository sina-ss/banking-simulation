import LoanApplicationForm from "@/components/LoanApplicationForm";
import { FlipWords } from "@/components/ui/flip-words";
import { TEXT } from "@/constants/textConstants";

export default function Home() {
  return (
    <main>
      <div className="flex justify-center items-center">
        <div className="text-2xl md:text-4xl font-normal text-neutral-600 dark:text-neutral-400">
          {TEXT.HOME.HERO_TITLE}
          <FlipWords words={TEXT.HOME.WORDS} />
          {TEXT.HOME.HERO_SUB_TITLE}
        </div>
      </div>
      <section className="flex justify-center items-center mt-12 md:mt-24">
        <LoanApplicationForm />
      </section>
    </main>
  );
}
