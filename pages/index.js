import { useEffect, useRef, useState } from 'react';

const images = [
    { prefix: 'distortion', count: 3, text: 'Distortion and Clipping', tooltip: 'Subtractive: Attempts to filter out distortion by reducing unwanted frequencies. Generative: Learns to reconstruct clean speech, replacing distorted components.' },
    { prefix: 'reverb', count: 3, text: 'Reverb and Room', tooltip: 'Subtractive: Minimizes reverb by suppressing echo-like reflections. Generative: Reconstructs how direct speech sounds like, removing the reverberated effects.' },
    { prefix: 'bandwidth_8kHz', count: 3, text: 'Strong Bandlimited Signal', tooltip: 'Subtractive: Reduces noise but struggles to recover lost information. Generative: Generates a clean, enriched version, restoring lost details but preserving the speaker identity.' },
    { prefix: 'bandwidth_4kHz', count: 3, text: 'Extreme Bandlimited Signal', tooltip: 'Subtractive: Enhances clarity by filtering noise from the limited band. Generative: Reconstructs all frequency content, giving it a more natural sound.' },
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
            <div className="grid-container">
                <h1 className="title">Subtractive vs. Generative</h1>
                {images.map((row, rowIndex) => (
                    <div className="grid-row" key={rowIndex}>
                        <div className="grid-row-text">
                            {row.text}
                            <span className="info-icon">ℹ️
                                <span className="tooltip">{row.tooltip}</span>
                            </span>
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
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
                <div className="grid-row">
                    <div className="grid-row-text"></div>
                    <div className="grid">
                        {columnTexts.map((text, index) => (
                            <div key={index} className="column-text">{text}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}