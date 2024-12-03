import { useEffect, useRef, useState } from 'react';

const images = [
    { prefix: 'distortion', count: 3, text: 'Distortion and Clipping', tooltip: 'Distortion and clipping occur when the audio signal is too strong, causing it to be cut off abruptly. Subtractive AI can reduce the distortion, while generative AI can recreate the original signal.' },
    { prefix: 'reverb', count: 3, text: 'Reverb and Room', tooltip: 'Reverb and room effects simulate the sound reflections in a space. Subtractive AI can reduce excessive reverb, while generative AI can recreate the original dry signal.' },
    { prefix: 'bandwidth_8kHz', count: 3, text: 'Strong Bandlimited Signal', tooltip: 'A strong bandlimited signal has reduced frequency content. Subtractive AI can enhance the remaining frequencies, while generative AI can recreate the missing frequencies.' },
    { prefix: 'bandwidth_4kHz', count: 3, text: 'Extreme Bandlimited Signal', tooltip: 'An extreme bandlimited signal has very limited frequency content. Subtractive AI can enhance the remaining frequencies, while generative AI can recreate the missing frequencies.' },
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
                <h2 className="subtitle">These are spectrograms, time-frequency representations of audio signals. You can see how different artefacts affect the voice recording. Distortion puts too much energy in some frequencies (+ codec results in these small holes), reverb makes everything blurry and bandlimiting means information is completely lost above a threshold.</h2>
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