import { useState } from "react";
import {
    Menu,
    X,
    Star,
    Wifi,
    Coffee,
    MessageCircle,
    Building2,
    WashingMachine,
    UtensilsCrossed,
    Sofa,
    ParkingCircle,
    DoorOpen,
    Landmark,
    Bath,
} from "lucide-react";
import { Head } from "@inertiajs/react";
// import { ImageWithFallback } from "./components/figma/ImageWithFallback";

export default function App() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const rooms = [
        {
            id: 1,
            name: "Super Deluxe Room",
            roomNumber: "104, 105, 106, 108, 110",
            description:
                "Kamar premium dengan fasilitas lengkap untuk kenyamanan maksimal.",
            price: "Rp 350.000",
            image: "https://images.unsplash.com/photo-1605346434674-a440ca4dc4c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxsdXh1cnklMjBob3RlbCUyMHJvb20lMjBpbnRlcmlvcnxlbnwxfHx8fDE3ODAzODgwNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
            features: [
                "Double Bed",
                "AC",
                "Refrigerator",
                "Water Heater",
                "Free WiFi",
                "Breakfast",
                "Full Amenities",
                "Coffee & Tea",
            ],
        },
        {
            id: 2,
            name: "Deluxe Room",
            roomNumber: "101, 102",
            description:
                "Kamar nyaman dengan fasilitas modern untuk kebutuhan menginap Anda.",
            price: "Rp 250.000",
            image: "https://images.unsplash.com/photo-1646974400439-321c4a9240b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxMHx8bHV4dXJ5JTIwaG90ZWwlMjByb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzgwMzg4MDc4fDA&ixlib=rb-4.1.0&q=80&w=1080",
            features: [
                "Double Bed",
                "AC",
                "Refrigerator",
                "Water Heater",
                "Free WiFi",
                "Breakfast",
                "Amenities",
                "Mineral Water",
            ],
        },
        {
            id: 3,
            name: "Superior Room",
            roomNumber: "107, 109",
            description:
                "Pilihan tepat untuk tamu yang menginginkan kenyamanan dengan harga terjangkau.",
            price: "Rp 200.000",
            image: "https://images.unsplash.com/photo-1578898886225-c7c894047899?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBob3RlbCUyMHJvb20lMjBpbnRlcmlvcnxlbnwxfHx8fDE3ODAzODgwNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
            features: [
                "Twin Bed",
                "AC",
                "Refrigerator",
                "Free WiFi",
                "Breakfast",
                "Amenities",
                "Mineral Water",
            ],
        },
        {
            id: 4,
            name: "Standard Fan Room",
            roomNumber: "103, 111, 112, 113",
            description: "Kamar ekonomis dengan fasilitas dasar yang nyaman.",
            price: "Rp 150.000",
            image: "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb20lMjBpbnRlcmlvcnxlbnwxfHx8fDE3ODAzODgwNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
            features: [
                "Double Bed",
                "Fan",
                "Free WiFi",
                "Breakfast",
                "Amenities",
                "Mineral Water",
            ],
        },
    ];

    const facilities = [
        {
            icon: Building2,
            name: "Ballroom",
            description:
                "Ruang serbaguna dengan kapasitas hingga 150 orang untuk seminar, rapat, dan acara.",
            image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80",
        },
        {
            icon: WashingMachine,
            name: "Laundry",
            description: "Layanan laundry khusus bagi tamu yang menginap.",
            image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=1200&q=80",
        },
        {
            icon: UtensilsCrossed,
            name: "Restoran",
            description:
                "Area sarapan dan makan dengan kapasitas hingga 25 orang.",
            image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=80",
        },
        {
            icon: Sofa,
            name: "Lobby",
            description: "Area penerimaan tamu yang nyaman dan representatif.",
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
        },
        {
            icon: ParkingCircle,
            name: "Area Parkir",
            description: "Area parkir yang luas dan aman bagi tamu hotel.",
            image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1200&q=80",
        },
        {
            icon: DoorOpen,
            name: "Balcony Area",
            description:
                "Area balkon untuk bersantai dan menikmati suasana sekitar.",
            image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80",
        },
        {
            icon: Landmark,
            name: "Mushola",
            description:
                "Fasilitas ibadah yang nyaman bagi tamu dan pengunjung.",
            image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=1200&q=80",
        },
        {
            icon: Bath,
            name: "Public Toilet",
            description: "Toilet umum yang bersih dan mudah diakses.",
            image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1200&q=80",
        },
    ];

    const waNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "6284287427";

    const handleBooking = (room) => {
        const message = `Halo, saya ingin memesan kamar ${room.name}. Nomor kamar tersedia: ${room.roomNumber}. Mohon informasi ketersediaannya.`;

        window.open(
            `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`,
            "_blank",
        );
    };
    const handleReservation = () => {
        const message =
            "halo saya ingin reservation. Mohon informasi ketersediaannya";
        window.open(
            `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`,
            "_blank",
        );
    };
    const handleChat = () => {
        window.open(`https://wa.me/${waNumber}?`, "_blank");
    };

    return (
        <>
            <Head title="Home" />
            <div className="min-h-screen bg-background">
                {/* Navigation */}
                <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-border dark:bg-slate-900/95 dark:border-slate-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center gap-2">
                                <img
                                    src="/assets/image/logo.png"
                                    alt="EDOTEL SMKN 2 Gorontalo"
                                    className="h-10 w-auto sm:h-12 md:h-14 lg:h-16 object-contain"
                                />
                            </div>

                            {/* Desktop Menu */}
                            <div className="hidden md:flex items-center gap-8">
                                <a
                                    href="#home"
                                    className="hover:text-primary transition-colors"
                                >
                                    Home
                                </a>
                                <a
                                    href="#rooms"
                                    className="hover:text-primary transition-colors"
                                >
                                    Kamar
                                </a>
                                <a
                                    href="#facilities"
                                    className="hover:text-primary transition-colors"
                                >
                                    Fasilitas
                                </a>
                                <a
                                    href="#contact"
                                    className="hover:text-primary transition-colors"
                                >
                                    Kontak
                                </a>
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                className="md:hidden"
                                onClick={() =>
                                    setMobileMenuOpen(!mobileMenuOpen)
                                }
                            >
                                {mobileMenuOpen ? (
                                    <X className="size-6" />
                                ) : (
                                    <Menu className="size-6" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden bg-white border-t border-border">
                            <div className="px-4 py-4 space-y-3">
                                <a
                                    href="#home"
                                    className="block py-2 hover:text-primary transition-colors"
                                >
                                    Home
                                </a>
                                <a
                                    href="#rooms"
                                    className="block py-2 hover:text-primary transition-colors"
                                >
                                    Kamar
                                </a>
                                <a
                                    href="#facilities"
                                    className="block py-2 hover:text-primary transition-colors"
                                >
                                    Fasilitas
                                </a>
                                <a
                                    href="#contact"
                                    className="block py-2 hover:text-primary transition-colors"
                                >
                                    Kontak
                                </a>
                            </div>
                        </div>
                    )}
                </nav>

                {/* Hero Section */}
                <section id="home" className="relative h-screen">
                    <div className="absolute inset-0">
                        <img
                            src="https://images.unsplash.com/photo-1694595437436-2ccf5a95591f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMGV4dGVyaW9yJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzgwNDQ2NjA0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                            alt="Grand Luxe Hotel Exterior"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
                    </div>

                    <div className="relative h-full flex items-center justify-center text-center px-4">
                        <div className="max-w-4xl">
                            <h1 className="text-white mb-6 text-5xl md:text-7xl">
                                Selamat Datang di EDOTEl SMKN 2 Gorontalo
                            </h1>
                            <p className="text-white/90 mb-8 text-xl md:text-2xl">
                                Pengalaman Menginap Tak Terlupakan dengan
                                Kemewahan Kelas Dunia
                            </p>
                            <div className="flex justify-center">
                                <a
                                    href="#rooms"
                                    className="bg-white/10 backdrop-blur-sm text-white border border-white/30 w-64 py-3 rounded-lg hover:bg-white/20 transition-colors"
                                >
                                    Lihat Penawaran
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section className="py-20 px-4 bg-muted/30">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="mb-6 text-center">
                                    Tentang Hotel Kami
                                </h2>
                                <p className="text-muted-foreground mb-4">
                                    <span className="font-bold">
                                        Edotel SMK Negeri 2 Gorontalo
                                    </span>{" "}
                                    merupakan hotel pendidikan yang dikelola
                                    sebagai sarana praktik dan pembelajaran bagi
                                    siswa perhotelan. Menghadirkan suasana
                                    nyaman, fasilitas yang memadai, serta
                                    pelayanan yang profesional, Edotel menjadi
                                    pilihan tepat bagi tamu yang mencari tempat
                                    menginap dengan harga terjangkau di Kota
                                    Gorontalo sekaligus mendukung pengembangan
                                    kompetensi peserta didik di bidang
                                    perhotelan.
                                </p>
                                <p className="text-muted-foreground mb-6">
                                    Dengan lokasi strategis di pusat kota dan
                                    fasilitas lengkap, kami siap memberikan
                                    pengalaman menginap yang tak terlupakan bagi
                                    setiap tamu.
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <Wifi className="size-5 text-primary" />
                                        <span>WiFi Gratis</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Star className="size-5 text-primary fill-primary" />
                                        <span>Bintang 5</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Coffee className="size-5 text-primary" />
                                        <span>24/7 Service</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <UtensilsCrossed className="size-5 text-primary" />
                                        <span>Restaurant</span>
                                    </div>
                                </div>
                            </div>
                            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1698927100805-2a32718a7e05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxsdXh1cnklMjBob3RlbCUyMHJvb20lMjBpbnRlcmlvcnxlbnwxfHx8fDE3ODAzODgwNzh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                                    alt="Hotel Interior"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Rooms Section */}
                <section id="rooms" className="py-20 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="mb-4">Kamar & Suite</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Pilih dari berbagai tipe kamar yang dirancang
                                dengan elegan untuk kenyamanan maksimal Anda
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                            {rooms.map((room) => (
                                <div
                                    key={room.id}
                                    className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-border flex flex-col h-full"
                                >
                                    <div className="relative h-64 overflow-hidden">
                                        <img
                                            src={room.image}
                                            alt={room.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg">
                                            {room.price}
                                            <span className="text-sm">
                                                /malam
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-1">
                                        <h3 className="mb-2">{room.name}</h3>

                                        <p className="text-muted-foreground mb-4">
                                            {room.description}
                                        </p>

                                        <div className="grid grid-cols-2 gap-2 mb-4">
                                            {room.features.map(
                                                (feature, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-2 text-sm"
                                                    >
                                                        <Star className="size-4 text-primary fill-primary" />
                                                        <span>{feature}</span>
                                                    </div>
                                                ),
                                            )}
                                        </div>

                                        <button
                                            onClick={handleBooking}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-auto block w-full text-center bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition-opacity"
                                        >
                                            Pesan Kamar Ini
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Facilities Section */}
                <section id="facilities" className="py-20 px-4 bg-muted/30">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="mb-4">Fasilitas Lainnya</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Nikmati berbagai fasilitas kelas dunia yang kami
                                sediakan untuk kenyamanan Anda
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {facilities.map((facility, index) => {
                                const Icon = facility.icon;
                                return (
                                    <div
                                        key={index}
                                        className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-border"
                                    >
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={facility.image}
                                                alt={facility.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="bg-primary/10 p-2 rounded-lg">
                                                    <Icon className="size-6 text-primary" />
                                                </div>
                                                <h4>{facility.name}</h4>
                                            </div>
                                            <p className="text-muted-foreground text-sm">
                                                {facility.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="relative py-24 px-4">
                    <div className="absolute inset-0">
                        <img
                            src="https://images.unsplash.com/photo-1552858725-693709cc17c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw5fHxsdXh1cnklMjBob3RlbCUyMHJvb20lMjBpbnRlcmlvcnxlbnwxfHx8fDE3ODAzODgwNzh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                            alt="Hotel Room"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/70" />
                    </div>

                    <div className="relative max-w-4xl mx-auto text-center text-white">
                        <h2 className="text-white mb-6">
                            Siap untuk Pengalaman Tak Terlupakan?
                        </h2>
                        <p className="text-white/90 mb-8 text-xl">
                            Pesan kamar Anda sekarang dan nikmati penawaran
                            spesial kami
                        </p>
                        <button
                            onClick={handleReservation}
                            className="bg-white text-primary px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Reservasi Sekarang
                        </button>
                    </div>
                </section>

                {/* Footer */}
                <footer
                    id="contact"
                    className="bg-primary text-primary-foreground py-12 px-4"
                >
                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-8 mb-8">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <img
                                        src="/assets/image/hitamputih.png"
                                        alt="EDOTEL SMKN 2 Gorontalo"
                                        className="h-18 w-auto object-contain"
                                    />
                                </div>
                                <p className="text-primary-foreground/80">
                                    Pengalaman menginap mewah di jantung kota
                                    Gorontalo dengan pelayanan terbaik.
                                </p>
                            </div>

                            <div>
                                <h4 className="mb-4 text-primary-foreground">
                                    Kontak
                                </h4>
                                <div className="space-y-2 text-primary-foreground/80">
                                    <p>Jl. Diponegoro, Kel. Limba U2.</p>
                                    <p>Kota Gorontalo</p>
                                    <p>Tel: +62 21 1234 5678</p>
                                    <p>Email: edotelsmkn2gorontalo@gmail.com</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="mb-4 text-primary-foreground">
                                    Jam Operasional
                                </h4>
                                <div className="space-y-2 text-primary-foreground/80">
                                    <p>Check-in: 14:00</p>
                                    <p>Check-out: 12:00</p>
                                    <p>Front Desk: 24/7</p>
                                    <p>Restaurant: 06:00 - 23:00</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-primary-foreground/20 pt-8 text-center text-primary-foreground/60">
                            <p>
                                &copy; 2026 EDOTEL SMKN 2 GORONTALO. All rights
                                reserved.
                            </p>
                        </div>
                    </div>
                </footer>

                <button
                    // href="https://wa.me/628XXXXXXXXXX"
                    onClick={handleChat}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300"
                >
                    <MessageCircle size={28} />
                    <span className="hidden sm:block">Chat Kami</span>
                </button>
            </div>
        </>
    );
}
