// ============================================
// MILLA SALGADOS - Banco de Produtos
// ============================================

const STORE_CONFIG = {
    name: "Milla Salgados",
    slogan: "Feito em família, saboreado por todos ♡",
    whatsappNumber: "5519993048740",
    openingHours: "Seg a Sex: 08h - 20h | Sáb: 08h - 18h",
    instagram: "@millasalgados"
};

const categories = [
    { id: "destaques", name: "Destaques", icon: "⭐" },
    { id: "combos", name: "Combos", icon: "📦" },
    { id: "batatas", name: "Batata Frita", icon: "🍟" },
    { id: "churros", name: "Mini Churros", icon: "🍫" }
];

const products = [
    // COMBOS DE SALGADOS
    {
        id: 1,
        name: "Combo 25 Salgados",
        description: "25 unidades de salgados mistos (coxinha, risole, kibe, bolinha de queijo)",
        price: 35.00,
        category: "combos",
        featured: true,
        image: "https://mgx-backend-cdn.metadl.com/generate/images/1519811/2026-08-08/uczzjdycaj5q/combo-salgados-box.png",
        additions: [
            { id: 1, name: "Molho extra", price: 3.00 },
            { id: 2, name: "Ketchup", price: 2.00 },
            { id: 3, name: "Mostarda", price: 2.00 }
        ]
    },
    {
        id: 2,
        name: "Combo 50 Salgados",
        description: "50 unidades de salgados mistos (coxinha, risole, kibe, bolinha de queijo)",
        price: 65.00,
        category: "combos",
        featured: true,
        image: "https://mgx-backend-cdn.metadl.com/generate/images/1519811/2026-08-08/uczzjdycaj5q/combo-salgados-box.png",
        additions: [
            { id: 1, name: "Molho extra", price: 3.00 },
            { id: 2, name: "Ketchup", price: 2.00 },
            { id: 3, name: "Mostarda", price: 2.00 }
        ]
    },
    {
        id: 3,
        name: "Combo 100 Salgados",
        description: "100 unidades de salgados mistos (coxinha, risole, kibe, bolinha de queijo)",
        price: 120.00,
        category: "combos",
        featured: true,
        image: "https://mgx-backend-cdn.metadl.com/generate/images/1519811/2026-08-08/uczzjdycaj5q/combo-salgados-box.png",
        additions: [
            { id: 1, name: "Molho extra", price: 3.00 },
            { id: 2, name: "Ketchup", price: 2.00 },
            { id: 3, name: "Mostarda", price: 2.00 }
        ]
    },
    {
        id: 4,
        name: "Combo 150 Salgados",
        description: "150 unidades de salgados mistos (coxinha, risole, kibe, bolinha de queijo)",
        price: 170.00,
        category: "combos",
        featured: false,
        image: "https://mgx-backend-cdn.metadl.com/generate/images/1519811/2026-08-08/uczzjdycaj5q/combo-salgados-box.png",
        additions: [
            { id: 1, name: "Molho extra", price: 3.00 },
            { id: 2, name: "Ketchup", price: 2.00 },
            { id: 3, name: "Mostarda", price: 2.00 }
        ]
    },
    {
        id: 5,
        name: "Combo 200 Salgados",
        description: "200 unidades de salgados mistos (coxinha, risole, kibe, bolinha de queijo)",
        price: 210.00,
        category: "combos",
        featured: false,
        image: "https://mgx-backend-cdn.metadl.com/generate/images/1519811/2026-08-08/uczzjdycaj5q/combo-salgados-box.png",
        additions: [
            { id: 1, name: "Molho extra", price: 3.00 },
            { id: 2, name: "Ketchup", price: 2.00 },
            { id: 3, name: "Mostarda", price: 2.00 }
        ]
    },
    // BATATA FRITA
    {
        id: 6,
        name: "Batata Frita Média",
        description: "Porção média de batata frita crocante",
        price: 18.00,
        category: "batatas",
        featured: false,
        image: "https://mgx-backend-cdn.metadl.com/generate/images/1519811/2026-08-08/uczzjqqcaj5a/batata-frita-cheddar.png",
        additions: [
            { id: 4, name: "Cheddar", price: 5.00 },
            { id: 5, name: "Bacon", price: 6.00 },
            { id: 6, name: "Mussarela", price: 5.00 }
        ]
    },
    {
        id: 7,
        name: "Batata Frita Grande",
        description: "Porção grande de batata frita crocante",
        price: 25.00,
        category: "batatas",
        featured: true,
        image: "https://mgx-backend-cdn.metadl.com/generate/images/1519811/2026-08-08/uczzjqqcaj5a/batata-frita-cheddar.png",
        additions: [
            { id: 4, name: "Cheddar", price: 5.00 },
            { id: 5, name: "Bacon", price: 6.00 },
            { id: 6, name: "Mussarela", price: 5.00 }
        ]
    },
    // MINI CHURROS
    {
        id: 8,
        name: "Mini Churros 50un - Chocolate",
        description: "50 unidades de mini churros recheados com chocolate",
        price: 45.00,
        category: "churros",
        featured: true,
        image: "https://mgx-backend-cdn.metadl.com/generate/images/1519811/2026-08-08/uczzj5qcaj4q/mini-churros-chocolate.png",
        additions: [
            { id: 7, name: "Cobertura extra chocolate", price: 4.00 },
            { id: 8, name: "Granulado", price: 2.00 }
        ]
    },
    {
        id: 9,
        name: "Mini Churros 50un - Doce de Leite",
        description: "50 unidades de mini churros recheados com doce de leite",
        price: 45.00,
        category: "churros",
        featured: false,
        image: "https://mgx-backend-cdn.metadl.com/generate/images/1519811/2026-08-08/uczzj5qcaj4q/mini-churros-chocolate.png",
        additions: [
            { id: 7, name: "Cobertura extra chocolate", price: 4.00 },
            { id: 8, name: "Granulado", price: 2.00 }
        ]
    },
    {
        id: 10,
        name: "Mini Churros 100un - Chocolate",
        description: "100 unidades de mini churros recheados com chocolate",
        price: 80.00,
        category: "churros",
        featured: false,
        image: "https://mgx-backend-cdn.metadl.com/generate/images/1519811/2026-08-08/uczzj5qcaj4q/mini-churros-chocolate.png",
        additions: [
            { id: 7, name: "Cobertura extra chocolate", price: 4.00 },
            { id: 8, name: "Granulado", price: 2.00 }
        ]
    },
    {
        id: 11,
        name: "Mini Churros 100un - Doce de Leite",
        description: "100 unidades de mini churros recheados com doce de leite",
        price: 80.00,
        category: "churros",
        featured: false,
        image: "https://mgx-backend-cdn.metadl.com/generate/images/1519811/2026-08-08/uczzj5qcaj4q/mini-churros-chocolate.png",
        additions: [
            { id: 7, name: "Cobertura extra chocolate", price: 4.00 },
            { id: 8, name: "Granulado", price: 2.00 }
        ]
    }
];

export { STORE_CONFIG, categories, products };