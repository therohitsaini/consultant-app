import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ConsultantCards.css';

function ViewProfile() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Sample consultant data (in real app, this would come from API)
    const consultants = [
        {
            id: 1,
            name: 'Arlene McCoy',
            image: '/images/team/t1.jpg',
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
            isActive: true,
            about: 'Arlene McCoy is a licensed psychologist with over 12 years of experience in helping individuals, couples, and families navigate through life\'s challenges. She specializes in treating depression, anxiety disorders, and relationship issues. Her compassionate approach and evidence-based techniques have helped hundreds of clients achieve better mental health and well-being.',
            education: 'Ph.D. in Clinical Psychology, Master\'s in Counseling Psychology',
            certifications: ['Licensed Clinical Psychologist', 'Certified Family Therapist', 'Cognitive Behavioral Therapy Specialist'],
            reviews: [
                { name: 'Rajesh Kumar', rating: 5, comment: 'Excellent therapist! Helped me overcome my anxiety.', date: '2 weeks ago' },
                { name: 'Priya Sharma', rating: 5, comment: 'Very understanding and professional. Highly recommend!', date: '1 month ago' },
                { name: 'Amit Patel', rating: 4, comment: 'Good experience overall. Would visit again.', date: '2 months ago' }
            ]
        },
        {
            id: 2,
            name: 'Kalabhairavar',
            image: '/images/team/t2.jpg',
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
            isActive: false,
            about: 'Kalabhairavar is a renowned Vedic astrologer and numerologist with over 10 years of experience. He combines traditional Vedic wisdom with modern interpretations to provide accurate predictions and guidance.',
            education: 'Master\'s in Vedic Astrology, Certified Numerologist',
            certifications: ['Certified Vedic Astrologer', 'Professional Numerologist'],
            reviews: [
                { name: 'Suresh Nair', rating: 5, comment: 'Very accurate predictions!', date: '1 week ago' },
                { name: 'Lakshmi Devi', rating: 5, comment: 'Excellent guidance and remedies.', date: '3 weeks ago' }
            ]
        },
        {
            id: 3,
            name: 'Nivansh',
            image: '/images/team/t3.jpg',
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
            isActive: true,
            about: 'Nivansh specializes in Vastu Shastra, Numerology, and Feng Shui. With 8 years of experience, he helps clients create harmonious living and working spaces.',
            education: 'Diploma in Vastu Shastra, Certified Feng Shui Consultant',
            certifications: ['Vastu Consultant', 'Feng Shui Expert'],
            reviews: [
                { name: 'Vikram Singh', rating: 5, comment: 'Great Vastu consultation!', date: '2 weeks ago' }
            ]
        },
        {
            id: 4,
            name: 'Sahaskrit',
            image: '/images/team/t4.jpg',
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
            isActive: true,
            about: 'Sahaskrit is a master in Vedic astrology and face reading with 15 years of experience. His accurate predictions and insightful readings have helped thousands of clients.',
            education: 'Master\'s in Vedic Studies, Certified Face Reader',
            certifications: ['Master Vedic Astrologer', 'Professional Face Reader'],
            reviews: [
                { name: 'Anjali Mehta', rating: 5, comment: 'Amazing face reading! Very accurate.', date: '1 week ago' },
                { name: 'Rohit Verma', rating: 5, comment: 'Best Vedic consultation I\'ve ever had.', date: '2 weeks ago' }
            ]
        },
        {
            id: 5,
            name: 'Jigneshwar',
            image: '/images/team/t5.jpg',
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
            isActive: false,
            about: 'Jigneshwar is a dedicated Vedic astrologer specializing in providing remedies and solutions for life challenges through traditional Vedic methods.',
            education: 'Bachelor\'s in Vedic Studies',
            certifications: ['Certified Vedic Astrologer'],
            reviews: [
                { name: 'Mohan Das', rating: 4, comment: 'Good consultation.', date: '1 month ago' }
            ]
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
            isActive: true,
            about: 'Shonaaya combines numerology, tarot reading, and crystal healing to provide holistic guidance. With 9 years of experience, she helps clients find clarity and direction.',
            education: 'Certified Tarot Reader, Professional Numerologist',
            certifications: ['Certified Tarot Reader', 'Crystal Healing Practitioner'],
            reviews: [
                { name: 'Kavita Arora', rating: 5, comment: 'Wonderful tarot reading!', date: '1 week ago' },
                { name: 'Harpreet Singh', rating: 5, comment: 'Very insightful numerology analysis.', date: '2 weeks ago' }
            ]
        }
    ];

    const [consultant, setConsultant] = useState(null);

    useEffect(() => {
        const foundConsultant = consultants.find(c => c.id === parseInt(id));
        if (foundConsultant) {
            setConsultant(foundConsultant);
        }
    }, [id]);

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <>
                {Array.from({ length: fullStars }, (_, index) => (
                    <span key={`full-${index}`} className="star-full">★</span>
                ))}
                {hasHalfStar && <span className="star-half">★</span>}
                {Array.from({ length: emptyStars }, (_, index) => (
                    <span key={`empty-${index}`} className="star-empty">★</span>
                ))}
            </>
        );
    };

    // Function to handle calling option selection
    const handleCallingOption = (optionType, consultantId, price) => {
        console.log(`Selected ${optionType} option for consultant ${consultantId} at price INR ${price}`);
        // Here you can add logic to navigate to booking page or open a modal
        alert(`You selected ${optionType.toUpperCase()} call option.\nConsultant ID: ${consultantId}\nPrice: INR ${price.toLocaleString()}`);
    };

    if (!consultant) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <h2>Consultant not found</h2>
                    <button className="btn btn-primary mt-3" onClick={() => navigate('/consultant-cards')}>
                        Back to Consultants
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="view-profile-container">
            <div className="container py-4">
                {/* Back Button */}
                <button className="btn btn-link back-button mb-3" onClick={() => navigate('/consultant-cards')}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back to Consultants
                </button>

                {/* Profile Header */}
                <div className="card shadow-sm border-0 mb-4 profile-header-card">
                    <div className="card-body p-4">
                        {/* Profile Section */}
                        <div className="flex align-items-start mb-3">
                            {/* Profile Image */}
                            <div className="me-4 position-relative flex-shrink-0">
                                <img
                                    src={'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?cs=srgb&dl=pexels-suliman-sallehi-1704488.jpg&fm=jpg'}
                                    alt={consultant.name}
                                    className="rounded-circle profile-image profile-image-large"
                                    onError={(e) => {
                                        e.target.src = '/images/teamdefault.png';
                                    }}
                                />
                                {consultant.isActive && (
                                    <span className="active-status-dot active-status-dot-large"></span>
                                )}
                            </div>

                            {/* Name and Details */}
                            <div className="flex-grow-1">
                                <div className="flex align-items-center gap-2 mb-3">
                                    <h5 className="card-title mb-0 fw-bold consultant-name consultant-name-large">
                                        {consultant.name}
                                    </h5>
                                    <span className="experience-badge experience-badge-large">
                                        {consultant.experience}+ Years of Experience
                                    </span>
                                </div>
                                <p className="mb-3 consultant-profession consultant-profession-large">
                                    {consultant.profession}
                                </p>
                                <div className="flex align-items-center gap-2 flex-wrap mb-3">
                                    <div className="rating-stars rating-stars-large">
                                        {renderStars(consultant.rating)}
                                    </div>
                                    <span className="rating-text rating-text-large">
                                        {consultant.rating}
                                    </span>
                                    <span className="testimonials-text testimonials-text-large">
                                        ({consultant.testimonials} testimonials)
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <hr className="card-divider" />

                        {/* Information Section */}
                        <div className="mb-0">
                            <p className="mb-2 consultant-info">
                                <strong>Speaks:</strong> {consultant.languages.join(', ')}
                            </p>
                            <div className="mb-0">
                                <strong className="consultant-info d-block mb-2">Calling Options:</strong>
                                <div className="calling-options">
                                    <button
                                        className="calling-option-btn chat-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCallingOption('chat', consultant.id, consultant.chatPrice);
                                        }}
                                    >
                                        <div className="calling-option-content">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <span className="calling-option-label">Chat</span>
                                        </div>
                                        <span className="calling-option-price">INR {consultant.chatPrice.toLocaleString()}</span>
                                    </button>
                                    <button
                                        className="calling-option-btn audio-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCallingOption('audio', consultant.id, consultant.audioPrice);
                                        }}
                                    >
                                        <div className="calling-option-content">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone-icon lucide-phone">
                                                <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
                                            </svg>
                                            <span className="calling-option-label">Audio</span>
                                        </div>
                                        <span className="calling-option-price">INR {consultant.audioPrice.toLocaleString()}</span>
                                    </button>
                                    <button
                                        className="calling-option-btn video-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCallingOption('video', consultant.id, consultant.videoPrice);
                                        }}
                                    >
                                        <div className="calling-option-content">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M23 7L16 12L23 17V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M14 5H3C1.9 5 1 5.9 1 7V17C1 18.1 1.9 19 3 19H14C15.1 19 16 18.1 16 17V7C16 5.9 15.1 5 14 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <span className="calling-option-label">Video</span>
                                        </div>
                                        <span className="calling-option-price">INR {consultant.videoPrice.toLocaleString()}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {/* Left Column */}
                    <div className="col-lg-8">
                        {/* About Section */}
                        <div className="card shadow-sm border-0 mb-4">
                            <div className="card-body p-4">
                                <h3 className="section-title mb-3">About</h3>
                                <p className="about-text">{consultant.about}</p>
                            </div>
                        </div>

                        {/* Education & Certifications */}
                        <div className="card shadow-sm border-0 mb-4">
                            <div className="card-body p-4">
                                <h3 className="section-title mb-3">Education & Certifications</h3>
                                <div className="mb-3">
                                    <h5 className="subsection-title">Education</h5>
                                    <p className="info-text">{consultant.education}</p>
                                </div>
                                <div>
                                    <h5 className="subsection-title">Certifications</h5>
                                    <ul className="certifications-list">
                                        {consultant.certifications.map((cert, index) => (
                                            <li key={index}>{cert}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="card shadow-sm border-0 mb-4">
                            <div className="card-body p-4">
                                <h3 className="section-title mb-3">Reviews & Testimonials</h3>
                                <div className="reviews-list">
                                    {consultant.reviews.map((review, index) => (
                                        <div key={index} className="review-item">
                                            <div className="flex justify-content-between align-items-start mb-2">
                                                <div>
                                                    <h6 className="reviewer-name mb-1">{review.name}</h6>
                                                    <div className="flex align-items-center gap-2">
                                                        <div className="rating-stars-small">
                                                            {renderStars(review.rating)}
                                                        </div>
                                                        <span className="review-date">{review.date}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="review-comment mb-0">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="col-lg-4">
                        {/* Expertise Tags */}
                        <div className="card shadow-sm border-0 mb-4">
                            <div className="card-body p-4">
                                <h3 className="section-title mb-3">Expertise</h3>
                                <div className="expertise-tags">
                                    {consultant.expertise.map((tag, index) => (
                                        <span key={index} className="expertise-tag">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Calling Options */}
                        <div className="card shadow-sm border-0">
                            <div className="card-body p-4">
                                <h3 className="section-title mb-3">Calling Options</h3>
                                <div className="calling-options-profile-sidebar">
                                    <button
                                        className="calling-option-btn chat-btn"
                                        onClick={() => handleCallingOption('chat', consultant.id, consultant.chatPrice)}
                                        title={`Chat - INR ${consultant.chatPrice.toLocaleString()}`}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                    <button
                                        className="calling-option-btn audio-btn"
                                        onClick={() => handleCallingOption('audio', consultant.id, consultant.audioPrice)}
                                        title={`Audio Call - INR ${consultant.audioPrice.toLocaleString()}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone-icon lucide-phone">
                                            <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
                                        </svg>
                                    </button>
                                    <button
                                        className="calling-option-btn video-btn"
                                        onClick={() => handleCallingOption('video', consultant.id, consultant.videoPrice)}
                                        title={`Video Call - INR ${consultant.videoPrice.toLocaleString()}`}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M23 7L16 12L23 17V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M14 5H3C1.9 5 1 5.9 1 7V17C1 18.1 1.9 19 3 19H14C15.1 19 16 18.1 16 17V7C16 5.9 15.1 5 14 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewProfile;

