/* ═══════════════════════════════════════════════
   LOVE WEBSITE — Paylaşılan Yardımcı Fonksiyonlar
   Her özel gün kendi HTML dosyasına taşındı.
   Bu dosya tüm sayfalar tarafından ortak kullanılır.
   ═══════════════════════════════════════════════ */

// ─────────────────────────────────────────────
//  YARDIMCI: Geri sayım kutularını güncelle
//  prefix: 'bd' | 'vd' | 'mt' | 'pr'
// ─────────────────────────────────────────────
function setCountdown(prefix, diff) {
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    document.getElementById(`${prefix}-days`).textContent = String(d).padStart(2, '0');
    document.getElementById(`${prefix}-hours`).textContent = String(h).padStart(2, '0');
    document.getElementById(`${prefix}-minutes`).textContent = String(m).padStart(2, '0');
    document.getElementById(`${prefix}-seconds`).textContent = String(s).padStart(2, '0');
}

function zeroCountdown(prefix) {
    ['days', 'hours', 'minutes', 'seconds'].forEach(unit =>
        document.getElementById(`${prefix}-${unit}`).textContent = '00'
    );
}




// ─────────────────────────────────────────────
//  1. CANVAS — Kalp + Nar Tanesi Partikülleri
// ─────────────────────────────────────────────
const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function heartPath(x, y, size) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size, size);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-0.5, -0.5, -1, 0.2, 0, 0.8);
    ctx.bezierCurveTo(1, 0.2, 0.5, -0.5, 0, 0);
    ctx.restore();
}

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 20;
        this.size = Math.random() * 12 + 4;
        this.speed = Math.random() * 0.8 + 0.3;
        this.alpha = Math.random() * 0.5 + 0.15;
        this.hue = Math.random() * 40 + 340;
        this.sway = Math.random() * 0.02 + 0.01;
        this.phase = Math.random() * Math.PI * 2;
    }
    update(t) {
        this.y -= this.speed;
        this.x += Math.sin(t * this.sway + this.phase) * 0.5;
        this.alpha -= 0.0008;
        if (this.y < -30 || this.alpha <= 0) this.reset();
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = `hsl(${this.hue}, 90%, 68%)`;
        heartPath(this.x, this.y, this.size);
        ctx.fill();
        ctx.restore();
    }
}

