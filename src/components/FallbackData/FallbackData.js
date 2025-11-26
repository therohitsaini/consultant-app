export const sortOptions = [
    { label: 'Name', value: 'name asc', directionLabel: 'A-Z' },
    { label: 'Name', value: 'name desc', directionLabel: 'Z-A' },
    { label: 'Email _id', value: 'email asc', directionLabel: 'A-Z' },
    { label: 'Email _id', value: 'email desc', directionLabel: 'Z-A' },
    { label: 'Contact', value: 'contact asc', directionLabel: 'Ascending' },
    { label: 'Contact', value: 'contact desc', directionLabel: 'Descending' },
    { label: 'Profession', value: 'profession asc', directionLabel: 'A-Z' },
    { label: 'Profession', value: 'profession desc', directionLabel: 'Z-A' },
    { label: 'Experience', value: 'experience asc', directionLabel: 'Ascending' },
    { label: 'Experience', value: 'experience desc', directionLabel: 'Descending' },
    { label: 'Conversion Fees', value: 'conversionFees asc', directionLabel: 'Ascending' },
    { label: 'Conversion Fees', value: 'conversionFees desc', directionLabel: 'Descending' },
    { label: 'Status', value: 'status asc', directionLabel: 'A-Z' },
    { label: 'Status', value: 'status desc', directionLabel: 'Z-A' },
];


export const headings = [
    { title: 'Sr. No.' },
    { title: 'Image' },
    { title: 'Name' },
    { title: 'Email _id' },
    { title: 'Contact' },
    { title: 'Profession' },
    { title: 'Experience' },
    { title: 'Conversion Fees', alignment: 'end' },
    { title: 'Status' },
    { title: 'Action' },
];

export const itemStrings = [

   
];


export const apps = [
    {
        name: "Easy Language Translate",
        image: "./images/apps-img/app1.png",
    },
    {
        name: "Blokr Country Redirect & Block",
        image: "./images/apps-img/app2.png",
    },
    {
        name: "Smart Zipcode Validator",
        image: "./images/apps-img/app3.png",
    },
    {
        name: "Badgio: Product Label & Badges",
        image: "./images/apps-img/app4.png",
    },
    {
        name: "Jobo Bundle",
        image: "./images/apps-img/app5.png",
    },
    {
        name: "Stylo Store: Theme Sections",
        image: "./images/apps-img/app6.png",
    },
    {
        name: "AptBook : Appointment Booking",
        image: "./images/apps-img/app7.png",
    },
];


export const availableTags = ['English', 'French', 'Hindi', 'Japanese', 'Russian', 'Shona', 'Sesotho', 'Spanish', 'Tajik'];

export const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
];


export const consultantsData = [
    {
        id: 1,
        name: 'Arlene McCoy',
        image: '',
        profession: 'Psychologist - Adult, Adolescent',
        languages: ['Hindi', 'English'],
        experience: 12,
        rating: 4.5,
        testimonials: 23,
        startingPrice: 1200,
        chatPrice: 800,
        audioPrice: 1200,
        videoPrice: 1500,
        expertise: ['Depression', 'Anxiety', 'Family', 'Couple'],
        isActive: true
    },
    {
        id: 2,
        name: 'Kalabhairavar',
        image: '',
        profession: 'Vedic, Numerology',
        languages: ['Tamil', 'English'],
        experience: 10,
        rating: 4.8,
        testimonials: 45,
        startingPrice: 800,
        chatPrice: 500,
        audioPrice: 800,
        videoPrice: 1000,
        expertise: ['Vedic Astrology', 'Numerology', 'Palmistry'],
        isActive: false
    },
    {
        id: 3,
        name: 'Nivansh',
        image: '',
        profession: 'Vedic, Numerology, Vastu',
        languages: ['Hindi', 'Bhojpuri'],
        experience: 8,
        rating: 4.7,
        testimonials: 32,
        startingPrice: 1000,
        chatPrice: 600,
        audioPrice: 1000,
        videoPrice: 1200,
        expertise: ['Vastu', 'Numerology', 'Feng Shui'],
        isActive: true
    },
    {
        id: 4,
        name: 'Sahaskrit',
        image: '',
        profession: 'Vedic, Face Reading',
        languages: ['Hindi', 'English'],
        experience: 15,
        rating: 4.9,
        testimonials: 67,
        startingPrice: 1500,
        chatPrice: 1000,
        audioPrice: 1500,
        videoPrice: 1800,
        expertise: ['Face Reading', 'Vedic', 'Palmistry'],
        isActive: true
    },
    {
        id: 5,
        name: 'Jigneshwar',
        image: '/images/team/team1.avif',
        profession: 'Vedic',
        languages: ['Hindi', 'Bengali'],
        experience: 6,
        rating: 4.6,
        testimonials: 28,
        startingPrice: 700,
        chatPrice: 400,
        audioPrice: 700,
        videoPrice: 900,
        expertise: ['Vedic', 'Astrology', 'Remedies'],
        isActive: false
    },
    {
        id: 6,
        name: 'Shonaaya',
        image: '/images/team/t6.jpg',
        profession: 'Numerology, Tarot, Face Reading',
        languages: ['Hindi', 'Punjabi'],
        experience: 9,
        rating: 4.8,
        testimonials: 41,
        startingPrice: 1100,
        chatPrice: 700,
        audioPrice: 1100,
        videoPrice: 1300,
        expertise: ['Tarot', 'Numerology', 'Crystal Healing'],
        isActive: true
    }
];



export const DashboardIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
);

export const UsersIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

export const ChatIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);
