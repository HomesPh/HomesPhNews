export default function AboutUsPage() {
    const teamMembers = [
        {
            name: 'Jomari Marson',
            role: 'Team Leader & Full Stack Developer',
            initials: 'JM'
        },
        {
            name: 'Friollan Kim Edem',
            role: 'Full Stack Developer',
            initials: 'FK'
        },
        {
            name: 'Angela Postrero',
            role: 'Full Stack Developer',
            initials: 'AP'
        },
        {
            name: 'Mark Jess Anthony Enfermo',
            role: 'Full Stack Developer',
            initials: 'ME'
        },
        {
            name: 'Ranidel Padoga',
            role: 'Full Stack Developer',
            initials: 'RP'
        },
    ];

    return (
        <div className="min-h-screen bg-[#f9fafb] dark:bg-[#030712] transition-colors duration-300">
            {/* Hero Section */}
            <section className="relative bg-[#030213] text-white py-20 md:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
                <div className="relative max-w-[1280px] mx-auto px-4 text-center z-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400">
                        Empowering Global Perspectives
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed font-light">
                        HomesTV connects you with stories that matter. We function as a bridge between local insights and the global stage.
                    </p>
                </div>
            </section>

            {/* Content Container */}
            <div className="max-w-[1280px] mx-auto px-4 py-16 space-y-24">

                {/* Mission Statement */}
                <section className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold text-[#030213] dark:text-white border-l-4 border-[#c10007] pl-4">Our Mission</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                At HomesTV, our mission is to provide accurate, timely, and engaging news content that empowers our readers to make informed decisions.
                            </p>
                            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                Whether you are tracking market trends, planning your next trip, or staying updated on political shifts, we are your reliable source for comprehensive coverage across Technology, Business, Politics, Economy, Tourism, and Real Estate.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-6 bg-white dark:bg-[#1a1d2e] rounded-xl shadow-xs border border-gray-100 dark:border-[#2a2d3e]">
                                <h3 className="text-2xl font-bold text-[#c10007] mb-2">5+</h3>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Global Regions Covered</p>
                            </div>
                            <div className="p-6 bg-white dark:bg-[#1a1d2e] rounded-xl shadow-xs border border-gray-100 dark:border-[#2a2d3e]">
                                <h3 className="text-2xl font-bold text-[#c10007] mb-2">24/7</h3>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Continuous Updates</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative h-[400px] w-full bg-linear-to-br from-gray-100 to-gray-200 dark:from-[#1a1d2e] dark:to-[#11131f] rounded-2xl overflow-hidden shadow-lg flex items-center justify-center group">
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500"></div>
                        {/* Abstract decorative element representing 'Global Network' */}
                        <div className="w-32 h-32 border-4 border-[#c10007] rounded-full flex items-center justify-center opacity-80">
                            <div className="w-20 h-20 bg-[#c10007] rounded-full animate-pulse"></div>
                        </div>
                        <p className="absolute bottom-6 font-mono text-xs text-gray-400 tracking-widest uppercase">Connecting the World</p>
                    </div>
                </section>

                {/* Team Section */}
                <section>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[#030213] dark:text-white mb-4">Meet The Team</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            We are a dedicated team of 5 Full Stack Developers passionate about building modern digital experiences.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                        {teamMembers.map((member, index) => (
                            <div
                                key={index}
                                className={`group bg-white dark:bg-[#1a1d2e] rounded-2xl p-8 shadow-xs hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-[#2a2d3e] flex flex-col items-center
                ${index === 0 ? 'lg:col-span-3 lg:w-1/3 lg:mx-auto md:col-span-2 md:w-1/2 md:mx-auto border-[#c10007]/20 dark:border-[#c10007]/20' : ''}`}
                            >
                                {/* Profile Placeholder */}
                                <div className="w-32 h-32 mb-6 relative">
                                    <div className="absolute inset-0 bg-linear-to-tr from-[#c10007] to-orange-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
                                    <div className="w-full h-full rounded-full border-4 border-white dark:border-[#1a1d2e] shadow-md flex items-center justify-center bg-gray-100 dark:bg-[#2a2d3e] text-3xl font-bold text-gray-400 dark:text-gray-500 group-hover:text-[#c10007] transition-colors">
                                        {member.initials}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-[#030213] dark:text-white mb-2 group-hover:text-[#c10007] transition-colors">
                                    {member.name}
                                </h3>
                                <p className="text-sm font-medium text-[#c10007] uppercase tracking-wider mb-4">
                                    {member.role}
                                </p>

                                <p className="text-sm text-center text-gray-500 dark:text-gray-400 leading-relaxed">
                                    Building scalable solutions and driving technical innovation for HomesTV.
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}
