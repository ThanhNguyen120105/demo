import { 
  faVirus, faPills, faShieldVirus, faUserDoctor, 
  faHeartbeat, faUsers, faFlask, faHandHoldingMedical 
} from '@fortawesome/free-solid-svg-icons';

// Stats 
export const stats = [
  { value: '20+', label: 'Years of Experience' },
  { value: '15,000+', label: 'Patients Treated' },
  { value: '30+', label: 'Specialist Doctors' },
  { value: '98%', label: 'Treatment Success Rate' },
];

// Services
export const services = [
  {
    id: 1,
    title: 'HIV Testing & Screening',
    slug: 'testing',
    icon: faVirus,
    description: 'Advanced HIV testing services with rapid results and complete confidentiality.',
    fullDescription: "Our HIV Testing & Screening services offer the latest in diagnostic technology, providing accurate results with complete confidentiality. We offer multiple testing options including:\n\n• Rapid HIV antibody tests\n• Nucleic acid tests (NAT)\n• Antigen/antibody combination tests\n• Home testing kits\n\nOur knowledgeable staff provides pre and post-test counseling, ensuring you understand your results and next steps.",
    image: '/images/services/testing.jpg'
  },
  {
    id: 2,
    title: 'Antiretroviral Therapy',
    slug: 'treatment',
    icon: faPills,
    description: 'Personalized treatment plans using the latest antiretroviral medications and therapies.',
    fullDescription: "Our Antiretroviral Therapy (ART) program offers personalized treatment plans using the latest medications and therapeutic approaches. Our comprehensive care includes:\n\n• Customized medication regimens\n• Regular monitoring and adjustment\n• Medication adherence support\n• Management of medication side effects\n• Access to clinical trials of new therapies\n\nOur goal is to achieve viral suppression, improve immune function, and enhance your overall quality of life.",
    image: '/images/services/treatment.jpg'
  },
  {
    id: 3,
    title: 'PrEP & Prevention',
    slug: 'prevention',
    icon: faShieldVirus,
    description: 'Pre-exposure prophylaxis (PrEP) and comprehensive prevention strategies and education.',
    fullDescription: "Our Prevention services focus on reducing HIV transmission through comprehensive education and medical interventions. We provide:\n\n• Pre-exposure prophylaxis (PrEP) prescriptions and monitoring\n• Post-exposure prophylaxis (PEP) for emergency cases\n• Risk reduction counseling\n• Safe sex education and resources\n• Regular STI screening and treatment\n\nOur prevention specialists work with you to develop strategies that fit your lifestyle and needs.",
    image: '/images/services/prevention.jpg'
  },
  {
    id: 4,
    title: 'Counseling Services',
    slug: 'counseling',
    icon: faUserDoctor,
    description: 'Professional mental health support specializing in HIV-related psychological challenges.',
    fullDescription: "Our Counseling Services address the emotional and psychological aspects of living with HIV. Our licensed mental health professionals specialize in:\n\n• Coping with diagnosis\n• Managing anxiety and depression\n• Relationship and disclosure counseling\n• Substance use disorders\n• Trauma-informed care\n\nWe offer individual, couple, and group counseling sessions in a supportive, confidential environment.",
    image: '/images/services/counseling.jpg'
  },
  {
    id: 5,
    title: 'Nutrition & Wellness',
    slug: 'nutrition',
    icon: faHeartbeat,
    description: 'Specialized nutrition planning and wellness programs to support overall health with HIV.',
    fullDescription: "Our Nutrition & Wellness programs provide comprehensive support for your physical health. Our registered dietitians and wellness specialists offer:\n\n• Personalized nutrition planning\n• Dietary supplements guidance\n• Management of medication-food interactions\n• Weight management support\n• Exercise and fitness programs\n\nOur holistic approach ensures your body has the optimal support for immune function and overall health.",
    image: '/images/services/nutrition.jpg'
  },
  {
    id: 6,
    title: 'Support Groups',
    slug: 'support',
    icon: faUsers,
    description: 'Peer support and community connection for individuals living with or affected by HIV.',
    fullDescription: "Our Support Groups provide vital community connection and peer support. We offer a variety of groups including:\n\n• Newly diagnosed individuals\n• Long-term survivors\n• Young adults living with HIV\n• Women's support group\n• LGBTQ+ focused groups\n• Family and partner support\n\nAll groups are facilitated by trained professionals in a safe, confidential environment where experiences can be shared.",
    image: '/images/services/support.jpg'
  },
  {
    id: 7,
    title: 'Research Programs',
    slug: 'research',
    icon: faFlask,
    description: 'Participation opportunities in cutting-edge HIV treatment and prevention research studies.',
    fullDescription: "Our Research Programs connect patients with opportunities to participate in cutting-edge studies. Our research initiatives include:\n\n• Clinical trials for new medications\n• Treatment optimization studies\n• Long-term outcome research\n• Quality of life improvement studies\n• Vaccine development trials\n\nParticipation is always voluntary, and our research team ensures you're fully informed about any study before enrollment.",
    image: '/images/services/research.jpg'
  },
  {
    id: 8,
    title: 'Case Management',
    slug: 'case-management',
    icon: faHandHoldingMedical,
    description: 'Comprehensive assistance with healthcare coordination, social services, and practical support.',
    fullDescription: "Our Case Management services help navigate the complex healthcare and support system. Our case managers assist with:\n\n• Healthcare coordination\n• Insurance and benefits navigation\n• Housing assistance\n• Employment resources\n• Transportation services\n• Legal referrals\n\nYour dedicated case manager works as your advocate, ensuring you have access to all needed resources and support.",
    image: '/images/services/case-management.jpg'
  }
];

