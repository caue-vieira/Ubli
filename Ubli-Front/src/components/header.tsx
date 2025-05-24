export default function Header() {
  return (
    <header className="bg-blue-900  text-white p-4 shadow-md w-full h-20">
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-between w-full">
        <h1 className="text-xl font-bold">Ubli</h1>
        <form className="flex w-full max-w-md mx-4">
          <input
            type="text"
            placeholder="Buscar locais acessíveis..."
            className="flex-1 px-4 py-2 rounded-l-md bg-amber-50 text-black focus:outline-none"
          />
          <button
            type="submit"
            className="bg-blue-700 first-letter:blur-x4 hover:bg-blue-600 px-4 py-2 rounded-r-md"
          >
            Buscar
          </button>
        </form>
      </div>
    </header>
  );
}
