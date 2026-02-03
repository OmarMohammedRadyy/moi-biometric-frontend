import { useState, useRef, useCallback, useEffect } from 'react'
import axios from 'axios'

// حالات المسح
const SCAN_STATE = {
    IDLE: 'idle',
    SCANNING: 'scanning',
    MATCH: 'match',
    NO_MATCH: 'no_match'
}

// أصوات التنبيه
const playSound = (type) => {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        if (type === 'success') {
            oscillator.frequency.setValueAtTime(880, audioContext.currentTime)
            oscillator.frequency.setValueAtTime(1100, audioContext.currentTime + 0.1)
            oscillator.frequency.setValueAtTime(1320, audioContext.currentTime + 0.2)
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4)
            oscillator.start(audioContext.currentTime)
            oscillator.stop(audioContext.currentTime + 0.4)
        } else if (type === 'error') {
            oscillator.frequency.setValueAtTime(300, audioContext.currentTime)
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.2)
            gainNode.gain.setValueAtTime(0.4, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
            oscillator.start(audioContext.currentTime)
            oscillator.stop(audioContext.currentTime + 0.5)
        } else if (type === 'scan') {
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime)
            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
            oscillator.start(audioContext.currentTime)
            oscillator.stop(audioContext.currentTime + 0.1)
        }
    } catch (e) {
        console.log('Audio not supported')
    }
}

// أيقونات SVG
const ScanIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M7 12h10M12 7v10" />
    </svg>
)

const ShieldCheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
    </svg>
)

const ShieldXIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M10 10l4 4M14 10l-4 4" />
    </svg>
)

const CheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <polyline points="20 6 9 17 4 12" />
    </svg>
)

const RefreshIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M23 4v6h-6M1 20v-6h6" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
)

// أيقونة تبديل الكاميرا
const CameraSwitchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 16v4a2 2 0 0 1-2 2h-4M14 4h4a2 2 0 0 1 2 2v4M4 8V4a2 2 0 0 1 2-2h4M10 20H6a2 2 0 0 1-2-2v-4" />
        <circle cx="12" cy="12" r="3" />
    </svg>
)

// مكون Face Mesh المتحرك
const FaceMesh = ({ color }) => (
    <div className={`face-mesh ${color}`}>
        <svg viewBox="0 0 280 350" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* الرأس */}
            <ellipse cx="140" cy="140" rx="90" ry="110" strokeWidth="0.5" strokeOpacity="0.6" />

            {/* خطوط الوجه العمودية */}
            <line x1="140" y1="30" x2="140" y2="260" strokeWidth="0.3" strokeOpacity="0.4" />
            <line x1="100" y1="40" x2="100" y2="240" strokeWidth="0.3" strokeOpacity="0.4" />
            <line x1="180" y1="40" x2="180" y2="240" strokeWidth="0.3" strokeOpacity="0.4" />
            <line x1="70" y1="60" x2="70" y2="200" strokeWidth="0.3" strokeOpacity="0.4" />
            <line x1="210" y1="60" x2="210" y2="200" strokeWidth="0.3" strokeOpacity="0.4" />

            {/* خطوط الوجه الأفقية */}
            <line x1="50" y1="100" x2="230" y2="100" strokeWidth="0.3" strokeOpacity="0.4" />
            <line x1="60" y1="140" x2="220" y2="140" strokeWidth="0.3" strokeOpacity="0.4" />
            <line x1="70" y1="180" x2="210" y2="180" strokeWidth="0.3" strokeOpacity="0.4" />
            <line x1="90" y1="220" x2="190" y2="220" strokeWidth="0.3" strokeOpacity="0.4" />

            {/* العينان */}
            <ellipse cx="100" cy="120" rx="25" ry="15" strokeWidth="0.8" strokeOpacity="0.8" />
            <ellipse cx="180" cy="120" rx="25" ry="15" strokeWidth="0.8" strokeOpacity="0.8" />
            <circle cx="100" cy="120" r="8" strokeWidth="0.5" strokeOpacity="0.6" />
            <circle cx="180" cy="120" r="8" strokeWidth="0.5" strokeOpacity="0.6" />

            {/* الحاجبان */}
            <path d="M70 95 Q100 85 130 95" strokeWidth="0.6" strokeOpacity="0.7" />
            <path d="M150 95 Q180 85 210 95" strokeWidth="0.6" strokeOpacity="0.7" />

            {/* الأنف */}
            <path d="M140 130 L140 175 L120 185 M140 175 L160 185" strokeWidth="0.6" strokeOpacity="0.7" />
            <circle cx="130" cy="175" r="4" strokeWidth="0.4" strokeOpacity="0.5" />
            <circle cx="150" cy="175" r="4" strokeWidth="0.4" strokeOpacity="0.5" />

            {/* الفم */}
            <path d="M105 210 Q140 230 175 210" strokeWidth="0.8" strokeOpacity="0.8" />
            <path d="M115 210 Q140 205 165 210" strokeWidth="0.4" strokeOpacity="0.5" />

            {/* نقاط المعالم */}
            <circle cx="100" cy="120" r="2" fill="currentColor" opacity="0.8" />
            <circle cx="180" cy="120" r="2" fill="currentColor" opacity="0.8" />
            <circle cx="140" cy="175" r="2" fill="currentColor" opacity="0.8" />
            <circle cx="140" cy="210" r="2" fill="currentColor" opacity="0.8" />
            <circle cx="105" cy="210" r="2" fill="currentColor" opacity="0.8" />
            <circle cx="175" cy="210" r="2" fill="currentColor" opacity="0.8" />
            <circle cx="50" cy="130" r="2" fill="currentColor" opacity="0.8" />
            <circle cx="230" cy="130" r="2" fill="currentColor" opacity="0.8" />
            <circle cx="140" cy="30" r="2" fill="currentColor" opacity="0.8" />
            <circle cx="140" cy="260" r="2" fill="currentColor" opacity="0.8" />

            {/* الشبكة الثلاثية */}
            <path d="M70 60 L100 100 L70 140 M70 140 L100 180 L70 200" strokeWidth="0.3" strokeOpacity="0.3" />
            <path d="M210 60 L180 100 L210 140 M210 140 L180 180 L210 200" strokeWidth="0.3" strokeOpacity="0.3" />
            <path d="M100 40 L140 80 L180 40" strokeWidth="0.3" strokeOpacity="0.3" />
            <path d="M100 240 L140 200 L180 240" strokeWidth="0.3" strokeOpacity="0.3" />

            {/* خطوط الوجنتين */}
            <path d="M60 140 L100 120 L100 180 L60 160" strokeWidth="0.3" strokeOpacity="0.3" />
            <path d="M220 140 L180 120 L180 180 L220 160" strokeWidth="0.3" strokeOpacity="0.3" />
        </svg>
    </div>
)

