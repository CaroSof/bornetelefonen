export default function AboutPage() {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-teal-700 mb-6">Om Børnetelefonen</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-teal-600 mb-4">Hvem er vi?</h2>
            <p className="text-gray-700 mb-4">
              Børnetelefonen er Danmarks største rådgivningstilbud for børn og unge. Vi er her for at lytte, støtte og hjælpe dig med alt det, der fylder i dit liv.
            </p>
            <p className="text-gray-700">
              Vores rådgivere er trænet i at tale med børn og unge om alle slags emner - store som små.
            </p>
          </div>
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-teal-600 mb-4">Vores løfte til dig</h2>
            <ul className="space-y-2 text-gray-700">
              <li>Du er altid 100% anonym</li>
              <li>Vi dømmer dig aldrig</li>
              <li>Vi lytter og tager dig seriøst</li>
              <li>Du bestemmer, hvad vi skal tale om</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }