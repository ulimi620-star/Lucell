/* 메뉴 · 영상 · 등장 효과. 라이브러리 없음. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // 휴대폰 메뉴
  const btn = $('.menu-btn'), mnav = $('#mnav');
  if (btn && mnav) {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      btn.setAttribute('aria-label', open ? '메뉴 열기' : '메뉴 닫기');
      mnav.hidden = open;
    });
    $$('a', mnav).forEach(a => a.addEventListener('click', () => { mnav.hidden = true; btn.setAttribute('aria-expanded', 'false'); }));
  }

  // 유튜브: data-youtube 가 11자 ID면 임베드, 아니면 안내 카드
  $$('.video').forEach(box => {
    const raw = (box.dataset.youtube || '').trim();
    const m = raw.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([A-Za-z0-9_-]{11})/) || raw.match(/^([A-Za-z0-9_-]{11})$/);
    if (m) {
      const f = document.createElement('iframe');
      f.src = `https://www.youtube-nocookie.com/embed/${m[1]}?rel=0`;
      f.title = box.dataset.title || '영상';
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      f.allowFullscreen = true; f.loading = 'lazy';
      box.replaceChildren(f);
    } else {
      const d = document.createElement('div'); d.className = 'video-empty';
      d.textContent = '영상 링크를 넣으면 여기서 바로 재생돼요. (index.html의 data-youtube에 유튜브 주소)';
      box.replaceChildren(d);
    }
  });

  // 패널 색: 누른 색만 골드 링 + 이름·사진 바꾸기(assets/item-4~8.jpg, 없으면 자리표시)
  const opts = $$('.opts[role="group"] .opt'), photo = $('#panel-photo'), picked = $('#picked-name');
  opts.forEach(o => o.addEventListener('click', () => {
    opts.forEach(x => x.setAttribute('aria-pressed', String(x === o)));
    const name = o.textContent.trim(), n = o.dataset.n;
    if (picked) picked.textContent = name;
    if (photo) {
      photo.dataset.label = `${name} 패널 사진 (assets/item-${n}.jpg)`;
      photo.querySelector('img')?.remove();
      const img = new Image(); img.alt = `${name} 패널`; img.onerror = () => img.remove(); img.src = `assets/item-${n}.jpg`;
      photo.append(img);
    }
  }));

  // 등장 효과
  const targets = $$('.sec .wrap, .hero-grid > *');
  targets.forEach(el => el.classList.add('reveal'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
    targets.forEach(el => io.observe(el));
  } else targets.forEach(el => el.classList.add('in'));

  // 하단 고정 버튼: 목표 행동 섹션이 보이면 숨김
  // 패널 색 섹션의 구매 버튼이 보일 때도 숨김(같은 버튼 두 개가 겹쳐 보이지 않게)
  const bar = $('.cta-bar'), watch = [$('#action'), $('#detail .btn')].filter(Boolean);
  if (bar && watch.length && 'IntersectionObserver' in window) {
    const seen = new Set();
    const io = new IntersectionObserver(es => {
      es.forEach(e => e.isIntersecting ? seen.add(e.target) : seen.delete(e.target));
      bar.style.display = seen.size ? 'none' : '';
    });
    watch.forEach(el => io.observe(el));
  }
})();