class PomParticle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 20;
        this.rx = Math.random() * 5 + 3;
        this.ry = Math.random() * 7 + 4;
        this.speed = Math.random() * 0.7 + 0.25;
        this.alpha = Math.random() * 0.55 + 0.15;
        this.sway = Math.random() * 0.025 + 0.01;
        this.phase = Math.random() * Math.PI * 2;
        this.rot = Math.random() * Math.PI;
        this.hue = Math.random() * 20 + 345;
    }
    update(t) {
        this.y -= this.speed;
        this.x += Math.sin(t * this.sway + this.phase) * 0.6;
        this.alpha -= 0.0007;
        this.rot += 0.01;
        if (this.y < -30 || this.alpha <= 0) this.reset();
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, this.rx * 2);
        grd.addColorStop(0, `hsla(${this.hue}, 95%, 75%, 0.9)`);
        grd.addColorStop(0.5, `hsla(${this.hue}, 85%, 55%, 0.6)`);
        grd.addColorStop(1, `hsla(${this.hue}, 80%, 40%, 0)`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.rx * 2, this.ry * 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `hsla(${this.hue}, 95%, 68%, ${this.alpha})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.rx, this.ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// %60 kalp, %40 nar tanesi
for (let i = 0; i < 65; i++) {
    const p = i < 40 ? new Particle() : new PomParticle();
    p.y = Math.random() * canvas.height;
    particles.push(p);
}

let animTime = 0;
function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animTime += 0.016;
    particles.forEach(p => { p.update(animTime); p.draw(); });
    requestAnimationFrame(animateCanvas);
}
animateCanvas();






// ─────────────────────────────────────────────
//  4. MUM ÜFLEME
// ─────────────────────────────────────────────
let candlesBlown = 0;
const totalCandles = 5;

function blowCandles() {
    if (candlesBlown === totalCandles) return;
    document.querySelectorAll('.flame').forEach((flame, i) => {
        setTimeout(() => {
            if (!flame.classList.contains('out')) {
                flame.classList.add('out');
                candlesBlown++;
                if (candlesBlown === totalCandles) {
                    setTimeout(() => {
                        document.getElementById('celebMsg').classList.add('show');
                        launchConfetti(80);
                    }, 300);
                }
            }
        }, i * 120);
    });
}

// Tek tek muma tıkla
document.querySelectorAll('.candle').forEach(candle => {
    candle.addEventListener('click', () => {
        const flame = candle.querySelector('.flame');
        if (!flame.classList.contains('out')) {
            flame.classList.add('out');
            candlesBlown++;
            if (candlesBlown === totalCandles) {
                setTimeout(() => {
                    document.getElementById('celebMsg').classList.add('show');
                    launchConfetti(80);
                }, 300);
            }
        }
    });
});


// ─────────────────────────────────────────────
//  5. KONFETİ
// ─────────────────────────────────────────────
function launchConfetti(count = 60) {
    const colors = ['#ff6b9d', '#ff3478', '#9b5de5', '#ffe066', '#f4c430', '#c9184a', '#ffd6e7', '#7209b7'];
    const container = document.getElementById('confettiContainer');
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const el = document.createElement('div');
            const size = Math.random() * 10 + 6;
            el.className = 'confetti-piece';
            el.style.cssText = `
                left: ${Math.random() * 100}%;
                width: ${size}px;
                height: ${size}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
                animation-duration: ${Math.random() * 2 + 2}s;
                animation-delay: ${Math.random() * 0.5}s;
            `;
            container.appendChild(el);
            setTimeout(() => el.remove(), 4000);
        }, i * 30);
    }
}


// ─────────────────────────────────────────────
//  6. NEDENLЕР SLIDER (sadece valentine açıkken)
// ─────────────────────────────────────────────
function initSlider() {
    const track = document.getElementById('reasonsTrack');
    const dotsEl = document.getElementById('sliderDots');
    if (!track || !dotsEl) return;

    const cards = document.querySelectorAll('.reason-card');
    let current = 0;

    cards.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsEl.appendChild(dot);
    });

    function goTo(idx) {
        current = (idx + cards.length) % cards.length;
        track.style.transform = `translateX(-${current * 100}%)`;
        document.querySelectorAll('.dot').forEach((d, i) =>
            d.classList.toggle('active', i === current)
        );
    }

    window.nextReason = () => goTo(current + 1);
    window.prevReason = () => goTo(current - 1);

    setInterval(() => window.nextReason(), 4500);

    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) dx < 0 ? window.nextReason() : window.prevReason();
    });
}


// ─────────────────────────────────────────────
//  7. KALP TIKLAMA
// ─────────────────────────────────────────────
function pulseHeart() {
    const h = document.getElementById('bigHeart');
    h.classList.remove('pulse-extra');
    void h.offsetWidth;
    h.classList.add('pulse-extra');
    launchConfetti(25);
    h.addEventListener('animationend', () => h.classList.remove('pulse-extra'), { once: true });
}


// ─────────────────────────────────────────────
//  8. AŞK MEKTUBU — Random Mektup Seçici
// ─────────────────────────────────────────────
const LOVE_LETTERS = [
    `Yağmur'um, 28 Kasım 2025 hayatımın yön değiştirdiği gündü. Seni ilk gördüğüm an bunun sıradan bir tanışma olmadığını hissettim. 16 Aralık'ta "biz" olduğumuz an ise kalbim yerini buldu. Yanındayken dünya daha sessiz, daha güvenli. Gözlerin içime huzur, sesin içime sükûnet bırakıyor. Yağmur yağdığında artık gökyüzü değil, sen aklıma düşüyorsun. İyi ki hayatıma girdin. Dün seni seviyordum, bugün daha derinden, yarın ise bugünü bile kıskandıracak kadar. Sonsuzluk seninle anlamlı. 💕`,

    `28 Kasım 2025'te başlayan bir hikâye bu. O gün sıradan sandığım bir an, hayatımın en kıymetli başlangıcıymış. 16 Aralık'ta elini tuttuğumda artık hiçbir şey eksik değildi. Gülüşün içimdeki karanlığı aydınlatıyor, bakışların bana cesaret veriyor. Yağmur her yağdığında, her damlada adını duyuyorum. Sen yanımdayken dünya daha doğru bir yer. Seni her geçen gün daha çok seviyorum ve bu artışın sınırı yok. 💕`,

    `Yağmur'um, 28 Kasım 2025 sadece bir tarih değil, kalbimin attığı yönün değiştiği gün. 16 Aralık'ta hayatımın en güzel kararlarından biri gerçek oldu. Seninle olmak, içimdeki bütün karmaşayı susturuyor. Gözlerin bana güven, sözlerin bana güç veriyor. Artık yağmur romantik değil, doğrudan sen demek. Dün sana aşıktım, bugün daha fazlası, yarın ise tarif edilemeyecek kadar. Hep seninle kalmak istiyorum. 💕`,

    `28 Kasım 2025'te başlayan o bakış, 16 Aralık'ta bir hikâyeye dönüştü. O gün "biz" olduk ve hayatımın en güzel cümlesi yazıldı. Sen yanımdayken her şey daha anlamlı. Sesin içimde fırtınaları dindiriyor, gülüşün bana yeniden başlama gücü veriyor. Yağmur damlaları artık gökyüzünden değil, kalbimden sana düşüyor. Seni her gün yeniden ve daha güçlü seviyorum. 💕`,

    `Yağmur'um, 28 Kasım'da seni tanıdım ama sanki seni hep biliyordum. 16 Aralık'ta kalbim adını resmileştirdi. O gün, hayatımın en özel anlarından biri olarak içimde kaldı. Senin yanında kendim olabiliyorum, korkusuz ve huzurlu. Gözlerin bana ev gibi geliyor. Yağmur yağınca içimde bir sıcaklık beliriyor çünkü aklıma sen geliyorsun. Seni dün sevdim, bugün daha çok, yarın ise sınırsızca. 💕`,

    `28 Kasım 2025'te başlayan hikâyemiz, 16 Aralık'ta en güzel hâlini aldı. O gün kalbim yerini buldu. Seninle geçirdiğim her an, zamanın en değerli parçası gibi. Sesin huzur, dokunuşun güven, gülüşün umut. Artık yağmur romantik değil, doğrudan senin imzan. Sana olan sevgim her gün büyüyor ve büyümeye devam edecek. Sonsuzluk senin adınla anlamlı. 💕`,

    `Yağmur'um, 28 Kasım'da başlayan bir tebessüm, 16 Aralık'ta hayatımın en güzel cümlesine dönüştü. Sen benim en sakin limanım oldun. Gözlerine baktığımda dünya yavaşlıyor, kalbim hızlanıyor. Yağmur damlaları artık gökyüzünden değil, içimden sana düşüyor. Her gün seni biraz daha tanıyor ve daha çok seviyorum. Gelecek seninle güzel. 💕`,

    `28 Kasım 2025… O gün kader bana en güzel sürprizini yaptı. 16 Aralık'ta ise kalbim bunu kabul etti. Seninle olmak, içimdeki boşlukların dolması gibi. Gülüşün en karanlık günü bile aydınlatıyor. Yağmur yağdığında artık camdan dışarı bakmıyorum, seni düşünüyorum. Sana olan sevgim her gün artıyor, eksilmeyi bilmiyor. Hep yanımda olmanı istiyorum. 💕`,

    `Yağmur'um, seni 28 Kasım'da tanıdım ama kalbim sanki seni çok daha önceden bekliyormuş. 16 Aralık'ta o bekleyiş sona erdi. Seninle hayat daha net, daha parlak. Sesin huzur veriyor, gözlerin bana güç katıyor. Yağmur damlaları artık bir mevsim değil, bir hatıra. Seni her gün daha derinden seviyorum. Geleceği seninle kurmak istiyorum. 💕`,

    `28 Kasım 2025'te başlayan bu hikâye, 16 Aralık'ta kalbime mühürlendi. O gün, hayatımın en değerli anlarından biri oldu. Sen yanımdayken dünya daha güvenli bir yer gibi. Gözlerin içime ışık, gülüşün içime umut bırakıyor. Yağmur yağdığında artık sadece ıslanmıyorum, seni hatırlıyorum. Seni dün sevdim, bugün daha fazla, yarın ise tarif edilemeyecek kadar çok. Sonsuza dek seninle. 💕`,

    `Yağmur'um, 28 Kasım 2025'te tanıştık. O gün seni gördüğümde ne kadar önemli olacağını henüz bilmiyordum, ama kalbim biliyordu. 16 Aralık'ta ise resmi olarak benimdin — o an hayatımın en güzel anlarından biri. Gözlerinin içine baktığımda tüm endişelerimin kaybolduğunu hissediyorum. Sesin bana huzur veriyor, gülüşün bana güç veriyor. Yağmur yağınca artık hep seni düşünüyorum; her damlada senin adın var. Bu özel günün sana ne kadar değer verdiğimi hatırlatmak için birer fırsat. Sen benim için her günü özel kılıyorsun zaten. Seni dün sevdim, bugün daha da çok seviyorum, yarın ise bugünden de fazla seveceğim. 💕`,
];

