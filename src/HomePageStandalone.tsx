/**
 * ============================================================================
 * HOMEPAGE STANDALONE - COMPLETE PACKAGE
 * ============================================================================
 * 
 * File này chứa tất cả code cần thiết cho HomePage component.
 * Copy toàn bộ file này sang project Node.js/React của bạn.
 * 
 * CÁCH SỬ DỤNG:
 * ----------------------------------------------------------------------------
 * 1. Copy file này vào project của bạn (vd: src/components/HomePage.tsx)
 * 
 * 2. Install các packages cần thiết:
 *    npm install lucide-react clsx tailwind-merge class-variance-authority
 *    npm install @radix-ui/react-slot
 * 
 * 3. Đảm bảo project có Tailwind CSS đã setup:
 *    - tailwind.config.js
 *    - postcss.config.js
 *    - Import tailwind trong CSS: @tailwind base; @tailwind components; @tailwind utilities;
 * 
 * 4. Copy CSS Variables vào file CSS global của bạn (xem phần cuối file này)
 * 
 * 5. Sử dụng component:
 *    import { HomePage } from './components/HomePage';
 *    
 *    function App() {
 *      const handleLogin = () => {
 *        // Navigate to login page
 *        window.location.href = '/login';
 *      };
 *      
 *      return <HomePage onNavigateToLogin={handleLogin} />;
 *    }
 * 
 * ============================================================================
 */

