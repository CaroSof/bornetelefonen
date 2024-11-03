/**
 * Footer komponent til hjemmesiden
 */
const Footer = () => {
    return (
        <footer className="bg-teal-100 text-teal-700 p-6 mt-8">
            {/* Container til centrering af indhold */}
            <div className="container mx-auto text-center">
                {/* Copyright tekst */}
                <p className="mb-2">&copy; 2023 Børnetelefonen. Alle rettigheder forbeholdes.</p>
                {/* Navigation links */}
                <div className="flex justify-center space-x-4">
                    <a href="#" className="hover:text-teal-500 transition-colors">Privatlivspolitik</a>
                    <a href="#" className="hover:text-teal-500 transition-colors">Vilkår for brug</a>
                    <a href="#" className="hover:text-teal-500 transition-colors">Cookie-politik</a>
                </div>
            </div>
        </footer>
    )
}

export default Footer