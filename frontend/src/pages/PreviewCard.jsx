import { QRCodeSVG } from 'qrcode.react';
import { useParams } from 'react-router-dom';

const PreviewCard = () => {

    const { userId } = useParams();
    const currentUrl = window.location.href;

    return (
        <div>
            <h1>Preview Card</h1>
            <QRCodeSVG value={currentUrl.split("previewCard")[0] + "card/" + userId} size={200} />
        </div>
    );
};

export default PreviewCard;