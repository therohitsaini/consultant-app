import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../components/ConsultantCards/ConsultantCards.css';
import { fetchConsultants } from '../Redux/slices/ConsultantSlices';
import { useDispatch, useSelector } from 'react-redux';
import { Socket } from 'socket.io-client';
import { socket } from '../Sokect-io/SokectConfig';
import { connectSocket } from '../Redux/slices/sokectSlice';
import { startVideoCall, startVoiceCall } from '../Redux/slices/callSlice';
import { initRingtone, playRingtone, stopRingtone } from '../ringTone/ringingTune';
import { openCallPage } from '../middle-ware/OpenCallingPage';


export const checkMicPermission = async () => {
    try {
        const result = await navigator.permissions.query({
            name: "microphone"
        });

        return result.state; // granted | denied | prompt
    } catch {
        return "prompt";
    }
};



function ConsultantCards() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [userId, setUserId] = useState(null);
    const [shopId, setShopId] = useState(null);
    const { consultants, loading } = useSelector((state) => state.consultants);
    console.log("consultants_________________USESELECTOR", consultants)
    const params = new URLSearchParams(window.location.search);
    const shop = params.get('shop');
    console.log("shop", shop);
    const user_id = params.get('customerId');
    const shop_id = params.get('shopid');
    const [initialLoading, setInitialLoading] = useState(true);
    const { insufficientBalance } = useSelector((state) => state.socket);
    // useEffect(() => {
    //     if (insufficientBalance) {
    //         alert("You have insufficient balance to start the call");
    //         return;
    //     }
    // }, [insufficientBalance]);


    useEffect(() => {
        const timer = setTimeout(() => {
            setInitialLoading(false);
        }, 100);

        return () => clearTimeout(timer);
    }, []);
    useEffect(() => {
        const client_id = localStorage.setItem('client_u_Identity', user_id);
        const shop = localStorage.setItem('shop_o_Identity', shop_id);
    }, [user_id, shop_id]);
    useEffect(() => {
        setUserId(localStorage.getItem('client_u_Identity'));
        setShopId(localStorage.getItem('shop_o_Identity'));
    }, []);
    console.log("user_id", userId)
    console.log("shop_id", shop_id)

    useEffect(() => {
        dispatch(fetchConsultants(shop_id));
    }, [dispatch, shop_id]);

    useEffect(() => {
        dispatch(connectSocket(user_id))
    }, [user_id])
    console.log("consultants_________________", consultants)
    // const consultantsList = consultants?.findConsultant || consultants || [];
    const consultantsList = Array.isArray(consultants?.findConsultant)
        ? consultants.findConsultant
        : [];


    const mappedConsultants = consultantsList && consultantsList.map((consultant) => {
        let languages = [];
        try {
            if (typeof consultant.language === 'string') {
                languages = JSON.parse(consultant.language);
            } else if (Array.isArray(consultant.language)) {
                if (consultant.language.length > 0 && typeof consultant.language[0] === 'string') {
                    languages = JSON.parse(consultant.language[0]);
                } else {
                    languages = consultant.language;
                }
            }
            if (!Array.isArray(languages)) {
                languages = ['English'];
            }
        } catch (e) {
            languages = ['English'];
        }

        return {
            id: consultant._id || consultant.id,
            name: consultant.displayName || consultant.fullname || 'Consultant',
            image: consultant.profileImage || '',
            profession: consultant.profession || 'Consultant',
            specialization: consultant.specialization || '',
            experience: parseInt(consultant.experience) || 0,
            languages: languages,
            rating: 4.5,
            testimonials: 0,
            isActive: consultant.isActive || false,
            chatPrice: parseInt(consultant.fees) || 500,
            audioPrice: parseInt(consultant.fees) || 800,
            videoPrice: parseInt(consultant.fees) || 1000,
        };
    });

    useEffect(() => {
        if (!loading) {
            const sendHeight = () => {
                const height = document.documentElement.scrollHeight;
                if (window.parent) {
                    window.parent.postMessage(
                        { type: "AGORA_IFRAME_HEIGHT", height },
                        "*"
                    );
                }
            };
            const id = setTimeout(sendHeight, 300);
            return () => clearTimeout(id);
        }
    }, [loading, mappedConsultants.length]);

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



    // useEffect(() => {
    //     if (!user_id) return console.log("User ID is required");
    //     socket.on("connect", () => {
    //         console.log("Connected to socket", socket.id);
    //         socket.emit("register", user_id);
    //         console.log("User ID registered", user_id);
    //     });


    //     socket.on("disconnect", () => {
    //         console.log("Disconnected from socket", user_id);
    //     });

    //     socket.on("error", (error) => {
    //         console.log("Socket error", error);
    //     });

    //     socket.on("message", (message) => {
    //         console.log("Socket message", message);
    //     });

    // }, [user_id]);

    /**
     * Start Voice Call and Video Call
     */

    const startCall = async ({ receiverId, type }) => {
        await openCallPage({ receiverId, type, userId, shop });
        // const hasMicPermission = await checkMicPermission();
        // if (!hasMicPermission) {
        //     alert("Please grant microphone permission to start the call");
        //     return;
        // }
        // const channelName = `channel-${userId.slice(-6)}-${receiverId.slice(-6)}`;
        // const uid = Math.floor(Math.random() * 1000000);
        // const url = `${process.env.REACT_APP_BACKEND_HOST}/api/call/generate-token`;
        // const res = await fetch(url, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({ channelName, uid }),
        // });
        // const data = await res.json();
        // console.log("data", data)
        // if (data.token) {
        //     socket.emit("call-user", {
        //         callerId: userId,
        //         receiverId: receiverId,
        //         channelName,
        //         callType: type || "voice",
        //     });
        //     const tokenEncoded = encodeURIComponent(data.token);
        //     const appIdParam = data.appId ? `&appId=${data.appId}` : '';
        //     const returnUrl = `https://${shop}/apps/consultant-theme`;
        //     const returnUrlEncoded = process.env.REACT_FRONTEND_URL
        //     console.log("returnUrlEncoded", returnUrlEncoded);
        //     const callUrl =
        //         `https://projectable-eely-minerva.ngrok-free.dev/video/calling/page` +
        //         `?callerId=${userId}` +
        //         `&receiverId=${receiverId}` +
        //         `&callType=${type || "voice"}` +
        //         `&uid=${uid}` +
        //         `&channelName=${channelName}` +
        //         `&token=${tokenEncoded}` +
        //         appIdParam +
        //         `&returnUrl=${encodeURIComponent(returnUrl)}`;
        //     console.log("callUrl", callUrl);
        //     window.top.location.href = callUrl;
        // }

        // if (type === "voice") {
        //     await dispatch(
        //         startVoiceCall({
        //             token: data.token,
        //             channel: "123",
        //             uid: 1,
        //             appId: "AGORA_APP_ID",
        //         })
        //     );
        // }

        // if (type === "video") {
        //     await dispatch(
        //         startVideoCall({
        //             token: data.token,
        //             channel: "123",
        //             uid: 1,
        //             appId: "AGORA_APP_ID",
        //         })
        //     );
        // }

        // navigate("/call");
    };

    if (initialLoading || loading) {
        return (
            <div className="page-loader">
                <div className="loader-container">
                    <div className="loader-spinner"></div>
                    <p className="loader-text">Loading consultants...</p>
                </div>
            </div>
        );
    }

    const viewProfile = (shop_id, consultant_id) => {
        const targetShop = "rohit-12345839.myshopify.com";
        const hostQuery = "";
        console.log("targetShop", targetShop, "hostQuery", hostQuery)
        window.top.location.href = `https://${shop}/apps/consultant-theme/view-profile?consultantId=${consultant_id}&shopId=${shop_id}${hostQuery}`;
    }

    const viewChatsPage = (consultantView) => {
        console.log("consultantView", consultantView);
        const targetShop = "rohit-12345839.myshopify.com";
        const hostQuery = "";
        window.top.location.href = `https://${shop}/apps/consultant-theme/chats-c?consultantId=${consultantView}${hostQuery}`;
        // const hostQuery = "";
        // window.top.location.href = `https://${targetShop}/apps/consultant-theme/view-profile?consultantId=${consultantView}${hostQuery}`;
    }


    return (
        <div className="container py-4">
            {/* Hero Section */}
            <div className="hero-section mb-5">
                <div className="hero-content">
                    <div className="hero-badge mb-3">
                        <span className="hero-badge-icon">⭐</span>
                        <span>Trusted by Thousands</span>

                    </div>
                    <h1 className="hero-title">
                        Find Your Perfect <span className="hero-title-highlight">Consultant</span>
                    </h1>
                    <p className="hero-description">
                        Connect with experienced professionals for guidance, support, and expert advice.
                        Choose from our verified consultantsData and start your journey today.
                    </p>

                    {/* Search Bar */}
                    <div className="hero-search-container mt-4 mb-4">
                        <div className="hero-search-box">
                            <svg className="hero-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <input
                                type="text"
                                className="hero-search-input"
                                placeholder="Search by name, profession, or expertise..."
                            />
                            <button className="hero-search-btn">
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="hero-stats flex justify-content-center gap-4 flex-wrap mt-4">
                        <div className="hero-stat-item">
                            <div className="hero-stat-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="hero-stat-number">{mappedConsultants.length}+</div>
                            <div className="hero-stat-label">Expert Consultants</div>
                        </div>
                        <div className="hero-stat-item">
                            <div className="hero-stat-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="hero-stat-number">
                                {mappedConsultants.reduce((sum, c) => sum + c.testimonials, 0)}+
                            </div>
                            <div className="hero-stat-label">Happy Clients</div>
                        </div>
                        <div className="hero-stat-item">
                            <div className="hero-stat-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="hero-stat-number">
                                {mappedConsultants.filter(c => c.isActive).length}
                            </div>
                            <div className="hero-stat-label">Available Now</div>
                        </div>
                        <div className="hero-stat-item">
                            <div className="hero-stat-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="hero-stat-number">
                                {mappedConsultants.length > 0 ? Math.round(mappedConsultants.reduce((sum, c) => sum + c.rating, 0) / mappedConsultants.length * 10) / 10 : 0}
                            </div>
                            <div className="hero-stat-label">Average Rating</div>
                        </div>
                    </div>

                    {/* Quick Filters */}
                    <div className="hero-quick-filters mt-4">
                        <span className="hero-filter-label">Quick Filters:</span>
                        <div className="hero-filter-tags">
                            <span className="hero-filter-tag">All</span>
                            <span className="hero-filter-tag">Available Now</span>
                            <span className="hero-filter-tag">Psychology</span>
                            <span className="hero-filter-tag">Vedic</span>
                            <span className="hero-filter-tag">Numerology</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row" style={{ gap: '1.5rem' }}>
                {mappedConsultants.length === 0 ? (
                    <div className="col-12 text-center py-5">
                        <p>No consultants found.</p>
                    </div>
                ) : (
                    mappedConsultants.map((consultant) => {
                        const shop_id = shopId;
                        const consultant_id = consultant.id;

                        return (
                            <div key={consultant.id} className="col-lg-4 col-md-6 col-sm-12">
                                <div
                                    className="card shadow-sm border-0 consultant-card"
                                    // onClick={() => navigate(`/view-profile/${shop_id}/${consultant_id}`)}
                                    onClick={() => viewProfile(shop_id, consultant_id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="card-body p-4">
                                        {/* Profile Section */}
                                        <div className="flex align-items-start mb-3">
                                            {/* Profile Image */}
                                            <div className="me-3 position-relative flex-shrink-0">
                                                <img
                                                    src={consultant.image || '/images/flag/teamdefault.png'}
                                                    alt={consultant.name}
                                                    className="rounded-circle profile-image"
                                                    onError={(e) => {
                                                        e.target.src = '/images/flag/teamdefault.png';
                                                    }}
                                                />
                                                {consultant.isActive && (
                                                    <span className="active-status-dot"></span>
                                                )}
                                            </div>

                                            {/* Name and Details */}
                                            <div className="flex-grow-1">
                                                <div className="flex align-items-center gap-2 mb-2">
                                                    <h5 className="card-title mb-0 fw-bold consultant-name">
                                                        {consultant.name}
                                                    </h5>
                                                    <span className="experience-badge">
                                                        {consultant.experience}+ Years of Experience
                                                    </span>
                                                </div>
                                                <p className="mb-2 consultant-profession">
                                                    {consultant.profession}
                                                </p>
                                                <div className="flex align-items-center gap-2 flex-wrap">
                                                    <div className="rating-stars">
                                                        {renderStars(consultant.rating)}
                                                    </div>
                                                    <span className="rating-text">
                                                        {consultant.rating}
                                                    </span>
                                                    <span className="testimonials-text">
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
                                                            viewChatsPage(consultant.id);
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
                                                            startCall({ receiverId: consultant.id, type: 'voice' })
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
                                                            startCall({ receiverId: consultant.id, type: 'video' })
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
                            </div>
                        )
                    }

                    )
                )}
            </div>
        </div>
    );
}

export default ConsultantCards;
