'use strict';

(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const welcomeScreen = $('#welcomeScreen');
  const diaryScreen = $('#diaryScreen');
  const detailScreen = $('#detailScreen');
  const detailContent = $('#detailContent');
  const toast = $('#toast');
  const surpriseModal = $('#surpriseModal');
  const surpriseTitle = $('#surpriseTitle');
  const surpriseText = $('#surpriseText');
  let activeSurprise = { title: 'یه سورپرایز برای تو!', text: 'رونیا، امیدوارم هر روزت یه دلیل کوچولو برای خندیدن داشته باشه. دنیا با بودن آدمای قشنگی مثل تو، جای مهربون‌تریه. ♡' };
  let toastTimer;
  let foundHearts = 0;
  let soundEnabled = false;
  let audioContext = null;

  const pageContent = {
    memories: {
      icon: '💭', label: 'LITTLE THINGS THAT STAY', title: 'ردپای حرف‌هامون', intro: 'ما لازم نیست کلی عکس کنار هم داشته باشیم تا یه چیزایی برامون قشنگ و موندنی بشن؛ بعضی حرفا و حس‌ها خودشون یه جور خاطره‌ان. ♡', surpriseTitle: 'یه چیز کوچولو که می‌خوام یادت بمونه', surpriseText: 'حتی اگه هنوز کلی لحظه هست که باید با هم بسازیم، همین حرف زدن‌ها و خنده‌های کوچولو هم ارزش خودشون رو دارن. لازم نیست خاطره‌هامون شبیه بقیه باشن تا قشنگ باشن. ♡', body: `
        <div class="memory-list">
          <article class="memory-note"><h4>💌 حرفایی که توی دل می‌مونن</h4><p>بعضی پیام‌ها شاید کوتاه باشن، ولی می‌تونن کل روز آدم رو قشنگ‌تر کنن؛ مخصوصاً وقتی از طرف یه آدم خاص باشن.</p></article>
          <article class="memory-note"><h4>☁️ خنده‌های یهویی</h4><p>شوخی‌های بی‌موقع، کش دادن کلمه‌ها و حرف‌های الکی‌ای که یهو تبدیل می‌شن به بهترین قسمت روز.</p></article>
          <article class="memory-note"><h4>🌷 چیزایی که هنوز قراره بسازیم</h4><p>این صفحه پر از عکس نیست؛ جا برای اتفاق‌هاییه که هنوز نیفتادن و خاطره‌هایی که وقتشون نرسیده. عجله‌ای هم نداریم.</p></article>
        </div>`
    },
    letter: {
      icon: '💌', label: 'A LETTER FROM THE HEART', title: 'یه نامه کوچولو برای داکترر کوشولوی من', intro: 'این یکی رو از ته دلم نوشتم، با همون زبون خودمونی خودمون. ♡', surpriseTitle: 'یه حرف دیگه هم هست', surpriseText: 'قرار نیست همیشه حالت خوب باشه تا دوست‌داشتنی باشی. روزهای سختت هم بخشی از خودتن و تو توی اون روزها هم ارزشمندی. ♡', body: `
        <article class="letter-paper paper-card">
          <p>رونیا جونم،</p>
          <p>خواستم یه گوشه از این دفترچه رو فقط به تو اختصاص بدم؛ به خودِ خودت، با همه‌ی شیطنت‌ها، فکرها، خنده‌ها و روزهایی که شاید خیلی هم آسون نباشن.</p>
          <p>هیچ‌وقت نیاز نیست همیشه خودت رو خوب نشون بدی جلوی من. من اینجام که تو حال بدی و حال خوبی‌هات کنارت باشم؛ لازم نیست برای من نقش آدمی رو بازی کنی که همیشه همه‌چیزش مرتبه.</p>
          <p>برات کلی روز روشن، اتفاق‌های دوست‌داشتنی و آرزوهایی می‌خوام که یکی‌یکی بهشون برسی. امیدوارم وقتی این صفحه رو می‌خونی، یه لبخند کوچولو روی لبت بیاد.</p>
          <p>مراقب دل قشنگت باش. ♡</p><p class="signature">with love, always ✧</p>
        </article>`
    },
    wishes: {
      icon: '🌙', label: 'OUR LITTLE TOMORROW', title: 'فردای قشنگمون', intro: 'یه گوشه از این صفحه برای روزهاییه که هنوز نرسیدن؛ نه قول عجیب می‌دیم، نه عجله می‌کنیم، فقط به قشنگیِ رسیدن فکر می‌کنیم. ♡', surpriseTitle: 'یه قول از ته دلم 🙃❤️', surpriseText: 'یه روز بالاخره همدیگه رو می‌بینیم، اینو بهت قول می‌دم و تا تهش هم کنارت می‌مونم 🙃🙃❤️', body: `
        <div class="wish-list">
          <div class="wish-item"><span class="wish-dot">🌈</span><span>روزهایی پر از خبرهای خوب و خنده‌های از ته دل.</span></div>
          <div class="wish-item"><span class="wish-dot">🧸</span><span>رسیدن به هدف‌هایی که براشون ذوق داری.</span></div>
          <div class="wish-item"><span class="wish-dot">🤍</span><span>یه روز بالاخره همو می‌بینیم و با هم کنار هم به آرزوهامون می‌رسیم.</span></div>
          <div class="wish-item"><span class="wish-dot">✨</span><span>وقتی بالاخره کنار همیم، برای چیزهایی که امروز فقط ازشون حرف می‌زنیم، قدم‌به‌قدم تلاش کنیم.</span></div>
          <div class="wish-item"><span class="wish-dot">☁️</span><span>اینکه حتی وسط روزهای شلوغ، برای خودت وقت داشته باشی.</span></div>
        </div>`
    },
    game: {
      icon: '🎀', label: 'SIX LITTLE REMINDERS', title: 'شکار قلب‌های کوچولو', intro: 'شش تا قلب قایم کردم؛ هر کدوم یه حرفیه که دلم می‌خواد وقتی لازم داشتی، دوباره بخونیش. ♡', surpriseTitle: 'این همه قلب، برای تو', surpriseText: 'همه‌ی قلب‌ها رو پیدا کردی! ولی اصل سورپرایز اینه که این حرفا فقط برای برنده شدن توی بازی نیستن؛ دلم می‌خواد هر وقت بهشون نیاز داشتی، یادت بیاد چقدر ارزشمندی. ♡', body: `
        <div class="game-panel"><div class="detail-hero-icon">🎀</div><h3>چندتا قلب پیدا می‌کنی؟</h3><p>هر قلب رو فقط یک بار می‌تونی باز کنی. همه‌ی ۶ پیام رو پیدا کن تا سورپرایز آخر رو ببینی.</p>
          <div class="heart-grid" id="heartGrid">
            <button class="heart-tile" type="button" data-message="خیلی خیلی دوست دارم، بیشتر از چیزی که توی چندتا کلمه جا بشه. ♡" aria-label="قلب مخفی شماره یک">♡</button>
            <button class="heart-tile" type="button" data-message="ادامه‌ی لبخندت رو دست‌کم نگیر، چون خیلی زیباست. 🌷" aria-label="قلب مخفی شماره دو">♡</button>
            <button class="heart-tile" type="button" data-message="دست از تلاش برندار؛ تو لایق بهترین‌هایی. ✨" aria-label="قلب مخفی شماره سه">♡</button>
            <button class="heart-tile" type="button" data-message="تو دختر بااستعدادی هستی؛ من بهت افتخار می‌کنم. ☁️" aria-label="قلب مخفی شماره چهار">♡</button>
            <button class="heart-tile" type="button" data-message="لازم نیست شبیه هیچ‌کس باشی؛ خودت بودن قشنگه. 🎀" aria-label="قلب مخفی شماره پنج">♡</button>
            <button class="heart-tile" type="button" data-message="هر وقت خسته شدی، یادت باشه لازم نیست همه‌چی رو یه‌روزه درست کنی. 🌙" aria-label="قلب مخفی شماره شش">♡</button>
          </div><p class="game-score" id="gameScore">قلب‌های پیدا شده: ۰ از ۶</p>
          <button class="primary-button small-button" id="replayGame" type="button">شروع دوباره ↻</button>
        </div>`
    }
  };

  function showScreen(screen) {
    [welcomeScreen, diaryScreen, detailScreen].forEach(item => {
      const active = item === screen;
      item.hidden = !active;
      item.classList.toggle('active', active);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function notify(message) {
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2300);
  }

  function makeSparkles() {
    const field = $('#sparkleField');
    if (!field) return;
    const symbols = ['✦', '✧', '·', '♡'];
    for (let i = 0; i < 24; i += 1) {
      const sparkle = document.createElement('span');
      sparkle.className = 'sparkle';
      sparkle.textContent = symbols[i % symbols.length];
      sparkle.style.left = `${(i * 37 + 11) % 97}%`;
      sparkle.style.top = `${(i * 53 + 7) % 96}%`;
      sparkle.style.fontSize = `${8 + (i % 4) * 3}px`;
      sparkle.style.animationDelay = `${(i % 7) * -0.43}s`;
      field.appendChild(sparkle);
    }
  }

  function tinyChime() {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      audioContext = audioContext || new AudioCtx();
      if (audioContext.state === 'suspended') audioContext.resume();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = 660;
      gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.23);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.24);
    } catch (error) {
      // Audio is optional; the diary remains fully functional if the browser blocks it.
    }
  }

  function openPage(pageKey) {
    const page = pageContent[pageKey];
    if (!page) return;
    detailContent.innerHTML = `
      <div class="detail-hero-icon">${page.icon}</div>
      <p class="mini-label">${page.label}</p>
      <h2 class="detail-title">${page.title}</h2>
      <p class="detail-intro">${page.intro}</p>
      ${page.body}
      ${pageKey !== 'game' ? '<button class="primary-button detail-action" id="surpriseButton" type="button">یه سورپرایز مخصوص همین صفحه ♡</button>' : ''}
    `;
    showScreen(detailScreen);
    tinyChime();
    if (pageKey !== 'game') {
      $('#surpriseButton')?.addEventListener('click', () => openSurprise(page.surpriseTitle, page.surpriseText));
    } else {
      setupHeartGame();
    }
  }

  function openSurprise(title = activeSurprise.title, text = activeSurprise.text) {
    activeSurprise = { title, text };
    surpriseTitle.textContent = title;
    surpriseText.textContent = text;
    surpriseModal.hidden = false;
    $('#closeSurprise').focus();
    tinyChime();
  }

  function closeSurprise() {
    surpriseModal.hidden = true;
  }

  function setupHeartGame() {
    foundHearts = 0;
    const tiles = $$('.heart-tile', detailContent);
    const score = $('#gameScore', detailContent);
    const persianNumber = number => String(number).replace(/[0-9]/g, digit => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)]);
    tiles.forEach(tile => {
      tile.disabled = false;
      tile.classList.remove('revealed');
      tile.textContent = '♡';
      tile.addEventListener('click', () => {
        if (tile.classList.contains('revealed')) return;
        tile.classList.add('revealed');
        tile.textContent = tile.dataset.message;
        tile.disabled = true;
        foundHearts += 1;
        score.textContent = `قلب‌های پیدا شده: ${persianNumber(foundHearts)} از ۶`;
        tinyChime();
        if (foundHearts === tiles.length) {
          notify('همه‌ی قلب‌ها رو پیدا کردی! یه سورپرایز داری ♡');
          window.setTimeout(() => openSurprise(pageContent.game.surpriseTitle, pageContent.game.surpriseText), 500);
        }
      }, { once: true });
    });
    $('#replayGame', detailContent)?.addEventListener('click', setupHeartGame);
  }

  $('#enterButton').addEventListener('click', () => {
    showScreen(diaryScreen);
    notify('به دفترچه‌ی کوچولوت خوش اومدی ♡');
    tinyChime();
  });

  $('#homeButton').addEventListener('click', () => showScreen(welcomeScreen));
  $('#backButton').addEventListener('click', () => showScreen(diaryScreen));
  $$('.page-card').forEach(card => card.addEventListener('click', () => openPage(card.dataset.page)));
  $('#musicButton').addEventListener('click', event => {
    soundEnabled = !soundEnabled;
    event.currentTarget.classList.toggle('is-on', soundEnabled);
    event.currentTarget.setAttribute('aria-pressed', String(soundEnabled));
    event.currentTarget.setAttribute('aria-label', soundEnabled ? 'خاموش کردن صدای زنگوله' : 'روشن کردن صدای زنگوله');
    notify(soundEnabled ? 'صدای زنگوله روشن شد ♫' : 'صدای زنگوله خاموش شد');
    tinyChime();
  });
  $('#closeSurprise').addEventListener('click', closeSurprise);
  $('#okaySurprise').addEventListener('click', closeSurprise);
  surpriseModal.addEventListener('click', event => {
    if (event.target === surpriseModal) closeSurprise();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !surpriseModal.hidden) closeSurprise();
  });

  makeSparkles();
})();