function loadRandomLetter() {
    const body = document.getElementById('letterBody');
    if (!body) return;
    const letter = LOVE_LETTERS[Math.floor(Math.random() * LOVE_LETTERS.length)];
    body.innerHTML =
        `<p>${letter}</p>` +
        `<p class="letter-closing">Sonsuza dek seninle,<br><em>Seni çok seven biri</em> 💕</p>`;
}
loadRandomLetter();

function openLetter() {
    const env = document.getElementById('letterEnvelope');
    const content = document.getElementById('letterContent');
    if (env.classList.contains('opened')) return;
    env.classList.add('opening');
    setTimeout(() => {
        env.classList.add('opened');
        content.classList.add('visible');
        launchConfetti(35);
    }, 500);
}


// ─────────────────────────────────────────────
//  9. SCROLL ANİMASYONLARI (section açıldıktan sonra)
// ─────────────────────────────────────────────
function initScrollAnimations() {
    const elements = document.querySelectorAll('.wish-card, .count-box');
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    });

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.querySelectorAll('.wish-card, .count-box').forEach((el, i) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, i * 80);
            });
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section').forEach(s => sectionObserver.observe(s));
}


// ─────────────────────────────────────────────
// 10. TIKLAMA: Uçan Kalpler
// ─────────────────────────────────────────────
const floatStyle = document.createElement('style');
floatStyle.textContent = `
    @keyframes floatUp {
        0%   { opacity: 1; transform: translateY(0) scale(1); }
        100% { opacity: 0; transform: translateY(-70px) scale(0.6); }
    }
`;
document.head.appendChild(floatStyle);