// Doctors/Specialists
export const doctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Infectious Disease Specialist',
    image: '/images/doctors/doctor1.jpg',
    shortBio: 'Board-certified specialist with 15+ years of HIV treatment experience.',
    fullBio: "Dr. Sarah Johnson is a board-certified Infectious Disease Specialist with over 15 years of experience in HIV medicine. She completed her medical degree at Johns Hopkins University, followed by a residency in Internal Medicine and fellowship in Infectious Diseases at UCSF.\n\nDr. Johnson has published extensively on antiretroviral therapy optimization and has been recognized for her patient-centered approach to care. She serves as the Director of our Antiretroviral Therapy program and is actively involved in clinical research.",
    education: [
      'MD, Johns Hopkins University School of Medicine',
      'Residency in Internal Medicine, UCSF',
      'Fellowship in Infectious Diseases, UCSF'
    ],
    certifications: [
      'Board Certified in Infectious Disease',
      'American Academy of HIV Medicine Specialist',
      'HIV Medicine Association Certified Provider'
    ]
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialty: 'HIV Clinical Pharmacist',
    image: '/images/doctors/doctor2.jpg',
    shortBio: 'Specialized pharmacist focused on medication management and adherence support.',
    fullBio: "Dr. Michael Chen is our HIV Clinical Pharmacist with specialized training in antiretroviral medication management. He earned his Doctor of Pharmacy degree from the University of Michigan and completed a specialty residency in HIV Pharmacotherapy at Northwestern Memorial Hospital.\n\nDr. Chen works closely with our medical team to optimize medication regimens, manage drug interactions, and develop adherence strategies. He also leads our medication education programs and support groups for patients starting new treatments.",
    education: [
      'PharmD, University of Michigan College of Pharmacy',
      'HIV Pharmacotherapy Residency, Northwestern Memorial Hospital'
    ],
    certifications: [
      'Board Certified Infectious Diseases Pharmacist',
      'American Academy of HIV Medicine Credentialed Pharmacist',
      'Certified in HIV Medication Therapy Management'
    ]
  },
  {
    id: 3,
    name: 'Dr. Amara Okafor',
    specialty: 'HIV Primary Care Physician',
    image: '/images/doctors/doctor3.jpg',
    shortBio: 'Comprehensive primary care with specialization in HIV and preventive health.',
    fullBio: "Dr. Amara Okafor is our HIV Primary Care Physician, providing comprehensive healthcare for patients living with HIV. She received her medical degree from Howard University College of Medicine and completed her residency in Family Medicine at Emory University.\n\nDr. Okafor specializes in managing the primary healthcare needs of people living with HIV, including preventive care, chronic disease management, and health maintenance. She is known for her holistic approach to patient care and strong emphasis on patient education.",
    education: [
      'MD, Howard University College of Medicine',
      'Residency in Family Medicine, Emory University',
      'HIV Medicine Fellowship, Grady Health System'
    ],
    certifications: [
      'Board Certified in Family Medicine',
      'American Academy of HIV Medicine Specialist',
      'Certified in HIV Primary Care'
    ]
  },
  {
    id: 4,
    name: 'Dr. Robert Garcia',
    specialty: 'Psychiatrist, HIV Mental Health',
    image: '/images/doctors/doctor4.jpg',
    shortBio: 'Mental health specialist with expertise in HIV-related psychological challenges.',
    fullBio: "Dr. Robert Garcia is our HIV Mental Health Psychiatrist with special expertise in the psychological aspects of living with HIV. He earned his medical degree from Stanford University School of Medicine and completed his psychiatry residency at UCLA.\n\nDr. Garcia specializes in treating depression, anxiety, trauma, and adjustment disorders in the context of HIV diagnosis and treatment. He integrates medication management with psychotherapeutic approaches to provide comprehensive mental health care.",
    education: [
      'MD, Stanford University School of Medicine',
      'Psychiatry Residency, UCLA Medical Center',
      'Fellowship in HIV Psychiatry, San Francisco General Hospital'
    ],
    certifications: [
      'Board Certified in Psychiatry',
      'Certification in HIV Psychiatry',
      'American Academy of HIV Medicine Member'
    ]
  },
  {
    id: 5,
    name: 'Dr. Lisa Wong',
    specialty: 'Research Director, HIV Vaccine Studies',
    image: '/images/doctors/doctor5.jpg',
    shortBio: 'Leading researcher in HIV vaccine development and immunotherapy approaches.',
    fullBio: "Dr. Lisa Wong is our Research Director specializing in HIV vaccine development and immunotherapy approaches. She holds an MD and PhD from Yale University and completed her Infectious Disease fellowship at Massachusetts General Hospital.\n\nDr. Wong leads our clinical research department, overseeing trials of new antiretroviral medications, treatment strategies, and preventive vaccines. Her own research focuses on novel immunotherapeutic approaches to HIV treatment and potential curative strategies.",
    education: [
      'MD/PhD, Yale University',
      'Residency in Internal Medicine, Brigham and Women\'s Hospital',
      'Fellowship in Infectious Diseases, Massachusetts General Hospital'
    ],
    certifications: [
      'Board Certified in Infectious Disease',
      'Clinical Research Certification',
      'Good Clinical Practice Certification'
    ]
  },
  {
    id: 6,
    name: 'Dr. James Wilson',
    specialty: 'Nutritionist, HIV Metabolic Care',
    image: '/images/doctors/doctor6.jpg',
    shortBio: 'Nutrition expert specializing in metabolic complications of HIV and its treatments.',
    fullBio: "Dr. James Wilson is our HIV Metabolic Care Nutritionist, specializing in the nutritional and metabolic aspects of HIV and its treatments. He holds a PhD in Nutritional Sciences from Cornell University and completed specialized training in HIV nutrition.\n\nDr. Wilson helps patients manage medication-related metabolic changes, develop optimal nutrition plans, and address weight management concerns. He works closely with our medical team to integrate nutritional care into overall treatment plans.",
    education: [
      'PhD in Nutritional Sciences, Cornell University',
      'MS in Dietetics, University of North Carolina',
      'Fellowship in HIV Nutrition, San Francisco General Hospital'
    ],
    certifications: [
      'Registered Dietitian Nutritionist',
      'Certified Nutrition Support Clinician',
      'Specialist in HIV Nutrition Therapy'
    ]
  },
  {
    id: 7,
    name: 'Dr. Emma Rodriguez',
    specialty: 'PrEP & Prevention Specialist',
    image: '/images/doctors/doctor7.jpg',
    shortBio: 'Focused on HIV prevention strategies, PrEP management, and education.',
    fullBio: "Dr. Emma Rodriguez is our PrEP and Prevention Specialist, focused on HIV prevention strategies and education. She received her medical degree from University of California, San Francisco and completed her training in Preventive Medicine.\n\nDr. Rodriguez oversees our PrEP (Pre-Exposure Prophylaxis) program, providing consultations, prescriptions, and monitoring for individuals seeking HIV prevention. She also leads our community education initiatives and risk-reduction counseling programs.",
    education: [
      'MD, University of California, San Francisco',
      'Residency in Preventive Medicine, Emory University',
      'MPH, Emory Rollins School of Public Health'
    ],
    certifications: [
      'Board Certified in Preventive Medicine',
      'American Academy of HIV Medicine PrEP Provider',
      'Certified in Public Health'
    ]
  },
  {
    id: 8,
    name: 'Dr. David Thompson',
    specialty: 'Case Management Director',
    image: '/images/doctors/doctor8.jpg',
    shortBio: 'Social work professional leading comprehensive support services coordination.',
    fullBio: "Dr. David Thompson is our Case Management Director, leading our comprehensive support services. He holds a PhD in Social Work from Columbia University with specialized training in healthcare coordination and HIV support services.\n\nDr. Thompson oversees our team of case managers who help patients navigate healthcare systems, access resources, and coordinate care. His approach emphasizes patient empowerment and addressing social determinants of health to improve treatment outcomes.",
    education: [
      'PhD in Social Work, Columbia University',
      'MSW, University of Michigan',
      'Certificate in Healthcare Management, Johns Hopkins University'
    ],
    certifications: [
      'Licensed Clinical Social Worker',
      'Certified Case Manager',
      'HIV Care Coordination Specialist'
    ]
  }
];

