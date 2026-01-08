import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../components/ConsultantCards/ConsultantCards.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConsultantById } from '../Redux/slices/ConsultantSlices';
import { openCallPage } from '../middle-ware/OpenCallingPage';

function ViewProfile() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const { shop_id, consultant_id } = useParams();
    const params = new URLSearchParams(window.location.search);
    const consultant_id = params.get("consultantId");
    const shop_id = params.get("shopId");
    const shop = params.get("shop");
    const { consultantOverview, loading } = useSelector((state) => state.consultants);
    useEffect(() => {
        dispatch(fetchConsultantById({ shop_id, consultant_id }));
    }, [dispatch, shop_id, consultant_id]);

    // Ensure page opens at the top when this component is mounted
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, []);





    const consultantView = consultantOverview?.consultant;
    console.log("consultantView", consultantView);
    const imageUrl = `${process.env.REACT_APP_BACKEND_HOST}/${consultantView?.profileImage?.replace("\\", "/")}`;
    // Default static consultant data
    const consultant = {
        id: "691dbba35e388352e3203b0b",
        name: 'Arlene McCoy',
        image: 'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?cs=srgb&dl=pexels-suliman-sallehi-1704488.jpg&fm=jpg',
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
    };

    const startCall = async ({ receiverId, type }) => {
        console.log("helloo???????????????????")
        console.log("startCall_________________", receiverId, type);
        await openCallPage({ receiverId, type, userId: "69328ff18736b56002ef83df", shop });

    }

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

    const viewProfile = (consultantView) => {
        console.log("consultantView______", consultantView);
        const targetShop = shop;
        const hostQuery = "";
        console.log("targetShop", targetShop, "hostQuery", hostQuery)
        window.top.location.href = `https://${targetShop}/apps/consultant-theme/chats-c?consultantId=${consultantView}${hostQuery}`;
    }
    const backToHome = () => {
        const targetShop = shop;
        const hostQuery = "";
        console.log("targetShop", targetShop, "hostQuery", hostQuery)
        window.top.location.href = `https://${targetShop}/apps/consultant-theme/consultant-cards${hostQuery}`;
    }

    return (
        <div className="view-profile-container">
            <div className="container py-4">
                {/* Back Button */}
                <button className="btn btn-link back-button mb-3" onClick={() => backToHome()}>
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
                                    src={imageUrl}
                                    alt={consultantView?.fullname}
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
                                        {consultantView?.fullname}
                                    </h5>
                                    <span className="experience-badge experience-badge-large">
                                        {consultantView?.experience}
                                        + Years of Experience
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
                                        className="calling-option-btn chat-btn border-0"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            viewProfile(consultantView?._id);
                                            // navigate(`/user-chat/${consultantView?._id}`);
                                        }}
                                    >
                                        <div className="calling-option-content">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <span className="calling-option-label">Chat</span>
                                        </div>
                                        <span className="calling-option-price">Coins {consultantView?.chatCost} per min</span>
                                    </button>
                                    <button
                                        className="calling-option-btn audio-btn"
                                        onClick={(e) => {
                                            startCall({ receiverId: consultantView?._id, type: 'voice' });
                                        }}
                                    >
                                        <div className="calling-option-content">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone-icon lucide-phone">
                                                <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
                                            </svg>
                                            <span className="calling-option-label">Voice Call</span>
                                        </div>
                                        <span className="calling-option-price">INR {consultantView?.voiceCallCost}</span>
                                    </button>
                                    <button
                                        className="calling-option-btn video-btn"
                                        onClick={(e) => {
                                            startCall({ receiverId: consultantView?._id, type: 'video' });
                                        }}
                                    >
                                        <div className="calling-option-content">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M23 7L16 12L23 17V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M14 5H3C1.9 5 1 5.9 1 7V17C1 18.1 1.9 19 3 19H14C15.1 19 16 18.1 16 17V7C16 5.9 15.1 5 14 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <span className="calling-option-label">Video</span>
                                        </div>
                                        <span className="calling-option-price">INR {consultantView?.videoCallCost}</span>
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