document.addEventListener('click', e => {
    if (['BUTTON', 'A', 'INPUT'].includes(e.target.tagName)) return;
    const emojis = ['💕', '💖', '💗', '❤️', '💓', '💘', '💝', '✨', '🌸'];
    const span = document.createElement('span');
    span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    span.style.cssText = `
        position: fixed;
        left: ${e.clientX - 12}px;
        top: ${e.clientY - 12}px;
        font-size: ${Math.random() * 14 + 16}px;
        pointer-events: none;
        z-index: 99999;
        user-select: none;
        animation: floatUp 1.2s ease forwards;
    `;
    document.body.appendChild(span);
    setTimeout(() => span.remove(), 1200);
});


// ─────────────────────────────────────────────
// 11. SPOTİFY + DOĞUM GÜNÜ MÜZİĞİ — VOLUME DUCKING
// Spotify çalarken doğum günü müziğinin sesini kıs
// ─────────────────────────────────────────────
window.onSpotifyIframeApiReady = (IFrameAPI) => {
    const container = document.getElementById('spotifyContainer');
    if (!container) return;

    const options = {
        uri: 'spotify:track:0TFTAtCYhp2tQ9KcJIZb55',
        theme: '0',
        width: '100%',
        height: 152,
    };

    IFrameAPI.createController(container, options, (controller) => {
        let isDucked = false;

        controller.addListener('playback_update', (e) => {
            const bdMusic = document.getElementById('birthdayMusic');
            if (!bdMusic) return;

            const isPlaying = !e.data.isPaused;

            if (isPlaying && !isDucked) {
                isDucked = true;
                fadeVolume(bdMusic, bdMusic.volume, 0.1, 800);
            } else if (!isPlaying && isDucked) {
                isDucked = false;
                fadeVolume(bdMusic, bdMusic.volume, 0.55, 800);
            }
        });
    });
};

function fadeVolume(audio, from, to, durationMs) {
    const steps = 30;
    const interval = durationMs / steps;
    const delta = (to - from) / steps;
    let step = 0;
    const timer = setInterval(() => {
        step++;
        audio.volume = Math.min(1, Math.max(0, from + delta * step));
        if (step >= steps) clearInterval(timer);
    }, interval);
}