// News & Articles
export const news = [
  {
    id: 1,
    title: 'New Long-Acting HIV Treatment Approved by FDA',
    slug: 'new-long-acting-hiv-treatment',
    image: '/images/news/news1.jpg',
    date: {
      day: '15',
      month: 'May',
      year: '2023',
      full: 'May 15, 2023'
    },
    summary: 'The FDA has approved a new long-acting injectable HIV treatment that only requires dosing every two months.',
    content: "In a significant advancement for HIV treatment, the FDA has approved a new long-acting injectable medication that only requires dosing once every two months. This breakthrough offers an alternative to daily oral medications that have been the standard of care for decades.\n\nThe new treatment, which combines two antiretroviral medications in a single injection, demonstrated high efficacy in clinical trials with a safety profile comparable to daily oral regimens. For many patients, this could represent a transformative option that simplifies treatment and potentially improves adherence.\n\n\"This approval marks a paradigm shift in how we approach HIV treatment,\" says Dr. Sarah Johnson, our Infectious Disease Specialist. \"For patients who struggle with daily pills or simply prefer a different option, this long-acting treatment could significantly improve quality of life while maintaining viral suppression.\"\n\nOur center will begin offering this treatment option to eligible patients starting next month. Interested individuals should schedule a consultation with their HIV care provider to discuss whether this new option is appropriate for their care plan.",
    author: 'Medical Team',
    category: 'Treatment Updates'
  },
  {
    id: 2,
    title: 'HIV Prevention: PrEP Awareness Week Events Announced',
    slug: 'prep-awareness-week-events',
    image: '/images/news/news2.jpg',
    date: {
      day: '03',
      month: 'Jun',
      year: '2023',
      full: 'June 3, 2023'
    },
    summary: 'Our center will host a series of educational events during National PrEP Awareness Week to promote HIV prevention.',
    content: "In recognition of National PrEP Awareness Week, our HIV Treatment Center will host a series of educational events and free screening services focused on HIV prevention. Pre-Exposure Prophylaxis (PrEP) is a medication regimen that can prevent HIV infection in HIV-negative individuals who may be at risk.\n\nThe week-long program will include:\n\n• Free PrEP consultations with our prevention specialists\n• Virtual educational seminars on PrEP eligibility, efficacy, and access\n• HIV testing with same-day results\n• Insurance navigation assistance for PrEP coverage\n• Community forum discussing advances in HIV prevention\n\n\"PrEP is a powerful HIV prevention tool that remains underutilized,\" explains Dr. Emma Rodriguez, our PrEP & Prevention Specialist. \"Our goal is to increase awareness, address misconceptions, and help connect eligible individuals with this important prevention option.\"\n\nAll events are free and open to the public. Some services may require advance registration. Visit our PrEP Services page for the complete schedule and registration information.",
    author: 'Prevention Team',
    category: 'Events'
  },
  {
    id: 3,
    title: 'Research Study: Participants Needed for HIV Treatment Optimization Trial',
    slug: 'research-study-treatment-optimization',
    image: '/images/news/news3.jpg',
    date: {
      day: '22',
      month: 'Apr',
      year: '2023',
      full: 'April 22, 2023'
    },
    summary: 'Our research department is recruiting participants for a new study evaluating simplified treatment regimens.',
    content: "The Research Department at our HIV Treatment Center is currently recruiting participants for a clinical trial investigating optimized antiretroviral therapy regimens. The study aims to evaluate the efficacy and safety of simplified treatment approaches that may reduce pill burden and potential long-term side effects.\n\nEligible participants include adults living with HIV who:\n• Have been on stable antiretroviral therapy for at least 12 months\n• Currently have undetectable viral loads\n• Have no history of treatment resistance\n• Meet additional health criteria\n\nStudy participation involves regular clinic visits over a 96-week period, with all study-related care and medications provided at no cost. Participants will also receive compensation for their time and travel expenses.\n\n\"This study represents an important step in our ongoing effort to improve HIV treatment,\" says Dr. Lisa Wong, our Research Director. \"By exploring simplified regimens, we hope to develop options that maintain excellent viral suppression while potentially improving quality of life and long-term health outcomes.\"\n\nInterested individuals can learn more by contacting our Research Department or speaking with their HIV care provider about a referral to the study team.",
    author: 'Research Department',
    category: 'Research'
  },
  {
    id: 4,
    title: 'Mental Health and HIV: New Support Group Launching',
    slug: 'mental-health-support-group',
    image: '/images/news/news4.jpg',
    date: {
      day: '10',
      month: 'Mar',
      year: '2023',
      full: 'March 10, 2023'
    },
    summary: 'A new specialized support group addressing mental health challenges specific to living with HIV begins next month.',
    content: "Our center is launching a new support group focused specifically on mental health for individuals living with HIV. The group, facilitated by Dr. Robert Garcia, our HIV Mental Health Psychiatrist, will address the unique psychological challenges that can accompany an HIV diagnosis and ongoing treatment.\n\nThe support group will meet weekly and cover topics including:\n• Managing anxiety and depression\n• Coping strategies for HIV-related stress\n• Dealing with stigma and disclosure concerns\n• Building resilience and self-care practices\n• Mindfulness and stress reduction techniques\n\n\"Mental health is a crucial component of overall wellbeing for people living with HIV,\" explains Dr. Garcia. \"This group will provide both professional guidance and peer support in a safe, confidential environment where participants can share experiences and develop coping skills.\"\n\nThe group is open to all patients of our center at no additional cost. Sessions will be held both in-person and via secure video connection to maximize accessibility. Interested individuals should contact our Mental Health Services department for more information or to register.",
    author: 'Mental Health Team',
    category: 'Support Services'
  },
  {
    id: 5,
    title: 'Nutrition Workshop Series: Managing Side Effects Through Diet',
    slug: 'nutrition-workshop-side-effects',
    image: '/images/news/news5.jpg',
    date: {
      day: '18',
      month: 'Feb',
      year: '2023',
      full: 'February 18, 2023'
    },
    summary: 'Upcoming workshop series will focus on dietary strategies to manage treatment side effects and improve overall health.',
    content: "Our HIV Treatment Center is offering a new series of nutrition workshops focused on managing medication side effects and optimizing health through dietary approaches. Led by Dr. James Wilson, our HIV Metabolic Care Nutritionist, the four-part series will provide practical strategies and personalized guidance.\n\nWorkshop topics include:\n• Dietary approaches to manage gastrointestinal side effects\n• Nutrition strategies for metabolic changes and lipid management\n• Meal planning for energy optimization and weight maintenance\n• Supplement guidance and nutrient-medication interactions\n\n\"Nutrition plays a vital role in HIV care, both in supporting immune function and in managing treatment side effects,\" says Dr. Wilson. \"These workshops will offer evidence-based, practical approaches that patients can implement in their daily lives.\"\n\nEach workshop includes a demonstration component with recipes and sample meal plans. Participants can attend individual sessions or the complete series. Registration is required, and a sliding scale fee is available to ensure accessibility for all patients.",
    author: 'Nutrition Services',
    category: 'Wellness'
  },
  {
    id: 6,
    title: 'HIV and Aging: Specialized Care Program Expansion',
    slug: 'hiv-aging-program-expansion',
    image: '/images/news/news6.jpg',
    date: {
      day: '05',
      month: 'Jan',
      year: '2023',
      full: 'January 5, 2023'
    },
    summary: 'Our center expands services specifically designed for the growing population of older adults living with HIV.',
    content: "Recognizing the unique health needs of the growing population of older adults living with HIV, our center has expanded its specialized HIV and Aging program. The enhanced program integrates HIV care with geriatric medicine approaches to address the complex healthcare needs of this population.\n\nThe expanded services include:\n• Comprehensive geriatric assessments for HIV patients over 50\n• Management of HIV alongside age-related conditions\n• Medication reviews to minimize drug interactions and side effects\n• Cognitive health monitoring and support\n• Specialized support groups for long-term survivors\n\n\"As antiretroviral therapy has transformed HIV into a manageable chronic condition, we're seeing more patients living into their 60s, 70s, and beyond,\" explains Dr. Amara Okafor, who leads the HIV and Aging initiative. \"These individuals face unique challenges, including accelerated aging processes and managing HIV alongside other age-related conditions.\"\n\nThe program's multidisciplinary team includes infectious disease specialists, geriatricians, pharmacists, and social workers who collaborate to provide coordinated care. Patients interested in the HIV and Aging program should speak with their primary HIV provider for a referral.",
    author: 'Clinical Care Team',
    category: 'Patient Care'
  }
];

