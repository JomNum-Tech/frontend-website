import { stats } from "@/types/aboutUs";

export default function StatSection() {
    return (
        <section className="py-20 bg-blue-50">
            <div className="container mx-auto px-12">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-2 tracking-tight text-blue-700">
                        Our Impact in Numbers
                    </h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        We’re proud of the milestones we’ve achieved together with our students and community.
                    </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="group bg-white/80 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-200 p-6 flex flex-col items-center justify-center border border-blue-200 hover:border-blue-400"
                        >
                            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors duration-200">
                                <stat.icon className="w-7 h-7 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                            </div>
                            <div className="text-3xl lg:text-4xl font-extrabold mb-1 text-blue-700 group-hover:text-blue-800 transition-colors duration-200">
                                {stat.number}
                            </div>
                            <div className="text-base text-blue-600 font-medium text-center">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}