(() => {
  'use strict';
  const search = document.querySelector('#post-search');
  if (search) {
    const rows = [...document.querySelectorAll('.archive-row')];
    const buttons = [...document.querySelectorAll('[data-filter]')];
    let category = 'all';
    const filter = () => {
      const query = search.value.trim().toLocaleLowerCase();
      let count = 0;
      rows.forEach(row => {
        const match = (category === 'all' || row.dataset.category === category) && row.dataset.search.toLocaleLowerCase().includes(query);
        row.hidden = !match;
        if (match) count++;
      });
      document.querySelectorAll('.archive-year').forEach(year => { year.hidden = ![...year.querySelectorAll('.archive-row')].some(row => !row.hidden); });
      document.querySelector('#search-count').textContent = `共 ${count} 篇笔记${query ? ` · 搜索「${search.value.trim()}」` : ''}`;
      document.querySelector('#search-empty').hidden = count !== 0;
    };
    search.addEventListener('input', filter);
    buttons.forEach(button => button.addEventListener('click', () => {
      category = button.dataset.filter;
      buttons.forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
      filter();
    }));
  }
  const content = document.querySelector('#post-content');
  if (!content) return;
  const characters = content.textContent.replace(/\s/g, '').length;
  document.querySelector('#reading-time').textContent = `约 ${Math.max(1, Math.ceil(characters / 400))} 分钟阅读`;
  const headings = [...content.querySelectorAll('h2, h3')];
  const toc = document.querySelector('#toc');
  if (headings.length) {
    document.querySelector('#toc-panel').hidden = false;
    headings.forEach((heading, index) => {
      if (!heading.id) heading.id = `section-${index + 1}`;
      const link = document.createElement('a');
      link.href = `#${encodeURIComponent(heading.id)}`;
      link.textContent = heading.textContent;
      if (heading.tagName === 'H3') link.className = 'sub';
      toc.append(link);
    });
  }
  const tocLinks = [...toc.querySelectorAll('a')];
  const progress = document.querySelector('#reading-progress');
  let scheduled = false;
  const update = () => {
    const start = window.scrollY + content.getBoundingClientRect().top;
    const distance = Math.max(1, content.offsetHeight - window.innerHeight / 2);
    progress.style.width = `${Math.min(100, Math.max(0, (window.scrollY - start + 100) / distance * 100))}%`;
    let active = -1;
    headings.forEach((heading, i) => { if (heading.getBoundingClientRect().top <= 150) active = i; });
    tocLinks.forEach((link, i) => { link.classList.toggle('active', i === active); if (i === active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
    scheduled = false;
  };
  const schedule = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  update();
  content.querySelectorAll('table').forEach(table => {
    const wrapper = document.createElement('div'); wrapper.className = 'table-scroll'; wrapper.tabIndex = 0; wrapper.setAttribute('role', 'region'); wrapper.setAttribute('aria-label', '表格，可横向滚动'); table.before(wrapper); wrapper.append(table);
  });
  // Clipboard controls are offered only when the browser supports them.
  if (navigator.clipboard && window.isSecureContext) {
    const share = document.querySelector('#copy-link'); share.hidden = false;
    share.addEventListener('click', async () => {
      const status = document.querySelector('#copy-status');
      try { await navigator.clipboard.writeText(location.href.split('#')[0]); status.textContent = '链接已复制'; }
      catch { status.textContent = '复制失败，请从浏览器地址栏复制链接。'; }
    });
    content.querySelectorAll('pre').forEach(pre => {
      const code = pre.querySelector('code');
      if (!code) return;
      const button = document.createElement('button'); button.type = 'button'; button.className = 'copy-code'; button.textContent = '复制代码';
      pre.prepend(button);
      button.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(code.textContent); button.textContent = '已复制'; }
        catch { button.textContent = '请手动复制'; }
        setTimeout(() => { button.textContent = '复制代码'; }, 2000);
      });
    });
  }
})();
