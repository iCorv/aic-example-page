import { useEffect, useRef, useState } from 'react';

const images = [
    { prefix: 'distortion', count: 3, text: 'Distortion and Clipping' },
    { prefix: 'reverb', count: 3, text: 'Reverb and Room' },
    { prefix: 'bandwidth_8kHz', count: 3, text: 'Strong Bandlimited Signal' },
    { prefix: 'bandwidth_4kHz', count: 3, text: 'Extreme Bandlimited Signal' },
];

const columnTexts = [
    'Original',
    'Subtractive (Dolby.io)',
    'Generative (ai|coustics)',
];

export default function Home() {
    const audioRefs = useRef([]);
    const [clickedIndex, setClickedIndex] = useState(null);

    useEffect(() => {
        audioRefs.current = audioRefs.current.slice(0, images.length * 3);
    }, []);

    const handleImageClick = (index) => {
        if (clickedIndex === index) {
            audioRefs.current[index].pause();
            setClickedIndex(null);
        } else {
            if (clickedIndex !== null) {
                audioRefs.current[clickedIndex].pause();
            }
            audioRefs.current[index].currentTime = 0;
            audioRefs.current[index].play();
            setClickedIndex(index);
        }
    };

    return (
        <div className="container">
            <img src="/logo.png" alt="Logo" className="logo" />
            <h1 className="title">Subtractive vs. Generative</h1>
            <div className="info-box">
                These are spectrograms, time-frequency representations of audio signals. You can see how different artefacts affect the voice recording. Distortion puts too much energy in some frequencies (+ codec compression creates these small holes), reverb makes everything blurry, and bandlimiting means information is completely lost.
            </div>
            <div className="grid-container">
                {images.map((row, rowIndex) => (
                    <div className="grid-row" key={rowIndex}>
                        <div className="grid-row-text">
                            {row.text}
                        </div>
                        <div className="grid">
                            {Array.from({ length: row.count }).map((_, colIndex) => {
                                const index = rowIndex * 3 + colIndex;
                                const src = `/${row.prefix}_${colIndex + 1}.png`;
                                const audioSrc = `/${row.prefix}_${colIndex + 1}.wav`;
                                return (
                                    <div key={index} className="image-container" onClick={() => handleImageClick(index)}>
                                        <img
                                            src={src}
                                            alt={`${row.prefix}${colIndex + 1}`}
                                            className={`image ${clickedIndex === index ? 'clicked' : ''}`}
                                        />
                                        <div className={`play-symbol ${clickedIndex === index ? 'hidden' : ''}`}></div>
                                        <audio ref={(el) => (audioRefs.current[index] = el)} src={audioSrc} />
                                        <div className="column-text">{columnTexts[colIndex]}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}