import { useEffect, useMemo, useRef, useState } from 'react';

// Column labels are consistent across tabs
const COLUMNS = [
    'Original',
    'Competitor',
    'ai-coustics',
];

// Dataset for Dolby: each row maps to three files following the existing naming convention
const DOLBY_ROWS = [
    {
        text: 'Distortion and Clipping',
        files: [
            '/dolby/distortion_1.wav',
            '/dolby/distortion_2.wav',
            '/dolby/distortion_3.wav',
        ],
        competitorLabel: 'dolby.io'
    },
    {
        text: 'Reverb and Room',
        files: [
            '/dolby/reverb_1.wav',
            '/dolby/reverb_2.wav',
            '/dolby/reverb_3.wav',
        ],
        competitorLabel: 'dolby.io'
    },
    {
        text: 'Strong Bandlimited Signal',
        files: [
            '/dolby/bandwidth_8kHz_1.wav',
            '/dolby/bandwidth_8kHz_2.wav',
            '/dolby/bandwidth_8kHz_3.wav',
        ],
        competitorLabel: 'dolby.io'
    },
    {
        text: 'Extreme Bandlimited Signal',
        files: [
            '/dolby/bandwidth_4kHz_1.wav',
            '/dolby/bandwidth_4kHz_2.wav',
            '/dolby/bandwidth_4kHz_3.wav',
        ],
        competitorLabel: 'dolby.io'
    },
];

// Dataset for ElevenLabs: map each scenario to Original / ElevenLabs / ai‑coustics
const ELEVENLABS_ROWS = [
    {
        text: 'Concatenated dialog #1',
        files: [
            '/elevenlabs/original/A00_leo_and_butch_concatenated_mono_16bit [2025-10-14 162641].mp3',
            '/elevenlabs/elevenlabs/A00_leo_and_butch_concatenated - isolated_mono_16bit [2025-10-14 162641].mp3',
            '/elevenlabs/ai-coustics/A00_leo_and_butch_concatenated_LARK_V2_100p_mono_16bit [2025-10-14 162641].mp3',
        ],
        competitorLabel: 'ElevenLabs'
    },
    {
        text: 'Concatenated dialog #2',
        files: [
            '/elevenlabs/original/A00_leo_and_butch_concatenated_mono_16bit [2025-10-14 163036].mp3',
            '/elevenlabs/elevenlabs/A00_leo_and_butch_concatenated - isolated_mono_16bit [2025-10-14 163036].mp3',
            '/elevenlabs/ai-coustics/A00_leo_and_butch_concatenated_LARK_V2_100p_mono_16bit [2025-10-14 163036].mp3',
        ],
        competitorLabel: 'ElevenLabs'
    },
    {
        text: 'Concatenated dialog #3',
        files: [
            '/elevenlabs/original/A00_leo_and_butch_concatenated_mono_16bit [2025-10-14 163405].mp3',
            '/elevenlabs/elevenlabs/A00_leo_and_butch_concatenated - isolated_mono_16bit [2025-10-14 163405].mp3',
            '/elevenlabs/ai-coustics/A00_leo_and_butch_concatenated_LARK_V2_100p_mono_16bit [2025-10-14 163405].mp3',
        ],
        competitorLabel: 'ElevenLabs'
    },
    {
        text: 'White noise',
        files: [
            '/elevenlabs/original/listen_only_mix_white_noise [2025-10-14 164402].mp3',
            '/elevenlabs/elevenlabs/listen_only_ElevenLabs_AudioIsolation_white_noise [2025-10-14 164402].mp3',
            '/elevenlabs/ai-coustics/listen_only_LARK_2_white_noise [2025-10-14 164402].mp3',
        ],
        competitorLabel: 'ElevenLabs'
    },
    {
        text: 'Tutor voice',
        files: [
            '/elevenlabs/original/listen_only_mix_tutor [2025-10-14 164412].mp3',
            '/elevenlabs/elevenlabs/listen_only_ElevenLabs_AudioIsolation_tutor [2025-10-14 164412].mp3',
            '/elevenlabs/ai-coustics/listen_only_LARK_2_tutor [2025-10-14 164412].mp3',
        ],
        competitorLabel: 'ElevenLabs'
    },
    {
        text: 'Traffic lofi (A20)',
        files: [
            '/elevenlabs/original/leo_butch_listen_only_mix_A20_m_traffic_lofi [2025-10-14 164644].mp3',
            '/elevenlabs/elevenlabs/leo_butch_listen_only_ElevenLabs_AudioIsolation_A20_m_traffic_lofi [2025-10-14 164644].mp3',
            '/elevenlabs/ai-coustics/leo_butch_listen_only_LARK_2_A20_m_traffic_lofi [2025-10-14 164644].mp3',
        ],
        competitorLabel: 'ElevenLabs'
    },
    {
        text: 'Rustle with reverb (A40)',
        files: [
            '/elevenlabs/original/leo_butch_listen_only_mix_A40_f_rustle_rvb [2025-10-14 164504].mp3',
            '/elevenlabs/elevenlabs/leo_butch_listen_only_ElevenLabs_AudioIsolation_A40_f_rustle_rvb [2025-10-14 164504].mp3',
            '/elevenlabs/ai-coustics/leo_butch_listen_only_LARK_2_A40_f_rustle_rvb [2025-10-14 164504].mp3',
        ],
        competitorLabel: 'ElevenLabs'
    },
    {
        text: 'Studio misuse (A60)',
        files: [
            '/elevenlabs/original/leo_butch_listen_only_mix_A60_m_studio_wrong_use_1 [2025-10-14 164558].mp3',
            '/elevenlabs/elevenlabs/leo_butch_listen_only_ElevenLabs_AudioIsolation_A60_m_studio_wrong_use_1 [2025-10-14 164558].mp3',
            '/elevenlabs/ai-coustics/leo_butch_listen_only_LARK_2_A60_m_studio_wrong_use_1 [2025-10-14 164558].mp3',
        ],
        competitorLabel: 'ElevenLabs'
    },
];

