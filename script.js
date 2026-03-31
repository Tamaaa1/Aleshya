// SPA Router & Shared interactions

document.addEventListener('DOMContentLoaded', () => {
    handleCreatorOverlay();
    setupNavigation();
    setupSPARouter();
    
    // Setup efek latar belakang global 
    setupFloatingHearts();
    setupSparkles();
    setupLightbox();
    setupAnchorScroll();
    setupBGM();

    // Parse URL saat pertama kali load untuk membuka view yang sesuai
    const path = window.location.pathname.split('/').pop() || 'index.html';
    showView(path);
});

/* ================================
   SPA ROUTER
   ================================ */

function setupSPARouter() {
    // Tangkap semua klik pada link navigasi beratribut data-spa
    document.body.addEventListener('click', e => {
        const link = e.target.closest('a[data-spa]');
        if (link) {
            e.preventDefault();
            const href = link.getAttribute('href');
            navigateTo(href);
        }
    });

    // Tangani event back/forward dari browser
    window.addEventListener('popstate', () => {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        showView(path);
    });
}

function navigateTo(path) {
    history.pushState(null, '', path);
    showView(path);
}

function showView(path) {
    // Tentukan ID view dari path URL
    let viewId = 'view-index';
    if (path === 'story.html') viewId = 'view-story';
    else if (path === 'letter.html') viewId = 'view-letter';
    else if (path === 'songs.html') viewId = 'view-songs';
    else if (path === 'proposal.html') viewId = 'view-proposal';

    // Sembunyikan semua view
    document.querySelectorAll('.page-view').forEach(view => {
        view.classList.remove('active');
    });

    // Tampilkan view target
    const target = document.getElementById(viewId);
    if (target) {
        target.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'instant' });
        
        // Re-inisialisasi semua skrip animasi lokal untuk halaman yang baru aktif
        initView();
        
        // Update class active pada navigasi
        document.querySelectorAll('.nav-links a').forEach(link => {
            if (link.getAttribute('href') === path) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

// Skrip ini hanya dijalankan pada kontainer view yang sedang aktif
function initView() {
    setupRevealAnimations();
    setupTypingEffect();
    setupReadMore();
    setupSongAudio();
    setupSoloSong();
    setupProposalPage();
}


/* ================================
   BACKGROUND MUSIC
   ================================ */

function setupBGM() {
    let bgm = document.getElementById('global-bgm');
    if (!bgm) {
        bgm = document.createElement('audio');
        bgm.id = 'global-bgm';
        bgm.src = 'audio/Sempurna (Acoustic Version).mp3';
        bgm.loop = true;
        bgm.style.display = 'none';
        document.body.appendChild(bgm);
    }

    // Hanya dengan mengklik "Mulai dari sini ya!!" audio akan nyala
    // Setelah itu lagu tidak akan pernah terputus karena website sudah SPA
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            bgm.play().catch(e => console.log('BGM Play prevented:', e));
        });
    }
}


/* ================================
   UI & COMPONENT FUNCTIONS
   ================================ */

function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
}

function setupAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const targetId = link.getAttribute('href').slice(1);
            const el = document.getElementById(targetId);
            if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function setupRevealAnimations() {
    // Hanya pantau elemen reveal di dalam view yang aktif
    const items = document.querySelectorAll('.page-view.active .reveal:not(.visible)');
    if (!items.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });

    items.forEach(el => observer.observe(el));
}

function setupFloatingHearts() {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.inset = '0';
    container.style.pointerEvents = 'none';
    container.style.overflow = 'hidden';
    container.style.zIndex = '0';
    document.body.appendChild(container);

    setInterval(() => {
        const heart = document.createElement('span');
        heart.className = 'floating-heart';
        heart.textContent = '❤';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.fontSize = `${16 + Math.random() * 12}px`;
        heart.style.animationDuration = `${5 + Math.random() * 4}s`;
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 9000);
    }, 1200);
}