// Testimonials
export const testimonials = [
  {
    id: 1,
    name: 'Marcus T.',
    image: '/images/testimonials/testimonial1.jpg',
    quote: "The care I've received at this center has been transformative. From my first visit, the team has treated me with compassion and respect, developing a treatment plan that works for my specific needs.",
    rating: 5
  },
  {
    id: 2,
    name: 'Jennifer L.',
    image: '/images/testimonials/testimonial2.jpg',
    quote: "Finding this HIV treatment center was life-changing. The comprehensive approach to care addresses not just my medical needs but my overall wellbeing. The support groups have connected me with a community I didn't know I needed.",
    rating: 5
  },
  {
    id: 3,
    name: 'David H.',
    image: '/images/testimonials/testimonial3.jpg',
    quote: "The prevention services team is knowledgeable and non-judgmental. They've helped me navigate PrEP options and regular testing in a way that fits my lifestyle and needs.",
    rating: 5
  },
  {
    id: 4,
    name: 'Sophia R.',
    image: '/images/testimonials/testimonial4.jpg',
    quote: 'I appreciate the holistic approach to HIV care at this center. My treatment plan includes not just medications but nutrition guidance, mental health support, and wellness strategies.',
    rating: 5
  },
  {
    id: 5,
    name: 'Michael J.',
    image: '/images/testimonials/testimonial5.jpg',
    quote: "After living with HIV for over 20 years, I've experienced many healthcare settings. This center stands out for its combination of cutting-edge treatment options and genuinely compassionate care.",
    rating: 5
  }
];

