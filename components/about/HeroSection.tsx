import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export default function HeroSection() {
    return (
        <>
            <section className="py-24 bg-gradient-to-b from-background via-muted/40 to-background">
                <div className="container mx-auto px-12">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge
                            variant="secondary"
                            className="mb-8 px-4 py-2 rounded-full text-base font-medium tracking-wide bg-blue-100 text-blue-700 border-0 shadow-sm"
                        >
                            About JomNum-Tech
                        </Badge>
                        <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-8 leading-tight">
                            <span className="text-blue-700 bg-blue-100 px-2 rounded">
                                Moving Forward
                            </span><br />
                            Together In the Age of Technology{" "}
                        </h1>
                        <p className="text-lg lg:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                            Together, Everyone, Achieves, More
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                variant="outline"
                                size="lg"
                                className="text-lg px-8 py-6 rounded-full font-semibold border-2 border-blue-200 bg-white/80 hover:bg-blue-50 text-blue-700 transition-all duration-200 shadow"
                            >
                                Meet Our Team
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}