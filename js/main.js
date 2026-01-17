document.addEventListener('DOMContentLoaded', function() {
  // スクリーンショットスライダー
  initScreenshotSlider();

  // スムーズスクロール（ヘッダーの高さを考慮）
  initSmoothScroll();

  // ヘッダーの背景変更
  initHeaderScroll();
});

/**
 * スクリーンショットスライダーの初期化
 */
function initScreenshotSlider() {
  const container = document.querySelector('.screenshots-container');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  const dotsContainer = document.querySelector('.slider-dots');
  const items = document.querySelectorAll('.screenshot-item');

  if (!container || !items.length) return;

  // ドットを作成
  items.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => scrollToItem(index));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.slider-dots .dot');

  // 前へボタン
  prevBtn.addEventListener('click', () => {
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  // 次へボタン
  nextBtn.addEventListener('click', () => {
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  // 特定のアイテムにスクロール
  function scrollToItem(index) {
    const item = items[index];
    if (item) {
      const containerRect = container.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      const scrollLeft = container.scrollLeft + itemRect.left - containerRect.left - (containerRect.width - itemRect.width) / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }

  // スクロール位置に応じてドットを更新
  container.addEventListener('scroll', () => {
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    items.forEach((item, index) => {
      const itemRect = item.getBoundingClientRect();
      const itemCenter = itemRect.left + itemRect.width / 2;
      const distance = Math.abs(containerCenter - itemCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === closestIndex);
    });
  });

  // タッチデバイス対応
  let startX = 0;
  let scrollLeft = 0;
  let isDragging = false;

  container.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    const x = e.touches[0].pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeft - walk;
  }, { passive: true });
}

/**
 * スムーズスクロールの初期化
 */
function initSmoothScroll() {
  const headerHeight = document.querySelector('.header').offsetHeight;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();

      const target = document.querySelector(href);
      if (target) {
        const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * ヘッダーのスクロール時の見た目変更
 */
function initHeaderScroll() {
  const header = document.querySelector('.header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
      header.style.boxShadow = 'none';
    }
  });
}