function WavePlayer({ src, label }) {
    const spectroRef = useRef(null);
    const waveformRef = useRef(null);
    const wavesurferRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        let destroyed = false;
        let ws;
        (async () => {
            const WS = (await import('wavesurfer.js')).default;
            const Spectrogram = (await import('wavesurfer.js/dist/plugins/spectrogram.esm.js')).default;
            if (destroyed) return;
            ws = WS.create({
                container: waveformRef.current,
                height: 60,
                barWidth: 2,
                barGap: 1,
                waveColor: '#9CA3AF',
                progressColor: '#111827',
                cursorColor: 'transparent',
                url: src,
                sampleRate: 32000,
                plugins: [
                    Spectrogram.create({
                        container: spectroRef.current,
                        labels: false,
                        height: 128,
                        frequencyMax: 16000,
                        scale: 'mel',
                    }),
                ],
            });
            ws.on('play', () => setIsPlaying(true));
            ws.on('pause', () => setIsPlaying(false));
            wavesurferRef.current = ws;
        })();
        return () => {
            destroyed = true;
            try {
                wavesurferRef.current && wavesurferRef.current.destroy();
            } catch { }
            wavesurferRef.current = null;
        };
    }, [src]);

    const playPause = () => {
        const ws = wavesurferRef.current;
        if (!ws) return;
        if (ws.isPlaying()) ws.pause(); else ws.play();
    };

    return (
        <div className="player">
            <div ref={waveformRef} className="waveform"></div>
            <div ref={spectroRef} className="spectrogram"></div>
            <div className="controls center">
                <button className="ctrl-btn" onClick={playPause} aria-label="Play or pause">{isPlaying ? '⏸' : '▶︎'}</button>
            </div>
            <div className="column-text">{label}</div>
        </div>
    );
}

function Row({ text, files, competitorLabel }) {
    const labels = useMemo(() => [COLUMNS[0], competitorLabel || COLUMNS[1], COLUMNS[2]], [competitorLabel]);
    return (
        <div className="grid-row">
            <div className="grid-row-text">{text}</div>
            <div className="grid">
                {files.map((src, i) => (
                    <div className="image-container" key={i}>
                        <WavePlayer src={src} label={labels[i]} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Home() {
    const [activeTab, setActiveTab] = useState('eleven');
    const rows = activeTab === 'dolby' ? DOLBY_ROWS : ELEVENLABS_ROWS;

    return (
        <div className="container">
            <img src="/ai-coustics-logo-black.svg" alt="Logo" className="logo" />
            <div className="hero">
                <h1 className="hero-title">Voice AI that stands out from the noise</h1>
                <p className="hero-subtitle">Real-time, AI-powered speech enhancement solutions. Ready to scale.</p>
                <a className="cta" href="https://developers.ai-coustics.io/signup?utm_source=internal&utm_medium=menu">Get API keys</a>
            </div>

            <div className="tabs">
                <button className={`tab ${activeTab === 'eleven' ? 'active' : ''}`} onClick={() => setActiveTab('eleven')}>ElevenLabs comparison</button>
                <button className={`tab ${activeTab === 'dolby' ? 'active' : ''}`} onClick={() => setActiveTab('dolby')}>Dolby comparison</button>
            </div>

            <div className="grid-container">
                {rows.map((row, idx) => (
                    <Row key={idx} text={row.text} files={row.files} competitorLabel={row.competitorLabel} />
                ))}
            </div>
        </div>
    );
}