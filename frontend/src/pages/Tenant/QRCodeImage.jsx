import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

const QRCodeImage = ({ qrCodeData }) => {
    const [qrImage, setQrImage] = useState('');

    useEffect(() => {
        if (qrCodeData) {
            QRCode.toDataURL(qrCodeData)
                .then((url) => setQrImage(url))
                .catch((err) => console.error('Error generating QR:', err));
        }
    }, [qrCodeData]);

    return qrImage ? (
        <img
            src={qrImage}
            alt="PayOS QR Code"
            className="img-fluid border p-2"
            style={{ maxWidth: '250px', height: 'auto' }}
        />
    ) : (
        <p>Đang tạo mã QR...</p>
    );
};

export default QRCodeImage;
