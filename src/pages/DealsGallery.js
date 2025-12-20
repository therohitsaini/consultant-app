import "../pages/DealsGallery.css";






export default function DealsGallery() {
    
    return (
        <div className="app-wrapper">
            <div className="phone">

                <h1>Deals Gallery</h1>

                <div className="tracker">
                    <div className="orbit"></div>
                    <div className="orbit small"></div>

                    {/* OUTER ROTATION */}
                    <div className="rotate-outer">
                        <div className="item outer-1"><img src={ "https://imgs.search.brave.com/LgLnG0YyKC78VZULy9IVIpVyQVnacpc2pmuro63xxSo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by91c2VyLXByb2Zp/bGUtcG5nLXByb2Zl/c3Npb25hbC1idXNp/bmVzc3dvbWFuLXN0/aWNrZXItdHJhbnNw/YXJlbnQtYmFja2dy/b3VuZF81Mzg3Ni0x/MDQ5MDE3LmpwZz9z/ZW10PWFpc19oeWJy/aWQmdz03NDAmcT04/MA"} alt="" /></div>
                        <div className="item outer-2"><img src={ "https://imgs.search.brave.com/LgLnG0YyKC78VZULy9IVIpVyQVnacpc2pmuro63xxSo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by91c2VyLXByb2Zp/bGUtcG5nLXByb2Zl/c3Npb25hbC1idXNp/bmVzc3dvbWFuLXN0/aWNrZXItdHJhbnNw/YXJlbnQtYmFja2dy/b3VuZF81Mzg3Ni0x/MDQ5MDE3LmpwZz9z/ZW10PWFpc19oeWJy/aWQmdz03NDAmcT04/MA"} alt="" /></div>
                        <div className="item outer-3"><img src={ "https://imgs.search.brave.com/LgLnG0YyKC78VZULy9IVIpVyQVnacpc2pmuro63xxSo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by91c2VyLXByb2Zp/bGUtcG5nLXByb2Zl/c3Npb25hbC1idXNp/bmVzc3dvbWFuLXN0/aWNrZXItdHJhbnNw/YXJlbnQtYmFja2dy/b3VuZF81Mzg3Ni0x/MDQ5MDE3LmpwZz9z/ZW10PWFpc19oeWJy/aWQmdz03NDAmcT04/MA"} alt="" /></div>
                        <div className="item outer-4">🧴</div>
                        <div className="item outer-5">🍞</div>
                        <div className="item outer-6">🧻</div>
                        <div className="item outer-7">🍳</div>
                        <div className="item outer-8">💸</div>
                    </div>

                    {/* INNER ROTATION */}
                    <div className="rotate-inner">
                        <div className="item small inner-1">🥫</div>
                        <div className="item small inner-2">🧂</div>
                        <div className="item small inner-3">🍚</div>
                        <div className="item small inner-4">🧃</div>
                    </div>

                    {/* CENTER LOGO */}
                    <div className="center-logo">
                        <img src={ "https://imgs.search.brave.com/LgLnG0YyKC78VZULy9IVIpVyQVnacpc2pmuro63xxSo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by91c2VyLXByb2Zp/bGUtcG5nLXByb2Zl/c3Npb25hbC1idXNp/bmVzc3dvbWFuLXN0/aWNrZXItdHJhbnNw/YXJlbnQtYmFja2dy/b3VuZF81Mzg3Ni0x/MDQ5MDE3LmpwZz9z/ZW10PWFpc19oeWJy/aWQmdz03NDAmcT04/MA"} alt="Deals Gallery Logo" />
                    </div>
                </div>

                <div className="content">
                    <h2>Never Miss the Best Deals</h2>
                    <p>
                        Track your favorite products and get notified when prices drop or
                        deals are available
                    </p>
                </div>

                <div className="btn">Get Started</div>

            </div>
        </div>
    );
}