function Scanner() {
    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const streamRef = useRef(null)

    const [scanState, setScanState] = useState(SCAN_STATE.IDLE)
    const [result, setResult] = useState(null)
    const [cameraReady, setCameraReady] = useState(false)
    const [facingMode, setFacingMode] = useState('environment') // 'user' = أمامية, 'environment' = خلفية

    // تهيئة الكاميرا
    const initCamera = useCallback(async (facing) => {
        // إيقاف الكاميرا الحالية
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop())
        }

        setCameraReady(false)

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: facing
                }
            })

            if (videoRef.current) {
                videoRef.current.srcObject = stream
                streamRef.current = stream
                setCameraReady(true)
            }
        } catch (err) {
            console.error('Camera error:', err)
            // إذا فشلت الكاميرا الخلفية، جرب الأمامية
            if (facing === 'environment') {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: {
                            width: { ideal: 1280 },
                            height: { ideal: 720 },
                            facingMode: 'user'
                        }
                    })
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream
                        streamRef.current = stream
                        setCameraReady(true)
                        setFacingMode('user')
                    }
                } catch (e) {
                    console.error('Fallback camera error:', e)
                }
            }
        }
    }, [])

    useEffect(() => {
        initCamera(facingMode)
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop())
            }
        }
    }, []) // تشغيل مرة واحدة عند التحميل

    // تبديل الكاميرا
    const switchCamera = () => {
        const newFacing = facingMode === 'user' ? 'environment' : 'user'
        setFacingMode(newFacing)
        initCamera(newFacing)
    }

    // التقاط صورة وإرسالها للتحقق
    const handleScan = async () => {
        if (!videoRef.current || !canvasRef.current) return

        playSound('scan')
        setScanState(SCAN_STATE.SCANNING)
        setResult(null)

        try {
            const video = videoRef.current
            const canvas = canvasRef.current
            const ctx = canvas.getContext('2d')

            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            ctx.drawImage(video, 0, 0)

            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9))

            const token = localStorage.getItem('auth_token')
            const formData = new FormData()
            formData.append('photo', blob, 'capture.jpg')
            formData.append('token', token)

            const response = await axios.post('/api/verify', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            })

            const data = response.data
            setResult(data)

            if (data.match_found) {
                setScanState(SCAN_STATE.MATCH)
                playSound('success')
            } else {
                setScanState(SCAN_STATE.NO_MATCH)
                playSound('error')
            }
        } catch (err) {
            console.error('Verification error:', err)
            setScanState(SCAN_STATE.NO_MATCH)
            setResult({ match_found: false, message: 'فشل الاتصال بالخادم' })
            playSound('error')
        }
    }

    const handleReset = () => {
        setScanState(SCAN_STATE.IDLE)
        setResult(null)
    }

    // تحديد لون الإطار
    const getFrameClass = () => {
        switch (scanState) {
            case SCAN_STATE.SCANNING: return 'scanning'
            case SCAN_STATE.MATCH: return 'match'
            case SCAN_STATE.NO_MATCH: return 'no-match'
            default: return ''
        }
    }

    // تحديد لون الشبكة
    const getMeshColor = () => {
        switch (scanState) {
            case SCAN_STATE.SCANNING: return 'cyan'
            case SCAN_STATE.MATCH: return 'green'
            case SCAN_STATE.NO_MATCH: return 'red'
            default: return 'cyan'
        }
    }

    return (
        <div className="scanner-page">
            {/* منطقة الكاميرا */}
            <div className="camera-container">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="camera-video"
                />

                {/* زر تبديل الكاميرا */}
                <button
                    className="camera-switch-btn"
                    onClick={switchCamera}
                    title={facingMode === 'user' ? 'تبديل للكاميرا الخلفية' : 'تبديل للكاميرا الأمامية'}
                >
                    <CameraSwitchIcon />
                </button>

                {/* إطار الوجه */}
                <div className={`face-frame ${getFrameClass()}`}>
                    <div className="face-frame-box">
                        <div className="corner tl"></div>
                        <div className="corner tr"></div>
                        <div className="corner bl"></div>
                        <div className="corner br"></div>

                        {/* شبكة الوجه */}
                        <FaceMesh color={getMeshColor()} />

                        {/* خط المسح */}
                        <div className="scan-line"></div>
                    </div>
                </div>

                {/* Canvas مخفي */}
                <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>

            {/* لوحة الحالة */}
            <div className="status-panel">
                {/* حالة الخمول - زر المسح */}
                {scanState === SCAN_STATE.IDLE && (
                    <div className="status-idle">
                        <button
                            onClick={handleScan}
                            disabled={!cameraReady}
                            className="scan-button"
                        >
                            <ScanIcon />
                            بدء المسح البيومتري
                        </button>
                    </div>
                )}

                {/* حالة المسح */}
                {scanState === SCAN_STATE.SCANNING && (
                    <div className="status-scanning">
                        <div className="status-wave">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <div className="status-text">
                            <h3>جاري المسح...</h3>
                            <p>تحليل البيانات البيومترية</p>
                        </div>
                    </div>
                )}

                {/* نتيجة التطابق */}
                {scanState === SCAN_STATE.MATCH && result && (
                    <div className="result-match">
                        <button onClick={handleReset} className="scan-again-btn" style={{ marginBottom: '1rem', width: 'auto', padding: '0.5rem 1.5rem', fontSize: '0.9rem', margin: '0 auto 1rem auto' }}>
                            <RefreshIcon />
                            مسح جديد
                        </button>

                        <div className="result-header">
                            <ShieldCheckIcon />
                            <h3>تم التحقق - صلاحية الدخول</h3>
                        </div>

                        <div className="photo-compare">
                            <div className="photo-box">
                                {result.captured_photo && (
                                    <img
                                        src={`data:image/jpeg;base64,${result.captured_photo}`}
                                        alt="الصورة الملتقطة"
                                    />
                                )}
                            </div>
                            <div className="photo-box">
                                <img
                                    src={`${import.meta.env.VITE_API_URL || ''}/uploads/${result.visitor.photo_path}`}
                                    alt="الصورة المسجلة"
                                />
                            </div>
                        </div>

                        <div className="info-rows">
                            <div className="info-row">
                                <span className="info-label">الاسم الكامل:</span>
                                <span className="info-value">
                                    {result.visitor.full_name}
                                    <span className="check"><CheckIcon /></span>
                                </span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">رقم الجواز:</span>
                                <span className="info-value">
                                    {result.visitor.passport_number}
                                    <span className="check"><CheckIcon /></span>
                                </span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">التأشيرة:</span>
                                <span className="info-value">
                                    {result.visitor.visa_status}
                                    <span className="check"><CheckIcon /></span>
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* نتيجة عدم التطابق */}
                {scanState === SCAN_STATE.NO_MATCH && (
                    <div className="result-no-match">
                        <button onClick={handleReset} className="scan-again-btn" style={{ marginBottom: '1rem', width: 'auto', padding: '0.5rem 1.5rem', fontSize: '0.9rem', margin: '0 auto 1rem auto' }}>
                            <RefreshIcon />
                            إعادة المسح
                        </button>

                        <div className="result-header denied">
                            <ShieldXIcon />
                            <h3>الدخول مرفوض - لم يتم التحقق</h3>
                        </div>

                        <div className="no-match-icon">
                            <ShieldXIcon />
                        </div>

                        <div className="no-match-text">
                            <h3>يرجى الرجوع للإجراءات الأمنية</h3>
                            <p>لم يتم العثور على تطابق في قاعدة البيانات العالمية</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Scanner
