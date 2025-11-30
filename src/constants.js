import { Shield, Zap, Wrench, Smile, Cpu } from 'lucide-react';

export const RAW_CITIES = [
    // North India
    { name: "Chandigarh", region: "North India", lat: 30.7333, lng: 76.7794 },
    { name: "Manali", region: "North India", lat: 32.2432, lng: 77.1892 },
    { name: "Jaipur", region: "North India", lat: 26.9124, lng: 75.7873 },
    { name: "New Delhi", region: "North India", lat: 28.6139, lng: 77.2090 },
    { name: "Delhi", region: "North India", lat: 28.7041, lng: 77.1025 },
    { name: "Lucknow", region: "North India", lat: 26.8467, lng: 80.9462 },
    { name: "Kanpur", region: "North India", lat: 26.4499, lng: 80.3319 },
    { name: "Ludhiana", region: "North India", lat: 30.9010, lng: 75.8573 },
    { name: "Amritsar", region: "North India", lat: 31.6340, lng: 74.8723 },
    { name: "Srinagar", region: "North India", lat: 34.0837, lng: 74.7973 },
    { name: "Dehradun", region: "North India", lat: 30.3165, lng: 78.0322 },
    { name: "Gurgaon", region: "North India", lat: 28.4595, lng: 77.0266 },
    { name: "Noida", region: "North India", lat: 28.5355, lng: 77.3910 },

    // North-East India
    { name: "Agartala", region: "North-East India", lat: 23.8315, lng: 91.2868 },
    { name: "Aizawl", region: "North-East India", lat: 23.7271, lng: 92.7176 },
    { name: "Kohima", region: "North-East India", lat: 25.6701, lng: 94.1077 },
    { name: "Dimapur", region: "North-East India", lat: 25.9060, lng: 93.7272 },
    { name: "Guwahati", region: "North-East India", lat: 26.1445, lng: 91.7362 },
    { name: "Shillong", region: "North-East India", lat: 25.5788, lng: 91.8933 },
    { name: "Imphal", region: "North-East India", lat: 24.8170, lng: 93.9368 },
    { name: "Gangtok", region: "North-East India", lat: 27.3389, lng: 88.6065 },

    // West India
    { name: "Mumbai", region: "West India", lat: 19.0760, lng: 72.8777 },
    { name: "Pune", region: "West India", lat: 18.5204, lng: 73.8567 },
    { name: "Nagpur", region: "West India", lat: 21.1458, lng: 79.0882 },
    { name: "Nashik", region: "West India", lat: 19.9975, lng: 73.7898 },
    { name: "Ahmedabad", region: "West India", lat: 23.0225, lng: 72.5714 },
    { name: "Surat", region: "West India", lat: 21.1702, lng: 72.8311 },
    { name: "Vadodara", region: "West India", lat: 22.3072, lng: 73.1812 },
    { name: "Rajkot", region: "West India", lat: 22.3039, lng: 70.8022 },
    { name: "Goa", region: "West India", lat: 15.2993, lng: 74.1240 },
    { name: "Panaji", region: "West India", lat: 15.4909, lng: 73.8278 },

    // South India
    { name: "Bangalore", region: "South India", lat: 12.9716, lng: 77.5946 },
    { name: "Bengaluru", region: "South India", lat: 12.9716, lng: 77.5946 },
    { name: "Chennai", region: "South India", lat: 13.0827, lng: 80.2707 },
    { name: "Hyderabad", region: "South India", lat: 17.3850, lng: 78.4867 },
    { name: "Kochi", region: "South India", lat: 9.9312, lng: 76.2673 },
    { name: "Thiruvananthapuram", region: "South India", lat: 8.5241, lng: 76.9366 },
    { name: "Coimbatore", region: "South India", lat: 11.0168, lng: 76.9558 },
    { name: "Visakhapatnam", region: "South India", lat: 17.6868, lng: 83.2185 },
    { name: "Mysore", region: "South India", lat: 12.2958, lng: 76.6394 },

    // East India
    { name: "Kolkata", region: "East India", lat: 22.5726, lng: 88.3639 },
    { name: "Patna", region: "East India", lat: 25.5941, lng: 85.1376 },
    { name: "Ranchi", region: "East India", lat: 23.3441, lng: 85.3096 },
    { name: "Bhubaneswar", region: "East India", lat: 20.2961, lng: 85.8245 },
    { name: "Raipur", region: "East India", lat: 21.2514, lng: 81.6296 },

    // Central India
    { name: "Bhopal", region: "Central India", lat: 23.2599, lng: 77.4126 },
    { name: "Indore", region: "Central India", lat: 22.7196, lng: 75.8577 },
    { name: "Gwalior", region: "Central India", lat: 26.2183, lng: 78.1828 },
    { name: "Jabalpur", region: "Central India", lat: 23.1815, lng: 79.9864 }
];

export const CATEGORIES = [
    { id: 'safety', label: 'Safety', icon: Shield, color: '#005696' }, // Bajaj Blue
    { id: 'engine', label: 'Engine', icon: Zap, color: '#f59e0b' },   // Amber
    { id: 'maintenance', label: 'Maint.', icon: Wrench, color: '#64748b' }, // Slate
    { id: 'comfort', label: 'Comfort', icon: Smile, color: '#10b981' }, // Emerald
    { id: 'tech', label: 'Tech', icon: Cpu, color: '#6366f1' }     // Indigo
];

export const N8N_WEBHOOK_URL = 'https://n8n.dnklabs.xyz/webhook-test/motostock-analyse';
export const N8N_WEBHOOK_URL2 = 'https://n8n.dnklabs.xyz/webhook/motostock-restock';
export const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQKLJLBavG8yW1uZdo1cw_ur0iCPDXBR8KUd8jp4hrRSdHSwXMq2xOCU-pR0_sXznMl990JhV_YRwdr/pub?gid=0&single=true&output=csv';