import { useState } from "react";
import { 
  FlaskConical, 
  Package, 
  TrendingUp, 
  Settings, 
  Shield, 
  BarChart3, 
  Users, 
  CheckCircle,
  Menu,
  X,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================================
// BUTTON COMPONENT
// ============================================================================

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = "Button";

// ============================================================================
// CARD COMPONENTS
// ============================================================================

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <h4
      data-slot="card-title"
      className={cn("leading-none", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 [&:last-child]:pb-6", className)}
      {...props}
    />
  );
}

// ============================================================================
// HOMEPAGE COMPONENT
// ============================================================================

interface HomePageProps {
  onNavigateToLogin: () => void;
}

export function HomePage({ onNavigateToLogin }: HomePageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const features = [
    {
      icon: Package,
      title: "Instrument Management",
      description: "Efficiently track and manage all laboratory instruments with detailed records of serial numbers, storage locations, and conditions.",
    },
    {
      icon: FlaskConical,
      title: "Reagent Tracking",
      description: "Monitor reagent inventory, vendor supplies, and usage history to ensure optimal stock levels and prevent shortages.",
    },
    {
      icon: TrendingUp,
      title: "Supply Chain Analytics",
      description: "Gain insights into reagent consumption patterns, costs, and supplier performance with comprehensive reporting.",
    },
    {
      icon: Settings,
      title: "Warehouse Configuration",
      description: "Customize warehouse settings, alert thresholds, and operational parameters to match your laboratory needs.",
    },
    {
      icon: Shield,
      title: "Data Security",
      description: "Secure authentication and role-based access control to protect sensitive laboratory information.",
    },
    {
      icon: BarChart3,
      title: "Real-time Monitoring",
      description: "Track stock levels in real-time with color-coded alerts for low, critical, and sufficient inventory levels.",
    },
  ];

  const benefits = [
    "Reduce waste and optimize inventory costs",
    "Ensure regulatory compliance with detailed audit trails",
    "Minimize downtime with proactive stock management",
    "Streamline laboratory operations",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header Navigation */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <FlaskConical className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-slate-800">LabWare</h2>
                <p className="text-slate-600">Management System</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-slate-600 hover:text-blue-600 transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-slate-600 hover:text-blue-600 transition-colors"
              >
                About Us
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-slate-600 hover:text-blue-600 transition-colors"
              >
                Contact
              </button>
              <Button 
                onClick={onNavigateToLogin}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Sign In
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-slate-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-slate-200">
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => scrollToSection('features')}
                  className="text-left text-slate-600 hover:text-blue-600 py-2"
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="text-left text-slate-600 hover:text-blue-600 py-2"
                >
                  About Us
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="text-left text-slate-600 hover:text-blue-600 py-2"
                >
                  Contact
                </button>
                <Button 
                  onClick={onNavigateToLogin}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Sign In
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-6 shadow-xl">
              <FlaskConical className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-slate-800 mb-6">
              Modern Warehouse Management for Modern Laboratories
            </h1>
            <p className="text-slate-600 mb-8">
              Streamline your laboratory operations with our comprehensive warehouse management system. 
              Track instruments, manage reagent inventory, and optimize your supply chain with ease.
            </p>
            <div className="flex items-center gap-4">
              <Button 
                onClick={onNavigateToLogin}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6"
              >
                Get Started
              </Button>
              <Button 
                variant="outline"
                onClick={() => scrollToSection('features')}
                className="border-slate-300 bg-white hover:bg-slate-50 px-8 py-6"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div 
            className="rounded-2xl overflow-hidden shadow-2xl h-[400px] lg:h-[500px] bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1759866042499-d0b3e9d87ceb?w=800&q=80')`,
            }}
          />
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-slate-800 mb-4">Comprehensive Laboratory Management</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Everything you need to manage your laboratory warehouse efficiently and effectively
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-slate-200 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-slate-800">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div 
            className="rounded-2xl overflow-hidden shadow-2xl h-[400px] lg:h-[500px] bg-cover bg-center order-2 lg:order-1"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1576669801838-1b1c52121e6a?w=800&q=80')`,
            }}
          />
          
          <div className="order-1 lg:order-2">
            <h2 className="text-slate-800 mb-6">
              Why Choose LabWare?
            </h2>
            <p className="text-slate-600 mb-8">
              Our laboratory warehouse management system is designed by scientists, for scientists. 
              We understand the unique challenges of managing laboratory inventory and have built 
              a solution that addresses them all.
            </p>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-600">{benefit}</p>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-white rounded-xl p-4 shadow-md border border-slate-200">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mb-2">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-slate-800">500+</h3>
                <p className="text-slate-600">Laboratories</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-slate-200">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mb-2">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-slate-800">1M+</h3>
                <p className="text-slate-600">Instruments</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-slate-200">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mb-2">
                  <FlaskConical className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-slate-800">10M+</h3>
                <p className="text-slate-600">Reagents</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-slate-800 mb-4">Get In Touch</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Contact Form */}
          <Card className="shadow-lg border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-slate-800">Send us a message</CardTitle>
              <CardDescription>Fill out the form and our team will get back to you within 24 hours.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <label className="text-sm text-slate-700 mb-2 block">Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-700 mb-2 block">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-700 mb-2 block">Message</label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                    placeholder="Your message..."
                  />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="shadow-lg border-slate-200 bg-white">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-slate-800 mb-1">Email</h4>
                    <p className="text-slate-600 text-sm">support@labware.com</p>
                    <p className="text-slate-600 text-sm">sales@labware.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-slate-200 bg-white">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-slate-800 mb-1">Phone</h4>
                    <p className="text-slate-600 text-sm">+1 (555) 123-4567</p>
                    <p className="text-slate-600 text-sm">Mon-Fri, 9AM-6PM EST</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-slate-200 bg-white">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-slate-800 mb-1">Office</h4>
                    <p className="text-slate-600 text-sm">123 Medical Plaza</p>
                    <p className="text-slate-600 text-sm">San Francisco, CA 94102</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-12 text-center">
          <h2 className="text-white mb-4">
            Ready to Transform Your Laboratory?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of laboratories that have streamlined their operations with LabWare
          </p>
          <Button 
            onClick={onNavigateToLogin}
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6"
          >
            Start Managing Your Warehouse
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                <FlaskConical className="h-5 w-5 text-white" />
              </div>
              <p className="text-slate-600">© 2025 LabWare Management System</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">
                Terms of Service
              </a>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-slate-600 hover:text-blue-600 transition-colors"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * ============================================================================
 * CSS VARIABLES - COPY VÀO FILE CSS GLOBAL
 * ============================================================================
 * 
 * Thêm các CSS variables sau vào file CSS global của bạn (vd: src/index.css hoặc src/App.css)
 * QUAN TRỌNG: Đặt sau các Tailwind directives (@tailwind base; @tailwind components; @tailwind utilities;)
 * 
 * ```css
 * @tailwind base;
 * @tailwind components;
 * @tailwind utilities;
 * 
 * @layer base {
 *   :root {
 *     --background: #ffffff;
 *     --foreground: oklch(0.145 0 0);
 *     --card: #ffffff;
 *     --card-foreground: oklch(0.145 0 0);
 *     --popover: oklch(1 0 0);
 *     --popover-foreground: oklch(0.145 0 0);
 *     --primary: #030213;
 *     --primary-foreground: oklch(1 0 0);
 *     --secondary: oklch(0.95 0.0058 264.53);
 *     --secondary-foreground: #030213;
 *     --muted: #ececf0;
 *     --muted-foreground: #717182;
 *     --accent: #e9ebef;
 *     --accent-foreground: #030213;
 *     --destructive: #d4183d;
 *     --destructive-foreground: #ffffff;
 *     --border: rgba(0, 0, 0, 0.1);
 *     --input: transparent;
 *     --ring: oklch(0.708 0 0);
 *   }
 * 
 *   * {
 *     border-color: var(--border);
 *   }
 * 
 *   body {
 *     background-color: var(--background);
 *     color: var(--foreground);
 *   }
 * }
 * ```
 * 
 * ============================================================================
 * TAILWIND CONFIG - OPTIONAL
 * ============================================================================
 * 
 * Nếu muốn customize thêm, thêm vào tailwind.config.js:
 * 
 * ```js
 * module.exports = {
 *   content: [
 *     "./src/**/*.{js,jsx,ts,tsx}",
 *   ],
 *   theme: {
 *     extend: {
 *       colors: {
 *         border: "hsl(var(--border))",
 *         input: "hsl(var(--input))",
 *         ring: "hsl(var(--ring))",
 *         background: "hsl(var(--background))",
 *         foreground: "hsl(var(--foreground))",
 *         primary: {
 *           DEFAULT: "hsl(var(--primary))",
 *           foreground: "hsl(var(--primary-foreground))",
 *         },
 *         secondary: {
 *           DEFAULT: "hsl(var(--secondary))",
 *           foreground: "hsl(var(--secondary-foreground))",
 *         },
 *         destructive: {
 *           DEFAULT: "hsl(var(--destructive))",
 *           foreground: "hsl(var(--destructive-foreground))",
 *         },
 *         muted: {
 *           DEFAULT: "hsl(var(--muted))",
 *           foreground: "hsl(var(--muted-foreground))",
 *         },
 *         accent: {
 *           DEFAULT: "hsl(var(--accent))",
 *           foreground: "hsl(var(--accent-foreground))",
 *         },
 *         popover: {
 *           DEFAULT: "hsl(var(--popover))",
 *           foreground: "hsl(var(--popover-foreground))",
 *         },
 *         card: {
 *           DEFAULT: "hsl(var(--card))",
 *           foreground: "hsl(var(--card-foreground))",
 *         },
 *       },
 *       borderRadius: {
 *         lg: "0.625rem",
 *         md: "calc(0.625rem - 2px)",
 *         sm: "calc(0.625rem - 4px)",
 *       },
 *     },
 *   },
 *   plugins: [],
 * }
 * ```
 * 
 * ============================================================================
 * PACKAGE VERSIONS
 * ============================================================================
 * 
 * Đây là các version đã test và hoạt động tốt:
 * - lucide-react: ^0.263.1 or newer
 * - clsx: ^2.0.0 or newer
 * - tailwind-merge: ^2.0.0 or newer
 * - class-variance-authority: ^0.7.0 or newer
 * - @radix-ui/react-slot: ^1.0.0 or newer
 * 
 * ============================================================================
 */
