/* ═══════════════════════════════════════════════
   LOVE WEBSITE — JavaScript
   ═══════════════════════════════════════════════ */

// ─────────────────────────────────────────────
//  0. DATE-BASED ROUTING
//  ✏️  Tarihleri BURADAN değiştir — tek yer yeterli!
// ─────────────────────────────────────────────
const BIRTHDAY_MONTH = 1;   // Doğum günü AYI  (1=Ocak … 12=Aralık)
const BIRTHDAY_DAY = 1;   // Doğum günü GÜNÜ
const VALENTINE_MONTH = 3;   // Sevgililer günü AYI
const VALENTINE_DAY = 7;  // Sevgililer günü GÜNÜ

// Türkçe ay isimleri (kilitli ekrandaki yazı için)
const AY = ['', 'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

(function () {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    const isBirthday = (month === BIRTHDAY_MONTH && day === BIRTHDAY_DAY);
    const isValentine = (month === VALENTINE_MONTH && day === VALENTINE_DAY);

    if (isBirthday || isValentine) {
        // ── Sayfayı aç ──────────────────────────────
        document.getElementById('lockedScreen').style.display = 'none';
        document.getElementById('siteContent').style.display = 'block';

        if (isBirthday) {
            document.getElementById('birthday').style.display = 'block';
            document.getElementById('heroLine3').textContent = 'İyi ki Doğdun!';
            document.getElementById('heroSubtitle').textContent =
                'Kartanem, yeni yılın ilk günü senin günün — çünkü sen bu dünyanın en güzel hediyesisin';

            // ── Doğum günü giriş ekranı + müzik ─────────────
            const bdMusic = document.getElementById('birthdayMusic');

            // Overlay oluştur
            const overlay = document.createElement('div');
            overlay.id = 'bdIntroOverlay';
            overlay.innerHTML = `
                <div class="bdo-inner">
                    <!--<div class="bdo-confetti">🎂</div>-->
                    <!--<h2 class="bdo-title">İyi ki Doğdun<br><span>Yağmur'um 🎀</span></h2>-->
                    <p class="bdo-sub">Sürprizini görmek için tıkla</p>
                    <div class="bdo-btn">✨ Tıkla ✨</div>
                    <p class="bdo-note">🎵 Müzikle birlikte açılacak</p>
                </div>
            `;
            overlay.style.cssText = `
                position: fixed; inset: 0; z-index: 99999;
                background: radial-gradient(ellipse at 50% 40%, rgba(155,93,229,0.35) 0%, transparent 60%),
                            radial-gradient(ellipse at 20% 80%, rgba(255,10,84,0.25) 0%, transparent 60%),
                            #0d0014;
                display: flex; align-items: center; justify-content: center;
                cursor: pointer;
                animation: bdOverlayIn 0.8s ease both;
            `;
            document.body.appendChild(overlay);

            // Overlay CSS (dinamik)
            const bdStyle = document.createElement('style');
            bdStyle.textContent = `
                @keyframes bdOverlayIn { from { opacity:0; } to { opacity:1; } }
                @keyframes bdOverlayOut { from { opacity:1; transform:scale(1); } to { opacity:0; transform:scale(1.06); } }
                @keyframes bdCake { 0%,100%{transform:scale(1) rotate(-5deg);} 50%{transform:scale(1.15) rotate(5deg);} }
                .bdo-inner { text-align:center; animation: fadeInUp 1s ease both; }
                .bdo-confetti { font-size:5rem; margin-bottom:20px; animation: bdCake 2s ease-in-out infinite; display:block; }
                .bdo-title { font-family:'Playfair Display',serif; font-size:clamp(2rem,6vw,3.5rem); color:#ffd6e7; line-height:1.2; margin-bottom:16px; }
                .bdo-title span { background:linear-gradient(135deg,#ff9ec7,#ff3478); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
                .bdo-sub { font-family:'Poppins',sans-serif; font-size:1.1rem; color:rgba(255,214,231,0.7); margin-bottom:32px; }
                .bdo-btn { display:inline-block; padding:16px 44px; border-radius:999px; background:linear-gradient(135deg,#ff6b9d,#c9184a); color:#fff; font-size:1.1rem; font-weight:700; box-shadow:0 8px 32px rgba(201,24,74,0.45); transition:transform 0.3s,box-shadow 0.3s; margin-bottom:16px; }
                #bdIntroOverlay:hover .bdo-btn { transform:translateY(-4px) scale(1.05); box-shadow:0 14px 40px rgba(201,24,74,0.6); }
                .bdo-note { font-size:0.85rem; color:rgba(255,214,231,0.45); }
            `;
            document.head.appendChild(bdStyle);

            // Tıklayınca müzik başlasın ve overlay kapansın
            overlay.addEventListener('click', () => {
                if (bdMusic) {
                    bdMusic.volume = 0.55;
                    bdMusic.play().catch(() => { });
                }
                overlay.style.animation = 'bdOverlayOut 0.6s ease forwards';
                setTimeout(() => overlay.remove(), 600);

                // Müzik toggle butonu
                if (bdMusic) {
                    const musicBtn = document.createElement('button');
                    musicBtn.id = 'musicToggle';
                    musicBtn.innerHTML = '🎵';
                    musicBtn.title = 'Müziği Aç/Kapat';
                    musicBtn.style.cssText = `
                        position:fixed; bottom:24px; right:24px; z-index:9999;
                        width:52px; height:52px; border-radius:50%;
                        background:linear-gradient(135deg,#ff6b9d,#c9184a);
                        border:none; font-size:1.4rem; cursor:pointer;
                        box-shadow:0 6px 24px rgba(201,24,74,0.45);
                        transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);
                    `;
                    musicBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (bdMusic.paused) { bdMusic.play(); musicBtn.innerHTML = '🎵'; musicBtn.style.opacity = '1'; }
                        else { bdMusic.pause(); musicBtn.innerHTML = '🔇'; musicBtn.style.opacity = '0.6'; }
                    });
                    document.body.appendChild(musicBtn);
                }
            }, { once: true });

            //  document.getElementById('heroButtons').innerHTML =
            //     '<a href="#birthday" class="btn btn-primary">🎂 Doğum Günün</a>' +
            //     '<a href="#song"     class="btn btn-secondary">🎵 Şarkımız</a>' +
            //     '<a href="#letter"   class="btn btn-secondary">💌 Mektubun</a>';
        }


        if (isValentine) {
            document.getElementById('valentine').style.display = 'block';
            document.getElementById('heroLine3').textContent = 'Sevgililer Günün Kutlu Olsun!';
            document.getElementById('heroSubtitle').textContent =
                'Kartanem, bugün sadece senin için… Her şey senin için 💝';
            // document.getElementById('heroButtons').innerHTML =
            //     '<a href="#valentine" class="btn btn-primary">💝 Sevgililer Günün</a>' +
            //     '<a href="#song"      class="btn btn-secondary">🎵 Şarkımız</a>' +
            //     '<a href="#letter"    class="btn btn-secondary">💌 Mektubun</a>';

            // Slider'ı başlat (valentine açıkken)
            initSlider();
        }

        // Scroll animasyonlarını başlat (section açıkken)
        initScrollAnimations();

    } else {
        // ── Kilitli ekran: sıradaki özel güne geri sayım ──
        document.getElementById('siteContent').style.display = 'none';
        document.getElementById('lockedScreen').style.display = 'flex';

        function nextSpecialDay() {
            const y = now.getFullYear();
            const candidates = [
                {
                    name: `🎂 Doğum Günü (${BIRTHDAY_DAY} ${AY[BIRTHDAY_MONTH]})`,
                    date: new Date(y, BIRTHDAY_MONTH - 1, BIRTHDAY_DAY, 0, 0, 0)
                },
                {
                    name: `🎂 Doğum Günü (${BIRTHDAY_DAY} ${AY[BIRTHDAY_MONTH]})`,
                    date: new Date(y + 1, BIRTHDAY_MONTH - 1, BIRTHDAY_DAY, 0, 0, 0)
                },
                {
                    name: `💝 Sevgililer Günü (${VALENTINE_DAY} ${AY[VALENTINE_MONTH]})`,
                    date: new Date(y, VALENTINE_MONTH - 1, VALENTINE_DAY, 0, 0, 0)
                },
                {
                    name: `💝 Sevgililer Günü (${VALENTINE_DAY} ${AY[VALENTINE_MONTH]})`,
                    date: new Date(y + 1, VALENTINE_MONTH - 1, VALENTINE_DAY, 0, 0, 0)
                },
            ];
            return candidates
                .filter(c => c.date > now)
                .sort((a, b) => a.date - b.date)[0];
        }

        const next = nextSpecialDay();
        const nameEl = document.getElementById('lockedNextName');
        if (nameEl) nameEl.textContent = next.name;  // element yoksa (yorum satırıysa) atla

        function updateLockedCountdown() {
            const diff = next.date - new Date();
            if (diff <= 0) { location.reload(); return; }
            setCountdown('lc', diff);
        }
        updateLockedCountdown();
        setInterval(updateLockedCountdown, 1000);
    }
})();