// FAQ
export const faqs = [
  {
    id: 1,
    question: 'What HIV testing options do you offer?',
    answer: 'We offer a comprehensive range of HIV testing options including rapid antibody tests (results in 20-30 minutes), standard HIV antibody tests, RNA tests for early detection, and at-home testing kits. All testing is confidential, and our counselors provide pre and post-test guidance. Most insurance plans are accepted, and we also offer free testing options for those who qualify.'
  },
  {
    id: 2,
    question: 'How soon after potential exposure should I get tested?',
    answer: "The timing of HIV testing depends on the type of test used. Antibody tests can detect HIV 23-90 days after exposure. Antigen/antibody tests can detect HIV 18-45 days after exposure. Nucleic acid tests (NAT) can detect HIV about 10-33 days after exposure. If you've had a recent potential exposure, we recommend consulting with our healthcare providers who can advise on the most appropriate testing timeline and options for your situation."
  },
  {
    id: 3,
    question: 'What is PrEP and how effective is it?',
    answer: 'PrEP (Pre-Exposure Prophylaxis) is a medication taken by HIV-negative individuals to prevent HIV infection. When taken as prescribed, PrEP reduces the risk of getting HIV from sex by about 99% and from injection drug use by at least 74%. Our center provides PrEP prescriptions, regular monitoring, and support services to ensure safe and effective use. We also help navigate insurance coverage and assistance programs to make PrEP affordable.'
  },
  {
    id: 4,
    question: 'What should I do if I\'ve been recently exposed to HIV?',
    answer: "If you believe you've been exposed to HIV in the last 72 hours, come to our center immediately or go to an emergency room to ask about PEP (Post-Exposure Prophylaxis). PEP is emergency medication that can prevent HIV infection if started quickly after exposure. The sooner PEP is started, the more effective it is—ideally within 24 hours, but it can be started up to 72 hours after exposure. Our center provides PEP services with follow-up care and support."
  },
  {
    id: 5,
    question: 'How often do I need to see my doctor for HIV care?',
    answer: 'The frequency of HIV care visits depends on your individual health status, treatment plan, and how recently you were diagnosed. Typically, new patients or those starting treatment may have visits every 1-3 months. Once stable on treatment with an undetectable viral load, visits may be scheduled every 3-6 months. Each visit includes monitoring of your viral load, CD4 count, overall health, and medication effectiveness. Our care team will develop a follow-up schedule tailored to your specific needs.'
  },
  {
    id: 6,
    question: 'What support services do you offer beyond medical care?',
    answer: 'We offer a comprehensive range of support services including: case management to help with healthcare coordination and access to resources; mental health services including individual therapy and support groups; nutrition counseling; medication adherence support; insurance navigation; substance use treatment referrals; housing and transportation assistance; dental care referrals; and legal services referrals. Our goal is to address all factors that impact your health and quality of life.'
  },
  {
    id: 7,
    question: 'How do I enroll as a new patient at your center?',
    answer: "To become a new patient, you can start by calling our intake line or filling out the new patient form on our website. We'll schedule an initial appointment where you'll meet with a case manager and a healthcare provider. Please bring your identification, insurance information, and any medical records or medication lists if available. During this first visit, we'll collect your medical history, perform baseline laboratory tests, and begin developing your personalized care plan. We welcome all patients regardless of insurance status or ability to pay."
  }
];

