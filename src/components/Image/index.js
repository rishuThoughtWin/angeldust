import { useCallback, useEffect, useState } from "react";

export default ({ src, placeholderImg, ...props }) => {
    const [imgSrc, setSrc] = useState(placeholderImg || src);
    const onLoad = useCallback(() => {
        setSrc(src);
    }, [src]);
    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.addEventListener("load", onLoad);
        return () => {
            img.removeEventListener("load", onLoad);
        };
    }, [src, onLoad]);
    return <img {...props} alt={imgSrc} src={imgSrc} />;
};