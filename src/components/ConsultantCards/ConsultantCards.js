import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../components/ConsultantCards/ConsultantCards.css";
import { fetchConsultants } from "../Redux/slices/ConsultantSlices";
import { useDispatch, useSelector } from "react-redux";
import { connectSocket } from "../Redux/slices/sokectSlice";
import { checkUserBalance, openCallPage } from "../middle-ware/OpenCallingPage";
import TestRingtone from "../../pages/TestRingtone";
import { playRingtone } from "../ringTone/ringingTune";
import { fetchVoucherData } from "../Redux/slices/UserSlices";
import { checkUserStatus } from "../middle-ware/CheckUserStatus";

export const checkMicPermission = async () => {
  try {
    const result = await navigator.permissions.query({
      name: "microphone",
    });

    return result.state; // granted | denied | prompt
  } catch {
    return "prompt";
  }
};

function ConsultantCards() {
  const dispatch = useDispatch();
  const [userId, setUserId] = useState(null);
  const [shopId, setShopId] = useState(null);
  const { consultants, loading } = useSelector((state) => state.consultants);
  const { voucherData } = useSelector((state) => state.users);
  const params = new URLSearchParams(window.location.search);
  const shop = params.get("shop");
  console.log("shop", shop);
  const user_id = params.get("customerId");
  const shop_id = params.get("shopid") || localStorage.getItem("domain_V_id");
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setUserId(localStorage.getItem("client_u_Identity__"));
    setShopId(localStorage.getItem("shop_o_Identity"));
  }, []);

  useEffect(() => {
    if (!shop_id) return;
    dispatch(fetchConsultants({ adminIdLocal: shop_id }));
  }, [dispatch, shop_id]);
  useEffect(() => {
    if (shop_id) {
      dispatch(fetchVoucherData(shop_id));
    }
  }, [shop_id]);
  useEffect(() => {
    dispatch(connectSocket(user_id));
  }, [user_id]);
  console.log("voucherData", voucherData);
  const consultantsList = Array.isArray(consultants?.findConsultant)
    ? consultants.findConsultant
    : [];
  console.log("consultantsList", consultantsList);

  const mappedConsultants =
    consultantsList &&
    consultantsList.map((consultant) => {
      console.log("consultant___", consultant);
      let languages = [];

      try {
        if (typeof consultant.language === "string") {
          languages = JSON.parse(consultant.language);
        } else if (Array.isArray(consultant.language)) {
          languages = consultant.language;
        }

        if (!Array.isArray(languages)) {
          languages = ["English"];
        }
      } catch (e) {
        languages = ["English"];
      }
      console.log("languages", languages);
      return {
        id: consultant._id || consultant.id,
        name: consultant.displayName || consultant.fullname || "Consultant",
        image: consultant.profileImage || "",
        profession: consultant.profession || "Consultant",
        specialization: consultant.specialization || "",
        experience: parseInt(consultant.experience) || 0,
        languages: languages,
        rating: 4.5,
        testimonials: 0,
        isActive: consultant.isActive || false,
        chatPrice: `${voucherData?.shopCurrency}${parseInt(consultant?.chatPerMinute) || 0}`,
        audioPrice: `${voucherData?.shopCurrency}${parseInt(consultant?.voicePerMinute) || 0}`,
        videoPrice: `${voucherData?.shopCurrency}${parseInt(consultant?.videoPerMinute) || 0}`,
        isBusy: consultant?.isBusy,
        consultantStatus: consultant?.consultantStatus,
      };
    });

  useEffect(() => {
    if (!loading) {
      const sendHeight = () => {
        const height = document.documentElement.scrollHeight;
        if (window.parent) {
          window.parent.postMessage(
            { type: "AGORA_IFRAME_HEIGHT", height },
            "*",
          );
        }
      };
      const id = setTimeout(sendHeight, 300);
      return () => clearTimeout(id);
    }
  }, [loading, mappedConsultants.length]);



  /**
   * Start Voice Call and Video Call
   */

  const startCall = async ({ receiverId, type }) => {
    if (!userId) {
      alert("Please login to chat with this consultant");
      window.top.location.href = `https://${shop}/account/login`;
      return;
    }
  
    await openCallPage({ receiverId, type, userId, shop });
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
    const hostQuery = "";
    window.top.location.href = `https://${shop}/apps/consultant-theme/view-profile?consultantId=${consultant_id}&shopId=${shop_id}${hostQuery}`;
  };

  const viewChatsPage = async (consultantView) => {
    console.log("user_id", userId);
    if (!userId) {
      alert("Please login to chat with this consultant");
      window.top.location.href = `https://${shop}/account/login`;
      return;
    }
    const balance = await checkUserBalance({
      userId,
      consultantId: consultantView,
      type: "chat",
    });
    if (!balance.userBalance) {
      alert("You have insufficient balance to chat with this consultant");
      const hostQuery = "";
      window.top.location.href = `https://${shop}/apps/consultant-theme/profile${hostQuery}`;
      return;
    }

    const hostQuery = "";
    window.top.location.href = `https://${shop}/apps/consultant-theme/chats-c?consultantId=${consultantView}${hostQuery}`;
  };

  return (
    <>
      <div className="container " style={{ marginTop: "150px" }}>
        <div className="row" style={{ gap: "1.5rem" }}>
          {mappedConsultants.length === 0 ? (
            <div className="col-12 text-center py-5">
              <p>No consultants found.</p>
            </div>
          ) : (
            mappedConsultants.map((consultant) => {
              if (!consultant.consultantStatus) return null;
              const shop_id = shopId;
              const consultant_id = consultant.id;
              console.log("consultant", consultant);
              return (
                <div
                  key={consultant.id}
                  className="col-lg-4 col-md-6 col-sm-12"
                >
                  <div
                    className="card shadow-sm border-0 consultant-card"
                    // onClick={() => navigate(`/view-profile/${shop_id}/${consultant_id}`)}
                    onClick={() => viewProfile(shop_id, consultant_id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card-body p-4">
                      {/* Profile Section */}
                      <div className="flex align-items-start mb-3">
                        {/* Profile Image */}
                        <div className="me-3 position-relative flex-shrink-0">
                          <img
                            src={
                              consultant.image || "/images/flag/teamdefault.png"
                            }
                            alt={consultant.name}
                            className="rounded-circle profile-image"
                            onError={(e) => {
                              e.target.src = "/images/flag/teamdefault.png";
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
                        </div>
                      </div>

                      {/* Divider */}
                      <hr className="card-divider" />

                      {/* Information Section */}
                      <div className="mb-0">
                        <p className="mb-2 consultant-info">
                          <strong>Speaks:</strong>{" "}
                          {consultant.languages.join(", ")}
                        </p>
                        <div className="mb-0">
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <strong className="consultant-info d-block">
                              Calling Options:
                            </strong>
                            {consultant.isBusy && (
                              <span className="busy-status-dot text-danger">
                                wait for 5 minutes
                              </span>
                            )}
                          </div>
                          <div className="calling-options">
                            <button
                              className={`calling-option-btn chat-btn}`}
                              // disabled={consultant.isBusy}
                              onClick={(e) => {
                                e.stopPropagation();
                                viewChatsPage(consultant.id);
                              }}
                            >
                              <div className="calling-option-content">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <span className="calling-option-label">
                                  Chat
                                </span>
                              </div>
                              <span className="calling-option-price">
                                {consultant.chatPrice.toLocaleString()}
                              </span>
                            </button>
                            <button
                              className="calling-option-btn audio-btn"
                              // disabled={consultant.isBusy}
                              onClick={(e) => {
                                e.stopPropagation();
                                startCall({
                                  receiverId: consultant.id,
                                  type: "voice",
                                });
                              }}
                            >
                              <div className="calling-option-content">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-phone-icon lucide-phone"
                                >
                                  <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
                                </svg>
                                <span className="calling-option-label">
                                  Audio
                                </span>
                              </div>
                              <span className="calling-option-price">
                                {consultant.audioPrice.toLocaleString()}
                              </span>
                            </button>
                            <button
                              className="calling-option-btn video-btn"
                              // disabled={consultant.isBusy}
                              onClick={(e) => {
                                e.stopPropagation();
                                startCall({
                                  receiverId: consultant.id,
                                  type: "video",
                                });
                              }}
                            >
                              <div className="calling-option-content">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M23 7L16 12L23 17V7Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M14 5H3C1.9 5 1 5.9 1 7V17C1 18.1 1.9 19 3 19H14C15.1 19 16 18.1 16 17V7C16 5.9 15.1 5 14 5Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <span className="calling-option-label">
                                  Video
                                </span>
                              </div>
                              <span className="calling-option-price">
                                {consultant.videoPrice.toLocaleString()}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

export default ConsultantCards;
