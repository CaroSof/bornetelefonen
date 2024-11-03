import { Counselor, Mood } from "@/lib/types";

export const counselors: Counselor[] = [
    // Kvindelige rådgivere
    {
        id: 1,
        name: "Maria",
        gender: "female",
        avatar: `https://api.dicebear.com/9.x/big-ears/svg?seed=Aidan&backgroundColor=b6e3f4&mouth=variant0708&eyes=variant14,variant15,variant32`,
    },
    {
        id: 2,
        name: "Sophie",
        gender: "female",
        avatar: `https://api.dicebear.com/9.x/big-ears/svg?seed=Oliver&backgroundColor=c0aede`,
    },
    {
        id: 3,
        name: "Anna",
        gender: "female",
        avatar: `https://api.dicebear.com/9.x/big-ears/svg?seed=Jack&backgroundColor=d1d4f9&mouth=variant0708&eyes=variant14,variant15,variant32`,
    },
    {
        id: 4,
        name: "Laura",
        gender: "female",
        avatar: `https://api.dicebear.com/9.x/big-ears/svg?seed=Martin&backgroundColor=b6e3f4&mouth=variant0708&eyes=variant14,variant15,variant32`,
    },
    {
        id: 5,
        name: "Emma",
        gender: "female",
        avatar: `https://api.dicebear.com/9.x/big-ears/svg?seed=Emma&backgroundColor=c0aede&mouth=variant0708&eyes=variant14,variant15,variant32`,
    },
    // Mandlige rådgivere
    {
        id: 6,
        name: "Thomas",
        gender: "male",
        avatar: `https://api.dicebear.com/9.x/big-ears/svg?seed=Thomas&backgroundColor=b6e3f4&mouth=variant0708&eyes=variant14,variant15,variant32&hair=short05,short19,short06`,
    },
    {
        id: 7,
        name: "Mikkel",
        gender: "male",
        avatar: `https://api.dicebear.com/9.x/big-ears/svg?seed=Mikkel&backgroundColor=c0aede&mouth=variant0708&eyes=variant14,variant15,variant32&hair=short05,short19,short06`,
    },
    {
        id: 8,
        name: "Omar",
        gender: "male",
        avatar: `https://api.dicebear.com/9.x/big-ears/svg?seed=Anders&backgroundColor=d1d4f9&mouth=variant0708&eyes=variant14,variant15,variant32`,
    },
    {
        id: 9,
        name: "Alexander",
        gender: "male",
        avatar: `https://api.dicebear.com/9.x/big-ears/svg?seed=Alexander&backgroundColor=b6e3f4&mouth=variant0708&eyes=variant14,variant15,variant32`,
    },
    {
        id: 10,
        name: "Martin",
        gender: "male",
        avatar: `https://api.dicebear.com/9.x/big-ears/svg?seed=Laura&backgroundColor=c0aede&mouth=variant0708&eyes=variant14,variant15,variant32`,
    },
];


export const moods: Mood[] = [
    { icon: "😊", label: "Glad", description: "Du føler dig positiv og optimistisk", color: "text-yellow-500" },
    { icon: "😢", label: "Ked af det", description: "Du føler dig trist eller nedtrykt", color: "text-red-500" },
    { icon: "😕", label: "Forvirret", description: "Du føler dig usikker eller har brug for vejledning", color: "text-purple-500" },
    { icon: "😔", label: "Ensom", description: "Du føler dig alene eller savner nogen at tale med", color: "text-orange-500" },
    { icon: "😌", label: "Rolig", description: "Du føler dig afslappet og fredfyldt", color: "text-blue-400" },
    { icon: "😫", label: "Overvældet", description: "Du føler dig stresset eller overbelastet", color: "text-gray-500" },
    { icon: "😰", label: "Nervøs", description: "Du føler dig ængstelig eller bekymret", color: "text-amber-500" },
]

export const tips = [
    "Husk, at det er okay at have det svært nogle gange. At tale om det med nogen, du stoler på, kan hjælpe dig til at få det bedre.",
    "Tag en dyb indånding og tæl til 10, når du føler dig stresset. Det kan hjælpe dig med at falde til ro.",
    "Prøv at gøre noget venligt for en anden i dag. Det kan være et smil eller en kompliment!",
    "Husk at drikke vand og spise regelmæssigt. Det hjælper din krop og dit humør.",
    "Bevægelse er godt for både krop og sind. Prøv at danse til din yndlingssang!",
];