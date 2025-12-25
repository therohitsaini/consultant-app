const openTokenWindow = () => {
    const tokenWindowUrl = `${window.location.origin}/fcm-token?userId=${encodeURIComponent(
        "691eafcff95528ab305eba59"
    )}&shopId=${encodeURIComponent("690c374f605cb8b946503ccb")}`;

    window.open(
        tokenWindowUrl,
        "fcmTokenWindow",
        "width=600,height=500,scrollbars=yes"
    );
};

export default openTokenWindow;