function setupSparkles() {
    if (document.querySelector('.sparkle-field')) return;
    const field = document.createElement('div');
    field.className = 'sparkle-field';
    const count = 28;
    for (let i = 0; i < count; i++) {
        const spark = document.createElement('span');
        repositionSparkle(spark);
        spark.style.animationDelay = `${Math.random() * 6}s`;
        spark.style.animationDuration = `${6 + Math.random() * 4}s`;
        spark.addEventListener('animationiteration', () => repositionSparkle(spark));
        field.appendChild(spark);
    }
    document.body.appendChild(field);
}

function repositionSparkle(el) {
    el.style.left = `${Math.random() * 100}%`;
    el.style.top = `${Math.random() * 100}%`;
}

function setupTypingEffect() {
    const typingEls = document.querySelectorAll('.page-view.active [data-typing]');
    if (!typingEls.length) return;

    typingEls.forEach(typingEl => {
        // Reset animasi ulang jika masuk ke page view lagi
        const text = typingEl.dataset.text || typingEl.getAttribute('data-typing') || typingEl.textContent.trim();
        typingEl.dataset.text = text; // Simpan asli
        typingEl.textContent = '';
        let index = 0;

        const type = () => {
            if (index <= text.length) {
                typingEl.textContent = text.slice(0, index);
                index++;
                setTimeout(type, 38);
            }
        };
        type();
    });
}

function setupReadMore() {
    const expandables = document.querySelectorAll('.page-view.active .expandable');
    const toggleBtns = document.querySelectorAll('.page-view.active .read-more');
    if (!expandables.length || !toggleBtns.length) return;

    toggleBtns.forEach((btn, idx) => {
        // Hapus event listener lama mencegah double fire
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', () => {
            const isOpen = expandables[idx].classList.toggle('open');
            newBtn.textContent = isOpen ? 'Show Less' : 'Read More';
        });
    });
}

