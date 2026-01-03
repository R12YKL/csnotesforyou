document.addEventListener('DOMContentLoaded', ()=>{
  const postsEl = document.getElementById('posts');
  const solutionsEl = document.getElementById('solutions-container');
  const search = document.getElementById('search');
  const typeFilter = document.getElementById('typeFilter');
  const notesContainer = document.getElementById('notes-container');
  let posts = [];
  let solutions = [];
  let notes = [];

  function renderItems(list, container){
    if(!list || !list.length){ container.innerHTML = '<p>No items yet. Check back soon!</p>'; return }
    container.innerHTML = list.map(p => {
      const attachments = [];
      if(p.files && Array.isArray(p.files)){
        p.files.forEach(f=>{
          const lower = f.toLowerCase();
          if(/\.pdf$/.test(lower)){
            attachments.push(`<div><a href="${f}" target="_blank" rel="noopener">📄 ${f.split('/').pop()}</a></div>`);
          } else if(/\.(png|jpe?g|gif)$/.test(lower)){
            attachments.push(`<div><a href="${f}" target="_blank" rel="noopener"><img src="${f}" alt="${p.title}" style="max-width:120px;max-height:90px;border-radius:4px"/></a></div>`);
          } else {
            attachments.push(`<div><a href="${f}" target="_blank" rel="noopener">${f.split('/').pop()}</a></div>`);
          }
        });
      } else if(p.file){
        attachments.push(`<div><a href="${p.file}" target="_blank" rel="noopener">📄 ${p.file.split('/').pop()}</a></div>`);
      }
      return `
      <article class="card">
        <h3><a href="${(p.files && p.files[0]) || p.file}" target="_blank" rel="noopener">${p.title}</a></h3>
        <p class="meta">${p.type} • ${p.date}</p>
        <p>${p.excerpt}</p>
        <div class="attachments">${attachments.join('')}</div>
      </article>
    `}).join('')
  }

  function renderNotes(data){
    if(!data || !data.sections){ notesContainer.innerHTML = '<p>Unable to load notes.</p>'; return }
    notesContainer.innerHTML = data.sections.map(section => {
      const notesHtml = section.notes.map(note => {
        const fileLink = note.file ? `<div><a href="${note.file}" target="_blank" rel="noopener">📊 View Presentation</a></div>` : '';
        return `
        <div class="note-item">
          <h4>${note.title}</h4>
          <p>${note.content}</p>
          ${fileLink}
        </div>
      `}).join('');
      return `
      <div class="notes-section">
        <h3>${section.title}</h3>
        <div class="notes-grid">
          ${notesHtml}
        </div>
      </div>
    `}).join('')
  }

  function applyFilters(){
    const q = search.value.trim().toLowerCase();
    const type = typeFilter.value;
    const filtered = posts.filter(p => {
      const matchesType = (type === 'all' || p.type === type);
      const matchesQuery = !q || [p.title, p.excerpt].join(' ').toLowerCase().includes(q);
      return matchesType && matchesQuery;
    });
    renderItems(filtered, postsEl);
  }

  async function loadPosts(){
    try {
      const res = await fetch('/api/posts');
      if(!res.ok) throw new Error('api down');
      const allPosts = await res.json();
      posts = allPosts.filter(p => p.type === 'paper');
      solutions = allPosts.filter(p => p.type === 'solution');
    } catch (e) {
      try {
        const res2 = await fetch('data/posts.clean.json');
        const allPosts = await res2.json();
        posts = allPosts.filter(p => p.type === 'paper');
        solutions = allPosts.filter(p => p.type === 'solution');
      } catch (err) {
        postsEl.innerHTML = '<p>Unable to load posts.</p>';
        return;
      }
    }
    renderItems(posts, postsEl);
    renderItems(solutions, solutionsEl);
  }

  async function loadNotes(){
    try {
      const res = await fetch('data/notes.json');
      if(!res.ok) throw new Error('unable to load notes');
      notes = await res.json();
      renderNotes(notes);
    } catch (e) {
      notesContainer.innerHTML = '<p>Unable to load notes.</p>';
    }
  }

  loadPosts();
  loadNotes();
  search.addEventListener('input', applyFilters);
  typeFilter.addEventListener('change', applyFilters);
});

