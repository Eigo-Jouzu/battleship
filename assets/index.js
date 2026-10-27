let qrCode = null;

function drawQrCode() {
    if (typeof QRCode === "undefined") return;
    const url = buildShareUrl();
    if (qrCode === null) {
        qrCode = new QRCode(document.querySelector(".qr-code"), { text: url, width: 320, height: 320 });
    } else {
        qrCode.makeCode(url);
    }
}