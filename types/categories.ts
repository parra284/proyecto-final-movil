import {
    Banknote,
    Briefcase,
    Bus,
    Ellipsis,
    Gift,
    GraduationCap,
    HandCoins,
    HeartPulse,
    Home,
    LineChart,
    Plus,
    Popcorn,
    Receipt,
    RotateCcw,
    Shirt,
    ShoppingBag,
    ShoppingBasket,
    TrendingUp,
    Zap
} from "lucide-react-native";

export const CATEGORIES = {
  income: [
    { key: "Salario", icon: TrendingUp },
    { key: "Freelance", icon: Briefcase },
    { key: "Venta de productos", icon: ShoppingBag },
    { key: "Intereses bancarios", icon: Banknote },
    { key: "Bonificaciones", icon: Gift },
    { key: "Reembolsos", icon: RotateCcw },
    { key: "Dividendos", icon: LineChart },
    { key: "Alquiler recibido", icon: Home },
    { key: "Regalos", icon: HandCoins },
    { key: "Otros ingresos", icon: Plus },
  ],

  expense: [
    { key: "Alimentos", icon: ShoppingBasket },
    { key: "Transporte", icon: Bus },
    { key: "Servicios públicos", icon: Zap },
    { key: "Entretenimiento", icon: Popcorn },
    { key: "Salud", icon: HeartPulse },
    { key: "Educación", icon: GraduationCap },
    { key: "Suscripciones", icon: Receipt },
    { key: "Compras personales", icon: Shirt },
    { key: "Hogar", icon: Home },
    { key: "Otros gastos", icon: Ellipsis },
  ]
};
