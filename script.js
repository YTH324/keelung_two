// 基隆北管｜桌機滑動底線 + 手機 RWD 導覽選單

const navToggle = document.querySelector('.nav-toggle');
const mainNavigation = document.querySelector('.main-navigation');
const navList = document.querySelector('.nav-list');
const desktopMedia = window.matchMedia('(min-width: 1181px)');

// 手機／平板選單：點擊開關、選取連結或點擊外部可關閉、Esc 可關閉。
if (navToggle && mainNavigation) {
  function closeMenu(restoreFocus = false) {
    const wasOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', '開啟選單');
    mainNavigation.classList.remove('is-open');
    if (restoreFocus && wasOpen) navToggle.focus();
  }

  navToggle.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') !== 'true';
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? '關閉選單' : '開啟選單');
    mainNavigation.classList.toggle('is-open', open);
  });

  mainNavigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu(true);
  });

  desktopMedia.addEventListener('change', () => closeMenu());
}

// 桌機使用同一條底線滑到滑鼠或鍵盤目前指向的選項。
// 移開後回到 aria-current="page" 的目前頁面。
if (navList) {
  const navLinks = [...navList.querySelectorAll('a')];
  const activeLink = navLinks.find(link => link.getAttribute('aria-current') === 'page') || navLinks[0];

  function moveLineTo(link) {
    if (!desktopMedia.matches || !link) return;
    const parent = navList.getBoundingClientRect();
    const rect = link.getBoundingClientRect();
    navList.style.setProperty('--nav-line-x', `${rect.left - parent.left}px`);
    navList.style.setProperty('--nav-line-y', `${rect.bottom - parent.top - 1}px`);
    navList.style.setProperty('--nav-line-width', `${rect.width}px`);
    navList.classList.add('nav-line-ready');
  }

  function resetLine() { moveLineTo(activeLink); }

  navLinks.forEach(link => {
    link.addEventListener('pointerenter', () => moveLineTo(link));
    link.addEventListener('focus', () => moveLineTo(link));
  });

  navList.addEventListener('pointerleave', resetLine);
  navList.addEventListener('focusout', event => {
    if (!navList.contains(event.relatedTarget)) resetLine();
  });

  function syncLine() {
    if (desktopMedia.matches) resetLine();
    else navList.classList.remove('nav-line-ready');
  }

  window.addEventListener('resize', syncLine);
  desktopMedia.addEventListener('change', syncLine);
  if (document.fonts) document.fonts.ready.then(syncLine);
  syncLine();
}
