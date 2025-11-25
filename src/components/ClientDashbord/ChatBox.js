export default function ChatLayout() {
    return (
        <div className="container-fluid vh-100">
            <div className="row h-100">

                {/* LEFT PROFILE SECTION */}
                <div className="col-3 bg-white border-end p-4">
                    <div className="text-center">
                        <img
                            src="https://via.placeholder.com/100"
                            className="rounded-circle mb-3"
                            alt="profile"
                        />
                        <h5 className="fw-bold">John Doe</h5>
                        <p className="text-muted">Astrologer</p>

                        <hr />

                        <div className="text-start">
                            <p><b>Experience:</b> 10 Years</p>
                            <p><b>Language:</b> Hindi, English</p>
                            <p><b>Speciality:</b> Love, Career, Finance</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT CHAT SECTION */}
                <div className="col-9 d-flex flex-column p-0">

                    {/* HEADER */}
                    <div className="p-3 bg-light border-bottom d-flex align-items-center">
                        <h5 className="mb-0">Chat with Astrologer</h5>
                    </div>

                    {/* CHAT MESSAGES */}
                    <div
                        className="flex-grow-1 p-3 overflow-auto"
                        style={{ background: "#f7f7f7" }}
                    >
                        <div className="mb-3">
                            <div className="p-2 bg-white rounded shadow-sm d-inline-block">
                                Hello! How can I help you?
                            </div>
                        </div>

                        <div className="text-end mb-3">
                            <div className="p-2 bg-success text-white rounded d-inline-block">
                                I want to know about my career.
                            </div>
                        </div>
                    </div>

                    {/* INPUT SECTION */}
                    <div className="p-3 bg-white border-top">
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Type your message..."
                                className="form-control"
                            />
                            <button className="btn btn-success">Send</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
