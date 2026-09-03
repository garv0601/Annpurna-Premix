export const initialProducts = [
  {
    id: "prod-1",
    name: "Aether Pulse Pro Wireless Earbuds",
    brand: "AETHER Studio",
    category: "Audio",
    price: 249.99,
    originalPrice: 299.99,
    rating: 4.9,
    reviewCount: 128,
    stock: 45,
    isFeatured: true,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop",
    description: "Ultra-low latency lossless spatial audio with active hybrid noise cancellation, titanium composite drivers, and transparent pass-through mode.",
    features: [
      "Lossless 24-bit/96kHz Hi-Res Audio",
      "Active Noise Cancellation up to -45dB",
      "38 hours total playback with magnetic charging case",
      "IPX7 water & sweat resistance",
      "Customizable touch sensor controls"
    ],
    specs: {
      "Driver": "11mm Titanium Dynamic",
      "Connectivity": "Bluetooth 5.4 LE",
      "Battery": "8h (Earbuds) + 30h (Case)",
      "Weight": "4.8g per earbud"
    }
  },
  {
    id: "prod-2",
    name: "Apex CyberDeck Mechanical Keyboard",
    brand: "Apex Tech",
    category: "Peripherals",
    price: 189.50,
    originalPrice: 219.00,
    rating: 4.8,
    reviewCount: 94,
    stock: 18,
    isFeatured: true,
    badge: "Editor's Choice",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop",
    description: "CNC machined anodized aluminum mechanical keyboard with hot-swappable tactile switches, gasket mount engineering, and per-key RGB glow.",
    features: [
      "Full CNC anodized aluminum enclosure",
      "South-facing per-key ARGB lighting",
      "Tri-mode: 2.4GHz wireless, Bluetooth 5.2, USB-C",
      "Gasket mount structure with PORON sound dampening",
      "Double-shot PBT keycaps with laser etched legends"
    ],
    specs: {
      "Switches": "Hot-swappable Pre-lubed Linear",
      "Battery": "4000mAh Lithium Ion",
      "Layout": "75% Compact Explosive",
      "Weight": "1.45 kg"
    }
  },
  {
    id: "prod-3",
    name: "Vortex Vision Pro VR Headset",
    brand: "Vortex Labs",
    category: "Wearables",
    price: 599.00,
    originalPrice: 699.00,
    rating: 4.7,
    reviewCount: 64,
    stock: 12,
    isFeatured: true,
    badge: "New Release",
    image: "https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?q=80&w=800&auto=format&fit=crop",
    description: "Next-gen spatial computing headset featuring dual 4K Micro-OLED displays, eye-tracking precision, and passthrough augmented reality.",
    features: [
      "Dual 4K Micro-OLED 120Hz display per eye",
      "Real-time lidar depth mesh mapping",
      "Sub-millimeter hand and gesture tracking",
      "Active ventilation cooling",
      "Immersive spatial audio speakers built into head strap"
    ],
    specs: {
      "Resolution": "3840 x 2160 per eye",
      "FOV": "115 degrees field of view",
      "Processor": "Octa-core Neural Chipset",
      "Weight": "420g ultra-light balance"
    }
  },
  {
    id: "prod-4",
    name: "Omni Chrono Smartwatch Ultra",
    brand: "AETHER Studio",
    category: "Wearables",
    price: 329.00,
    originalPrice: 379.00,
    rating: 4.9,
    reviewCount: 210,
    stock: 30,
    isFeatured: false,
    badge: "Top Rated",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
    description: "Aerospace-grade titanium smartwatch with sapphire crystal lens, dual-frequency GPS, biometric sensors, and 14-day battery reserve.",
    features: [
      "Grade 5 Titanium bezel & back case",
      "Always-on 2000 nits AMOLED display",
      "ECG, SpO2, continuous heart & stress tracking",
      "100m water resistance (10 ATM)",
      "Precision dual-band satellite positioning"
    ],
    specs: {
      "Display": "1.43-inch Sapphire AMOLED",
      "Waterproofing": "100 meters / 10 ATM",
      "Battery": "14 Days Typical Use",
      "Strap": "Fluoroelastomer Quick-Release"
    }
  },
  {
    id: "prod-5",
    name: "Acoustic Sphere Desktop Hi-Fi Monitor",
    brand: "Sonus Audio",
    category: "Audio",
    price: 449.00,
    originalPrice: 499.00,
    rating: 4.8,
    reviewCount: 52,
    stock: 15,
    isFeatured: false,
    badge: "Audiophile Pick",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=800&auto=format&fit=crop",
    description: "Bi-amplified desktop audio monitor featuring Kevlar woofers, silk dome tweeters, and custom DSP acoustic calibration.",
    features: [
      "Custom tuned 120W RMS total power output",
      "Acoustic chamber with rear bass reflex port",
      "Optical, Coaxial, AUX, and LDAC Bluetooth 5.3 inputs",
      "Solid walnut wood side panels with brushed aluminum front"
    ],
    specs: {
      "Frequency Response": "38Hz - 22,000Hz",
      "Amplifier": "Class D Bi-Amp",
      "Dimensions": "220 x 180 x 290 mm",
      "Weight": "5.6 kg pair"
    }
  },
  {
    id: "prod-6",
    name: "CyberBeam LED Desk Ambient Light Bar",
    brand: "Lumina Gear",
    category: "Desk Setup",
    price: 99.00,
    originalPrice: 129.00,
    rating: 4.6,
    reviewCount: 88,
    stock: 50,
    isFeatured: false,
    badge: "Popular",
    image: "https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=800&auto=format&fit=crop",
    description: "Asymmetric optical glare-free monitor light bar with reactive RGB backlighting, wireless desktop puck controller, and auto-dimming sensor.",
    features: [
      "Zero screen glare asymmetric light optics",
      "Wireless rotary dial remote control",
      "Smart auto-dimming ambient light detection",
      "Dynamic reactive backlight audio sync mode",
      "Adjustable color temperature (2700K - 6500K)"
    ],
    specs: {
      "CRI": "Ra95 High Color Rendering",
      "Power": "USB Type-C 5V 2A",
      "Compatibility": "Fits curved & flat monitors 15-34 inches",
      "Material": "Anodized Aluminum Alloy"
    }
  }
];

