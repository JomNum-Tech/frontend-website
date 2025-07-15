import { values } from "@/types/aboutUs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function ValueSection() {
    return (
        <section className="py-24 bg-gradient-to-b from-muted/60 via-white to-muted/40">
            <div className="container mx-auto px-12">
                <div className="text-center mb-20">
                    <h2 className="text-4xl lg:text-5xl font-extrabold mb-5 text-blue-800 tracking-tight">
                        Our Values
                    </h2>
                    <p className="text-lg lg:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        These core principles guide everything we do and shape the learning experience we create.
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {values.map((value, index) => (
                        <Card
                            key={index}
                            className="group h-full flex flex-col items-center justify-between bg-white/95 border border-blue-100 hover:border-blue-400 shadow-lg hover:shadow-2xl transition-all duration-200 rounded-3xl p-8 relative overflow-hidden"
                        >
                            {/* Decorative gradient accent */}
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 opacity-30 rounded-full blur-2xl z-0 pointer-events-none" />
                            <CardHeader className="flex flex-col items-center z-10">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 group-hover:from-blue-200 group-hover:to-blue-400 rounded-full flex items-center justify-center mb-6 shadow-lg transition-colors duration-200 border-2 border-white">
                                    <value.icon className="w-9 h-9 text-blue-700 group-hover:scale-110 group-hover:text-blue-900 transition-transform duration-200" />
                                </div>
                                <CardTitle className="text-2xl font-extrabold text-blue-800 mb-2 text-center drop-shadow-sm">{value.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 flex items-center z-10">
                                <p className="text-base text-gray-700 text-center leading-relaxed px-2">
                                    {value.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}