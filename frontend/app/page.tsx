import GradientText from "@/created-components/GradientText";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="absolute top-5 right-5 flex gap-4">
        <Link
          href="/cadastro"
          className="py-2 px-4 rounded-full bg-[#1C3373] text-white hover:bg-[#162b5e] hover:scale-105 transition-transform duration-200"
        >
          Cadastre-se
        </Link>
        <Link
          href="/login"
          className="py-2 px-4 rounded-full bg-white text-black hover:bg-[#f0f0f0] hover:scale-105 transition-transform duration-200"
        >
          Entre
        </Link>
      </div>

      <div className="flex flex-col gap-6 p-6 text-center">
        <div className="text-7xl font-black leading-tight">
          <span>Uma ferramenta que</span> revolucionará seus{" "}
          <GradientText size="text-7xl" weight="font-black">
            projetos.
          </GradientText>
        </div>

        <div className="mt-6 mb-4">
          <h3 className="text-xl px-32">
            Transforme suas ideias em realidade com nossa plataforma intuitiva e
            poderosa.
          </h3>
          <h3 className="text-xl px-32 mt-2">
            Desenvolva suas criações com facilidade e eficiência, do início ao
            fim.
          </h3>
        </div>

        <div className="mt-6">
          <Link
            href="/cadastro"
            className="py-3 px-4 rounded-full bg-[#1C3373] text-white text-lg hover:bg-[#162b5e] hover:scale-105 transition-transform duration-200 mx-auto block w-fit"
          >
            Comece sua jornada conosco
          </Link>
        </div>
      </div>
    </div>
  );
}