function setupLightbox() {
    const images = Array.from(document.querySelectorAll('[data-gallery]'));
    if (!images.length) return;

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img alt="memory" />
            <button class="prev" aria-label="Previous">‹</button>
            <button class="next" aria-label="Next">›</button>
            <button class="close" aria-label="Close">×</button>
        </div>
    `;
    document.body.appendChild(lightbox);

    const imgEl = lightbox.querySelector('img');
    const prevBtn = lightbox.querySelector('.prev');
    const nextBtn = lightbox.querySelector('.next');
    const closeBtn = lightbox.querySelector('.close');
    let current = 0;

    const openLightbox = index => {
        current = index;
        imgEl.src = images[current].src;
        lightbox.classList.add('active');
    };

    const showNext = dir => {
        current = (current + dir + images.length) % images.length;
        imgEl.src = images[current].src;
    };

    images.forEach((img, idx) => {
        img.dataset.index = idx;
        img.addEventListener('click', () => openLightbox(idx));
    });

    prevBtn.addEventListener('click', () => showNext(-1));
    nextBtn.addEventListener('click', () => showNext(1));
    closeBtn.addEventListener('click', () => lightbox.classList.remove('active'));
    lightbox.addEventListener('click', e => {
        if (e.target === lightbox) lightbox.classList.remove('active');
    });

    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') lightbox.classList.remove('active');
        if (e.key === 'ArrowRight') showNext(1);
        if (e.key === 'ArrowLeft') showNext(-1);
    });
}

function setupSongAudio() {
    const audioEls = Array.from(document.querySelectorAll('.page-view.active .song-card audio, .page-view.active .solo-song audio'));
    if (!audioEls.length) return;

    audioEls.forEach(audio => {
        audio.addEventListener('play', () => {
            audioEls.forEach(other => {
                if (other !== audio) other.pause();
            });
            const globalBgm = document.getElementById('global-bgm');
            if (globalBgm && !globalBgm.paused) {
                globalBgm.pause();
            }
        });
    });
}

function setupSoloSong() {
    const playBtn = document.getElementById('playDieSong');
    const customBtn = document.getElementById('customPlayPauseBtn');
    const audio = document.getElementById('dieSongAudio');
    const progressBar = document.getElementById('audioProgressBar');
    const currentTimeDisplay = document.getElementById('currentTimeDisplay');
    const durationDisplay = document.getElementById('durationDisplay');
    
    if (!audio) return;

    const iconPlay = document.getElementById('iconPlay');
    const iconPause = document.getElementById('iconPause');

    // Format time function
    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    const togglePlay = () => {
        if (audio.paused) {
            audio.play();
            if (playBtn) playBtn.textContent = 'Pause Out Of My League';
            if (customBtn) {
                customBtn.classList.add('playing');
                if (iconPlay) iconPlay.style.display = 'none';
                if (iconPause) iconPause.style.display = 'block';
            }
            const globalBgm = document.getElementById('global-bgm');
            if (globalBgm && !globalBgm.paused) globalBgm.pause();
        } else {
            audio.pause();
            if (playBtn) playBtn.textContent = 'Play Out Of My League';
            if (customBtn) {
                customBtn.classList.remove('playing');
                if (iconPlay) iconPlay.style.display = 'block';
                if (iconPause) iconPause.style.display = 'none';
            }
        }
    };

    // Attach click listeners cleanly for SPA
    if (playBtn) {
        const newPlayBtn = playBtn.cloneNode(true);
        playBtn.parentNode.replaceChild(newPlayBtn, playBtn);
        newPlayBtn.addEventListener('click', togglePlay);
    }
    
    if (customBtn) {
        const newCustomBtn = customBtn.cloneNode(true);
        customBtn.parentNode.replaceChild(newCustomBtn, customBtn);
        newCustomBtn.addEventListener('click', togglePlay);
    }

    // Only attach timeupdate event once per audio element lifetime
    if (!audio.dataset.initialized) {
        audio.dataset.initialized = 'true';

        audio.addEventListener('timeupdate', () => {
            if (audio.duration && progressBar) {
                const progressPercent = (audio.currentTime / audio.duration) * 100;
                progressBar.value = progressPercent;
            }
            if (currentTimeDisplay) {
                currentTimeDisplay.textContent = formatTime(audio.currentTime);
            }
        });

        if (progressBar) {
            progressBar.addEventListener('input', (e) => {
                if (audio.duration) {
                    const newTime = (e.target.value / 100) * audio.duration;
                    audio.currentTime = newTime;
                    if (currentTimeDisplay) currentTimeDisplay.textContent = formatTime(newTime);
                }
            });
        }

        audio.addEventListener('loadedmetadata', () => {
            if (durationDisplay) durationDisplay.textContent = formatTime(audio.duration);
        });

        audio.addEventListener('ended', () => {
            const currentPlayBtn = document.getElementById('playDieSong');
            const currentCustomBtn = document.getElementById('customPlayPauseBtn');
            const currIconPlay = document.getElementById('iconPlay');
            const currIconPause = document.getElementById('iconPause');

            if (currentPlayBtn) currentPlayBtn.textContent = 'Play Out Of My League';
            if (currentCustomBtn) {
                currentCustomBtn.classList.remove('playing');
                if (currIconPlay) currIconPlay.style.display = 'block';
                if (currIconPause) currIconPause.style.display = 'none';
            }
            if (progressBar) progressBar.value = 0;
            if (currentTimeDisplay) currentTimeDisplay.textContent = '0:00';
        });
    } else {
        // If already initialized but re-rendered, update metadata display manually
        if (durationDisplay && audio.readyState >= 1) {
            durationDisplay.textContent = formatTime(audio.duration);
        }
    }
}

function handleCreatorOverlay() {
    const overlay = document.getElementById('creator-overlay');
    const btn = document.getElementById('creator-continue');
    if (!overlay || !btn) return;

    const dismiss = () => {
        overlay.classList.add('hidden');
        overlay.style.display = 'none';
        setTimeout(() => overlay.remove(), 400);
    };

    if (localStorage.getItem('creatorSeen')) {
        dismiss();
        return;
    }

    btn.addEventListener('click', () => {
        localStorage.setItem('creatorSeen', 'true');
        dismiss();
        
        const bgm = document.getElementById('global-bgm');
        if (bgm) {
            bgm.play().catch(e => console.log('BGM Play prevented:', e));
        }
    });
}

function setupProposalPage() {
    const yesBtn = document.getElementById('yesButton');
    const thinkBtn = document.getElementById('thinkButton');
    const messageBox = document.querySelector('.page-view.active .message-box');

    if (yesBtn && messageBox) {
        // Clone to prevent duplicate listeners across view navigations
        const newYes = yesBtn.cloneNode(true);
        yesBtn.parentNode.replaceChild(newYes, yesBtn);
        
        newYes.addEventListener('click', () => {
            messageBox.innerHTML = `
                <div style="margin-bottom: 16px; font-weight: 500;">
                    Yeayy finally!! Rasanya lega banget hehe. Having you as mine is literally the best plot twist in my life. You're truly the best thing that's ever happened to me.
                </div>
                <a href="https://wa.me/6285820659198?text=Iyaaaa%20aku%20mau%20kok!!" target="_blank" class="btn btn-primary" style="display:inline-flex; align-items:center; gap:8px; font-size:15px; padding:12px 24px; border-radius:30px; text-decoration:none;">
                    kalau udh beneran yakin tekan tombol ini yaa
                </a>
            `;
            launchCelebration();
        });
    }

    if (thinkBtn && messageBox) {
        const newThink = thinkBtn.cloneNode(true);
        thinkBtn.parentNode.replaceChild(newThink, thinkBtn);

        const dodgeBtn = () => {
            if (newThink.parentNode !== document.body) {
                document.body.appendChild(newThink);
            }
            newThink.classList.add('tricky-btn');
            const safeMargin = 60; // Kurangi safe margin supaya makin bebas
            const x = Math.random() * (window.innerWidth - newThink.offsetWidth - safeMargin);
            const y = Math.random() * (window.innerHeight - newThink.offsetHeight - safeMargin);
            newThink.style.left = `${Math.max(10, x + safeMargin / 2)}px`;
            newThink.style.top = `${Math.max(10, y + safeMargin / 2)}px`;
        };

        newThink.addEventListener('touchstart', (e) => {
            e.preventDefault();
            dodgeBtn();
        }, { passive: false });

        newThink.addEventListener('click', (e) => {
            e.preventDefault();
            dodgeBtn();
        });
    }
}

function launchCelebration() {
    const burst = document.createElement('div');
    burst.style.position = 'fixed';
    burst.style.inset = '0';
    burst.style.pointerEvents = 'none';
    burst.style.overflow = 'hidden';
    burst.style.zIndex = '30';
    document.body.appendChild(burst);

    for (let i = 0; i < 28; i++) {
        setTimeout(() => createConfettiHeart(burst), i * 120);
    }

    setTimeout(() => burst.remove(), 4500);
}

function createConfettiHeart(container) {
    const heart = document.createElement('span');
    heart.textContent = ['❤', '♡', '❥'][Math.floor(Math.random() * 3)];
    heart.style.position = 'absolute';
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.top = `${Math.random() * 20}%`;
    heart.style.fontSize = `${18 + Math.random() * 18}px`;
    heart.style.color = ['#e26a8b', '#f59ab2', '#c94f73'][Math.floor(Math.random() * 3)];
    heart.style.transform = 'translate(-50%, -50%)';
    heart.style.animation = 'floatUp 3.2s ease forwards';
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 3500);
}
