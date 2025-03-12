import GradientText from "@/created-components/GradientText";

export default function Home() {
  return (
    <div className="relative pt-32">
      <div className="absolute top-5 right-5 flex gap-4">
        <button className="py-2 px-4 rounded-full bg-[#1C3373] text-white hover:bg-[#162b5e] hover:scale-105 transition-transform duration-200">
          Cadastre-se
        </button>
        <button className="py-2 px-4 rounded-full bg-white text-black hover:bg-[#f0f0f0] hover:scale-105 transition-transform duration-200">
          Entre
        </button>
      </div>

      <div className="flex flex-col gap-6 p-6">
        <div className="text-center text-7xl font-black leading-tight">
          <span>Uma ferramenta que</span> revolucionará seus{" "}
          <GradientText size="text-7xl" weight="font-black">
            projetos.
          </GradientText>
        </div>

        <div className="text-center mt-6 mb-4">
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
          <button className="py-3 px-6 rounded-full bg-[#1C3373] text-white text-lg hover:bg-[#162b5e] hover:scale-105 transition-transform duration-200 mx-auto block">
            Comece sua jornada conosco
          </button>
        </div>
      </div>
    </div>
  );
}