// Locations
export const locations = [
  {
    id: 1,
    name: 'Main Treatment Center',
    address: '123 Medical Center Drive, Suite 200, New York, NY 10001',
    phone: '(800) 123-4567',
    email: 'info@hivtreatmentcenter.org',
    hours: 'Monday-Friday: 8:00 AM - 6:00 PM, Saturday: 9:00 AM - 1:00 PM',
    coordinates: {
      lat: 40.7128,
      lng: -74.0060
    },
    services: [
      'HIV Testing & Screening',
      'Antiretroviral Therapy',
      'PrEP & Prevention',
      'Counseling Services',
      'Case Management',
      'Nutrition & Wellness',
      'Support Groups',
      'Research Programs'
    ]
  },
  {
    id: 2,
    name: 'Downtown Clinic',
    address: '456 Community Health Blvd, New York, NY 10002',
    phone: '(800) 123-4569',
    email: 'downtown@hivtreatmentcenter.org',
    hours: 'Monday-Friday: 10:00 AM - 8:00 PM, Saturday: 10:00 AM - 2:00 PM',
    coordinates: {
      lat: 40.7112,
      lng: -73.9974
    },
    services: [
      'HIV Testing & Screening',
      'PrEP & Prevention',
      'Antiretroviral Therapy',
      'Walk-in Testing Services',
      'Youth-Focused Programs'
    ]
  },
  {
    id: 3,
    name: 'Research & Education Center',
    address: '789 Innovation Way, Suite 300, New York, NY 10003',
    phone: '(800) 123-4570',
    email: 'research@hivtreatmentcenter.org',
    hours: 'Monday-Friday: 9:00 AM - 5:00 PM',
    coordinates: {
      lat: 40.7281,
      lng: -73.9942
    },
    services: [
      'Clinical Trials',
      'Research Programs',
      'Educational Workshops',
      'Professional Training',
      'Community Outreach'
    ]
  }
]; 