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
                These spectrograms show the time-frequency representations of audio signals, highlighting how different artifacts impact voice recordings. Distortion adds excessive energy to certain frequencies (with codecs often causing small gaps), reverb blurs the signal, and bandlimiting results in a complete loss of information in specific frequency ranges. While current subtractive AI models have limited capabilities in addressing these issues, our approach goes further: we reconstruct the missing information to deliver a studio-quality voice recording.
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