// ─────────────────────────────────────────────
//  YARDIMCI: Geri sayım kutularını güncelle
//  prefix: 'lc' | 'bd' | 'vd'
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
//  2. DOĞUM GÜNÜ GERİ SAYIM
// ─────────────────────────────────────────────
function getBirthdayDate() {
    const now = new Date();
    // Bugün doğum günüyse sayacı 00:00:00 da dondur
    if (now.getMonth() + 1 === BIRTHDAY_MONTH && now.getDate() === BIRTHDAY_DAY) {
        return new Date(now.getFullYear(), BIRTHDAY_MONTH - 1, BIRTHDAY_DAY, 0, 0, 0);
    }
    let target = new Date(now.getFullYear(), BIRTHDAY_MONTH - 1, BIRTHDAY_DAY, 0, 0, 0);
    if (target <= now) {
        target = new Date(now.getFullYear() + 1, BIRTHDAY_MONTH - 1, BIRTHDAY_DAY);
    }
    return target;
}

function updateBirthdayCountdown() {
    const diff = getBirthdayDate() - new Date();
    if (diff <= 0) { zeroCountdown('bd'); return; }
    setCountdown('bd', diff);
}
updateBirthdayCountdown();
setInterval(updateBirthdayCountdown, 1000);


// ─────────────────────────────────────────────
//  3. SEVGİLİLER GÜNÜ GERİ SAYIM
// ─────────────────────────────────────────────
function getValentineDate() {
    const now = new Date();
    // Bugün Sevgililer Günüyse sayacı 00:00:00 da dondur
    if (now.getMonth() + 1 === VALENTINE_MONTH && now.getDate() === VALENTINE_DAY) {
        return new Date(now.getFullYear(), VALENTINE_MONTH - 1, VALENTINE_DAY, 0, 0, 0);
    }
    let target = new Date(now.getFullYear(), VALENTINE_MONTH - 1, VALENTINE_DAY, 0, 0, 0);
    if (target <= now) {
        target = new Date(now.getFullYear() + 1, VALENTINE_MONTH - 1, VALENTINE_DAY);
    }
    return target;
}

function updateValentineCountdown() {
    const diff = getValentineDate() - new Date();
    if (diff <= 0) { zeroCountdown('vd'); return; }
    setCountdown('vd', diff);
}
updateValentineCountdown();
setInterval(updateValentineCountdown, 1000);


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