export const initialReviews = [
  {
    id: "rev-1",
    productId: "prod-1",
    author: "Elena Rostova",
    rating: 5,
    date: "2026-08-01",
    title: "Unrivaled ANC & Audio Clarity",
    comment: "The soundstage on the Aether Pulse Pro is astonishing for wireless earbuds. The ANC completely silences ambient train noise on my commute. Worth every cent!",
    verifiedPurchase: true
  },
  {
    id: "rev-2",
    productId: "prod-1",
    author: "Marcus Chen",
    rating: 5,
    date: "2026-07-28",
    title: "Best earbuds I have owned",
    comment: "Comfortable for 6+ hour sessions, clear microphone during video calls, and the case build quality feels like a piece of art.",
    verifiedPurchase: true
  },
  {
    id: "rev-3",
    productId: "prod-2",
    author: "David Miller",
    rating: 5,
    date: "2026-08-05",
    title: "Thocky satisfaction out of the box",
    comment: "The factory pre-lubed switches sound so deep and creamy. Aluminum frame gives it real weight. Highly recommended for coders and writers.",
    verifiedPurchase: true
  },
  {
    id: "rev-4",
    productId: "prod-3",
    author: "Sarah Jenkins",
    rating: 4,
    date: "2026-08-03",
    title: "Future of spatial displays",
    comment: "The Micro-OLED panel resolution is insane—text is crisp and readable. Battery life is around 2.5 hours, but connected mode is flawless.",
    verifiedPurchase: true
  }
];
