/* Application statique : aucune donnée personnelle ne quitte le navigateur. */
(() => {
  'use strict';

  const STORAGE_KEY = 'suites-pas-a-pas.v1';
  const course = window.SUITES_COURSE;
  const app = document.getElementById('app');
  if (!course?.modules?.length) {
    app.innerHTML = '<main><h1>Le cours n’a pas pu être chargé.</h1><p>Conservez index.html, styles.css, lessons.js et app.js dans le même dossier, puis rechargez la page.</p></main>';
    return;
  }
  const modules = course.modules;
  const lessons = modules.flatMap(module => module.lessons.map(lesson => ({ ...lesson, module })));
  const lessonIds = new Set(lessons.map(lesson => lesson.id));
  const colors = ['sage', 'lavender', 'peach', 'sky'];
  const icons = {
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>',
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="10" width="12" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
    book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6v15m0-15C9 3 5 3 2 4v15c4-1 7-1 10 2 3-3 6-3 10-2V4c-3-1-7-1-10 2Z"/></svg>'
  };
  let storageError = false;
  let state = loadState();
  let view = 'welcome';
  let currentIndex = 0;
  let solved = false;
  let selectedAnswer = '';
  let feedback = null;
  let menuOpen = false;
  let modal = null;
  let returnView = 'dashboard';
  const mobileQuery = window.matchMedia('(max-width: 1000px)');

  const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  const profile = () => state.profiles.find(item => item.id === state.activeProfileId);
  const initials = name => Array.from(name.trim())[0]?.toLocaleUpperCase('fr') || '?';
  const completed = person => person.progress.completed.length;
  const score = person => completed(person) * 10;
  const percent = person => Math.round(completed(person) / lessons.length * 100);
  const moduleCount = (person, module) => module.lessons.filter(lesson => person.progress.completed.includes(lesson.id)).length;
  const frontier = person => {
    const first = lessons.findIndex(lesson => !person.progress.completed.includes(lesson.id));
    return first === -1 ? lessons.length - 1 : first;
  };

  function loadState() {
    const fallback = { version: 1, activeProfileId: null, profiles: [] };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      if (parsed.version !== 1 || !Array.isArray(parsed.profiles)) throw new Error('Format non reconnu');
      const profiles = parsed.profiles.filter(person => typeof person.id === 'string' && typeof person.name === 'string' && person.name.trim()).map(person => {
        const progress = person.progress || {};
        // Seule une progression contiguë autorise l’accès à une nouvelle étape.
        const done = [];
        for (const lesson of lessons) {
          if (!Array.isArray(progress.completed) || !progress.completed.includes(lesson.id)) break;
          done.push(lesson.id);
        }
        return {
          id: person.id, name: person.name.slice(0, 32), color: colors.includes(person.color) ? person.color : 'sage',
          createdAt: person.createdAt || new Date().toISOString(),
          progress: {
            completed: done,
            attempts: progress.attempts && typeof progress.attempts === 'object' ? progress.attempts : {},
            history: Array.isArray(progress.history) ? progress.history.filter(item => item && lessonIds.has(item.lessonId) && typeof item.correct === 'boolean').slice(-500) : [],
            lastLessonId: lessonIds.has(progress.lastLessonId) ? progress.lastLessonId : lessons[0].id
          }
        };
      });
      return { version: 1, activeProfileId: profiles.some(person => person.id === parsed.activeProfileId) ? parsed.activeProfileId : null, profiles };
    } catch {
      storageError = true;
      return fallback;
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      storageError = false;
    } catch { storageError = true; }
  }

  function announce(message) {
    document.getElementById('announcer').textContent = message;
  }

  function brand() {
    return '<div class="brand"><span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M7 25V19H13V13H19V7H25"/></svg></span><div><span class="brand-name">suites<span class="brand-dot">.</span></span><span class="brand-caption">UN PAS APRÈS L’AUTRE</span></div></div>';
  }

  function progressBar(value, label) {
    return `<div class="progress-track" role="progressbar" aria-label="${escape(label)}" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100"><div class="progress-fill" style="width:${value}%"></div></div>`;
  }

  function storageNotice() {
    return storageError ? '<div class="storage-warning" role="alert">La sauvegarde locale est indisponible ou illisible. La progression reste en mémoire pour cette session. Exportez-la avant de fermer la page ; vérifiez que votre navigateur autorise le stockage local.</div>' : '';
  }

  function welcome() {
    const cards = state.profiles.map(person => `<button class="profile-card" data-action="select-profile" data-id="${escape(person.id)}" data-testid="profile-card"><span class="avatar ${person.color}" aria-hidden="true">${escape(initials(person.name))}</span><span class="profile-card-name">${escape(person.name)}</span><span class="profile-card-meta">${completed(person)} / ${lessons.length} étapes · ${score(person)} points</span><span class="profile-card-arrow" aria-hidden="true">↗</span></button>`).join('');
    return `<div class="welcome-page"><header class="welcome-header">${brand()}<span class="welcome-tag">MATHÉMATIQUES · TERMINALE</span></header><main id="main-content" class="welcome-layout" tabindex="-1"><section class="welcome-copy"><div class="eyebrow"><span class="status-dot"></span> LES SUITES, ENFIN CLAIRES</div><h1>Les grands progrès<br>commencent par<br><span class="highlight-text">un petit pas.</span></h1><p class="welcome-subtitle">Du premier terme à la convergence, avancez à votre rythme. Une idée, un exemple, un exercice. Et la confiance qui grandit.</p><div class="welcome-pills"><span>5 modules</span><span>25 étapes</span><span>100 % autonome</span></div><div class="welcome-art" aria-label="Une suite se construit terme après terme"><span class="art-axis"></span><span class="art-dot art-dot-1"><b>u₀</b><small>on découvre</small></span><span class="art-dot art-dot-2"><b>u₁</b><small>on comprend</small></span><span class="art-dot art-dot-3"><b>u₂</b><small>on s’entraîne</small></span><span class="art-dot art-dot-4"><b>u₃</b><small>on progresse</small></span><span class="art-equation">uₙ₊₁ = uₙ + un pas</span></div></section><section class="profile-panel" aria-labelledby="profile-title"><span class="section-label">VOTRE ESPACE D’APPRENTISSAGE</span><h2 id="profile-title">Qui apprend aujourd’hui ?</h2><p class="helper-text">À chacun son parcours. Retrouvez vos progrès à chaque visite sur cet appareil.</p>${cards ? `<div class="profile-grid">${cards}</div><div class="form-divider"><span>ou créer un profil</span></div>` : '<div class="empty-state">Tout commence ici. Créez votre premier profil.</div>'}<form id="create-profile-form" class="create-profile-form"><label class="field-label" for="profile-name">Prénom ou surnom</label><div class="input-row"><input class="text-input" id="profile-name" name="profileName" data-testid="profile-name" placeholder="Ex. Camille, Ma fille, Papa" maxlength="32" required autocomplete="off"><button class="button primary" data-testid="create-profile" type="submit">Créer mon profil ${icons.arrow}</button></div><p id="profile-error" class="error-message" role="alert"></p></form><p class="privacy-note"><span aria-hidden="true">⌁</span> Sans compte, sans publicité. Vos profils restent uniquement dans ce navigateur.</p><button class="text-button" data-action="guide">Comment ça marche ? ${icons.arrow}</button></section></main><footer class="welcome-footer"><span>Un peu chaque jour, beaucoup à l’arrivée.</span><span>Programme de Terminale · Spécialité maths</span></footer></div>`;
  }

  function sidebar(person) {
    return `<aside class="sidebar" id="navigation" aria-label="Navigation du parcours" ${menuOpen && mobileQuery.matches ? 'role="dialog" aria-modal="true"' : ''}>${brand()}<button class="icon-button mobile-sidebar-close" data-action="close-menu" aria-label="Fermer le menu"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg></button><button class="profile-switch" data-action="switch-profile" data-testid="switch-profile"><span class="avatar ${person.color}" aria-hidden="true">${escape(initials(person.name))}</span><span><b>${escape(person.name)}</b><small>Changer de profil</small></span><span aria-hidden="true">⌄</span></button><button class="module-link ${view === 'dashboard' ? 'active' : ''}" data-action="dashboard">${icons.book}<span class="module-title">Mon parcours</span></button><div class="nav-title">LES 5 MODULES</div><nav class="module-nav">${modules.map(module => {
      const start = lessons.findIndex(lesson => lesson.module.id === module.id);
      const locked = start > frontier(person);
      const count = moduleCount(person, module);
      return `<button class="module-link ${view === 'lesson' && lessons[currentIndex].module.id === module.id ? 'active' : ''} ${locked ? 'locked' : ''} ${count === module.lessons.length ? 'complete' : ''}" data-action="module" data-id="${module.id}" ${locked ? 'disabled' : ''} ${view === 'lesson' && lessons[currentIndex].module.id === module.id ? 'aria-current="step"' : ''}><span class="module-number">${String(module.number).padStart(2, '0')}</span><span class="module-copy"><span class="module-title">${escape(module.title)}</span><span class="module-meta">${locked ? 'À débloquer' : `${count} / ${module.lessons.length} étapes`}</span></span><span class="module-status">${locked ? icons.lock : count === module.lessons.length ? icons.check : ''}</span></button>`;
    }).join('')}</nav><div class="sidebar-footer"><div class="sidebar-progress"><span>Votre progression</span><b>${percent(person)} %</b></div>${progressBar(percent(person), 'Progression totale')}<button class="text-button" data-action="history">Voir mon historique</button><button class="text-button" data-action="guide">Guide & partage ${icons.arrow}</button><span class="local-note">Enregistré sur cet appareil</span></div></aside>`;
  }

  function shell(content) {
    const person = profile();
    if (!person) return welcome();
    let breadcrumb = 'Mon parcours';
    if (view === 'lesson') breadcrumb = lessons[currentIndex].module.title;
    if (view === 'history') breadcrumb = 'Mon historique';
    if (view === 'guide') breadcrumb = 'Guide & partage';
    return `<div class="shell ${menuOpen ? 'menu-open' : ''}">${sidebar(person)}${menuOpen && mobileQuery.matches ? '<div class="menu-backdrop" data-action="close-menu" aria-hidden="true"></div>' : ''}<div class="workspace" ${menuOpen && mobileQuery.matches ? 'inert' : ''}><header class="topbar"><div class="topbar-start"><button class="icon-button mobile-menu-toggle" data-action="menu" aria-label="${menuOpen ? 'Fermer' : 'Ouvrir'} le menu" aria-expanded="${menuOpen}" aria-controls="navigation">${icons.menu}</button><button class="back-button" data-action="back" aria-label="Retour en arrière">${icons.back}<span>Retour</span></button><span class="breadcrumb">${escape(breadcrumb)}</span></div><div class="topbar-actions"><span class="level-pill">TERMINALE</span><button class="icon-button help-button" data-action="guide" aria-label="Ouvrir le guide">?</button></div></header><main id="main-content" class="page-content" tabindex="-1">${content}</main></div></div>`;
  }

  function dashboard() {
    const person = profile();
    const allDone = completed(person) === lessons.length;
    const next = lessons[frontier(person)];
    const attempts = Object.values(person.progress.attempts).reduce((sum, item) => sum + (Number(item.total) || 0), 0);
    const successes = Object.values(person.progress.attempts).reduce((sum, item) => sum + (Number(item.correct) || 0), 0);
    return `<header class="dashboard-heading"><div><div class="eyebrow">UN NOUVEAU PAS VERS LA RÉUSSITE</div><h1>Bonjour, ${escape(person.name)}<span class="greeting-dot">.</span></h1><p class="lead">Les suites se comprennent une étape à la fois. Prêt à avancer ?</p></div><div class="date-note">À votre rythme.<br><b>Toujours en progrès.</b></div></header><section class="overview-grid" aria-label="Vos statistiques"><article class="stat-card"><span class="stat-icon sage" aria-hidden="true">${icons.arrow}</span><div><span class="stat-label">Votre progression</span><span class="stat-value">${percent(person)}<small> %</small></span><span class="stat-detail">${completed(person)} étapes sur ${lessons.length}</span></div></article><article class="stat-card"><span class="stat-icon lavender" aria-hidden="true">✧</span><div><span class="stat-label">Points gagnés</span><span class="stat-value">${score(person)}<small> pts</small></span><span class="stat-detail">10 points par étape validée</span></div></article><article class="stat-card"><span class="stat-icon peach" aria-hidden="true">✓</span><div><span class="stat-label">Réponses justes</span><span class="stat-value">${attempts ? Math.round(successes / attempts * 100) : '—'}<small>${attempts ? ' %' : ''}</small></span><span class="stat-detail">${attempts ? `${successes} sur ${attempts} tentatives` : 'Votre premier exercice vous attend'}</span></div></article></section><div class="dashboard-grid"><section class="journey-panel"><div class="panel-heading"><div><span class="section-label">VOTRE FEUILLE DE ROUTE</span><h2>Un parcours, cinq déclics.</h2></div><span class="count-pill">5 modules</span></div><div class="module-cards">${modules.map(module => {
      const start = lessons.findIndex(lesson => lesson.module.id === module.id);
      const count = moduleCount(person, module);
      const locked = start > frontier(person);
      const done = count === module.lessons.length;
      return `<button class="module-card ${locked ? 'locked' : done ? 'complete' : 'current'}" data-testid="module-card" data-action="module" data-id="${module.id}" ${locked ? 'disabled' : ''}><span class="module-card-icon tone-${module.number}" aria-hidden="true">${String(module.number).padStart(2, '0')}</span><span class="module-card-info"><span class="module-card-title">${escape(module.title)}</span><span class="module-card-summary">${escape(module.subtitle)}</span><span class="module-card-progress">${done ? 'Module validé' : locked ? 'Validez le module précédent' : `${count} / ${module.lessons.length} étapes validées`}</span></span><span class="module-card-action">${locked ? icons.lock : done ? icons.check : icons.arrow}</span></button>`;
    }).join('')}</div></section><aside class="dashboard-aside"><section class="continue-card"><span class="continue-kicker">${allDone ? 'PARCOURS TERMINÉ' : completed(person) ? 'ON GARDE LE RYTHME' : 'VOTRE PREMIER PETIT PAS'}</span><div class="orbital-art" aria-hidden="true"><span class="orbit orbit-one"></span><span class="orbit orbit-two"></span><span class="orbit-center">uₙ</span><i class="orbit-dot"></i></div><h2 class="continue-title">${allDone ? '25 pas. Un grand progrès.' : completed(person) ? 'La suite vous attend.' : 'Tout commence par un terme.'}</h2><p class="continue-description">${allDone ? 'Bravo ! Vous avez validé toutes les étapes. Revenez sur les notions pour consolider vos acquis.' : escape(next.title)}</p><span class="continue-meta">${allDone ? '5 badges remportés · 250 points' : `Module ${next.module.number} · Étape ${lessons.indexOf(next) + 1} sur ${lessons.length}`}</span><button class="button primary" data-action="${allDone ? 'review' : 'continue'}" data-testid="start-course">${allDone ? 'Réviser le parcours' : completed(person) ? 'Continuer mon parcours' : 'Commencer le parcours'} ${icons.arrow}</button></section><section class="badges-panel"><div class="panel-heading"><h3>Les petits succès</h3><span aria-hidden="true">✧</span></div><div class="badge-list">${modules.map(module => `<span class="badge ${moduleCount(person, module) === module.lessons.length ? 'earned' : ''}" title="Valider le module ${module.number}" aria-label="Badge ${module.number} : ${moduleCount(person, module) === module.lessons.length ? 'obtenu' : 'à obtenir'}">${moduleCount(person, module) === module.lessons.length ? '✦' : '◇'}<small>${String(module.number).padStart(2, '0')}</small></span>`).join('')}</div><p class="helper-text">Un module terminé, un badge gagné.</p></section><div class="gentle-note"><span aria-hidden="true">✳</span><p>Se tromper fait partie du chemin. Chaque erreur vous donne un indice pour comprendre.</p></div></aside></div>`;
  }

  function chart(visual) {
    if (!visual?.values?.length) return '';
    const values = visual.values.filter(Number.isFinite);
    if (!values.length) return '';
    const comparison = visual.lower?.length === values.length && visual.upper?.length === values.length;
    const bounds = comparison ? [...visual.lower, ...visual.upper] : [];
    if (Number.isFinite(visual.bound)) bounds.push(visual.bound);
    const min = Math.min(...values, ...bounds, 0);
    const max = Math.max(...values, ...bounds, 1);
    const range = max - min || 1;
    const y = value => 144 - (value - min) / range * 115;
    const x = index => 36 + index * (328 / Math.max(values.length - 1, 1));
    const points = values.map((value, index) => `${x(index)},${y(value)}`).join(' ');
    const zeroY = y(0);
    const format = value => value.toLocaleString('fr-FR', { maximumFractionDigits: 2 });
    const boundLine = Number.isFinite(visual.bound) ? `<line x1="20" y1="${y(visual.bound)}" x2="380" y2="${y(visual.bound)}" class="chart-bound"/><text x="378" y="${Math.max(y(visual.bound) - 7, 12)}" text-anchor="end" class="chart-label">${escape(format(visual.bound))}</text>` : '';
    const envelope = comparison ? `<polygon points="${visual.upper.map((value, index) => `${x(index)},${y(value)}`).join(' ')} ${visual.lower.map((value, index) => `${x(index)},${y(value)}`).reverse().join(' ')}" class="chart-envelope"/><polyline points="${visual.lower.map((value, index) => `${x(index)},${y(value)}`).join(' ')}" class="chart-boundary"/><polyline points="${visual.upper.map((value, index) => `${x(index)},${y(value)}`).join(' ')}" class="chart-boundary"/>` : '';
    const segments = visual.type === 'steps' ? values.map((value, index) => index ? `<path d="M${x(index - 1)} ${y(values[index - 1])}H${x(index)}V${y(value)}" class="chart-line"/>` : '').join('') : `<polyline points="${points}" class="chart-line"/>`;
    return `<figure class="visual-card"><div class="sequence-chart"><svg viewBox="0 0 400 190" role="img" aria-label="${escape(visual.caption)}"><line x1="20" y1="${zeroY}" x2="380" y2="${zeroY}" class="chart-axis"/>${envelope}${boundLine}${visual.type === 'bars' ? values.map((value, index) => `<rect x="${x(index) - 11}" y="${Math.min(y(value), zeroY)}" width="22" height="${Math.max(Math.abs(zeroY - y(value)), 2)}" rx="5" class="chart-bar"/>`).join('') : segments}${values.map((value, index) => `${visual.type !== 'bars' ? `<circle cx="${x(index)}" cy="${y(value)}" r="5" class="chart-dot"/>` : ''}<text x="${x(index)}" y="${Math.max(y(value) - 12, 14)}" text-anchor="middle" class="chart-value">${escape(format(value))}</text><text x="${x(index)}" y="177" text-anchor="middle" class="chart-label">${escape(visual.labels?.[index] ?? `u${index}`)}</text>`).join('')}</svg></div><figcaption class="chart-caption">${escape(visual.caption)}${values.some(value => Math.abs(value * 100 - Math.round(value * 100)) > 1e-6) ? ' Valeurs affichées arrondies au centième.' : ''}</figcaption></figure>`;
  }

  function lessonPage() {
    const person = profile();
    const lesson = lessons[currentIndex];
    const exercise = lesson.exercise;
    const ordinal = lesson.module.lessons.findIndex(item => item.id === lesson.id) + 1;
    return `<div class="lesson-topline"><span class="eyebrow">MODULE ${String(lesson.module.number).padStart(2, '0')} · ${escape(lesson.module.title)}</span><span class="lesson-count">Étape ${currentIndex + 1} / ${lessons.length}</span></div><div class="lesson-progress">${progressBar(percent(person), 'Étapes validées du parcours')}</div><div class="lesson-layout"><article class="lesson-main"><header><span class="section-label">${escape(lesson.eyebrow)}</span><h1 class="lesson-title">${escape(lesson.title)}</h1><p class="lesson-objective">${escape(lesson.objective)}</p></header><section class="lesson-card" aria-label="Micro-leçon"><span class="section-label">L’IDÉE À RETENIR</span><div class="lesson-copy">${lesson.paragraphs.map(text => `<p>${escape(text)}</p>`).join('')}</div><div class="formula-box">${escape(lesson.formula)}</div><div class="example-box"><span class="example-title">${escape(lesson.example.title)}</span><p>${escape(lesson.example.text)}</p></div></section>${chart(lesson.visual)}<section class="exercise-card" aria-labelledby="exercise-title"><div class="exercise-heading"><h2 id="exercise-title">À vous de jouer</h2><span class="exercise-type">${exercise.type === 'choice' ? 'Choix unique' : 'Calcul numérique'} · Validation obligatoire</span></div><p class="exercise-prompt">${escape(exercise.prompt)}</p><form id="exercise-form">${exercise.type === 'choice' ? `<fieldset class="choice-list"><legend class="sr-only">Choisissez une réponse</legend>${exercise.options.map((option, index) => `<label class="choice-option ${String(index) === selectedAnswer ? 'selected' : ''} ${feedback && String(index) === selectedAnswer ? feedback.correct ? 'correct' : 'incorrect' : ''}"><input type="radio" name="answer" value="${index}" data-testid="choice-${index}" ${String(index) === selectedAnswer ? 'checked' : ''} ${solved ? 'disabled' : ''}><span class="choice-marker" aria-hidden="true">${String.fromCharCode(65 + index)}</span><span>${escape(option)}</span></label>`).join('')}</fieldset>` : `<div class="number-answer"><label class="field-label" for="answer-number">Votre réponse</label><div class="input-row"><input class="answer-input" id="answer-number" data-testid="answer-number" name="answer" type="text" inputmode="decimal" autocomplete="off" placeholder="Entrez votre résultat" value="${escape(selectedAnswer)}" aria-describedby="number-help" ${solved ? 'disabled' : ''}>${exercise.unit ? `<span class="answer-unit">${escape(exercise.unit)}</span>` : ''}</div><p class="helper-text" id="number-help">Virgule, point ou fraction acceptés (ex. 0,5 ou 1/2).</p></div>`}<div class="exercise-actions"><button class="button ${solved ? 'secondary' : 'primary'}" type="submit" data-testid="check-answer" ${solved ? 'disabled' : ''}>${solved ? `Étape validée ${icons.check}` : `Vérifier ma réponse ${icons.arrow}`}</button><span class="helper-text">${solved ? 'Bien joué, vous pouvez avancer.' : 'Vous pouvez réessayer autant que nécessaire.'}</span></div></form>${feedbackHTML()}</section><nav class="lesson-navigation" aria-label="Navigation des étapes"><button class="button ghost" data-action="previous-lesson" data-testid="previous-lesson">${icons.back} ${currentIndex ? 'Étape précédente' : 'Mon parcours'}</button><button class="button primary" data-action="next-lesson" data-testid="next-lesson" ${solved ? '' : 'disabled'}>${currentIndex === lessons.length - 1 ? 'Terminer le parcours' : 'Étape suivante'} ${icons.arrow}</button></nav>${!solved ? '<p class="gatekeeper-note">Validez cet exercice pour débloquer la suite.</p>' : ''}</article><aside class="lesson-aside"><section class="lesson-outline"><span class="section-label">DANS CE MODULE</span><h3>${escape(lesson.module.title)}</h3>${lesson.module.lessons.map((item, index) => {
      const itemIndex = lessons.findIndex(entry => entry.id === item.id);
      const locked = itemIndex > frontier(person) || (itemIndex > currentIndex && !solved);
      const done = person.progress.completed.includes(item.id);
      return `<button class="module-link ${item.id === lesson.id ? 'active' : ''} ${locked ? 'locked' : ''}" data-action="lesson" data-id="${item.id}" ${locked ? 'disabled' : ''} ${item.id === lesson.id ? 'aria-current="step"' : ''}><span class="module-number">${done ? '✓' : index + 1}</span><span class="module-title">${escape(item.title)}</span>${locked ? icons.lock : ''}</button>`;
    }).join('')}<span class="helper-text">Étape ${ordinal} sur ${lesson.module.lessons.length}</span></section><div class="gentle-note"><span aria-hidden="true">✳</span><p>Un doute ? Relisez l’exemple et prenez votre temps. Les indices sont là pour vous aider.</p></div></aside></div>`;
  }

  function feedbackHTML() {
    if (!feedback) return '';
    return `<div class="feedback ${feedback.correct ? 'success' : 'error'}" data-testid="feedback" role="status" aria-live="polite"><span class="feedback-title">${feedback.correct ? 'Bien joué ! Vous avez compris.' : feedback.empty ? 'Encore un petit geste…' : 'Pas tout à fait. On reprend ensemble.'}</span><p>${escape(feedback.message)}</p>${feedback.correct && feedback.newlyCompleted ? '<small>+10 points · Une étape de plus !</small>' : ''}</div>`;
  }

  function historyPage() {
    const person = profile();
    return `<header class="dashboard-heading"><div><span class="eyebrow">CHAQUE ESSAI COMPTE</span><h1>Votre chemin parcouru.</h1><p class="lead">${completed(person)} étapes validées, ${score(person)} points gagnés. Continuez à votre rythme.</p></div></header><section class="lesson-card"><div class="panel-heading"><h2>Vos dernières tentatives</h2><button class="button secondary small" data-action="export">Exporter ma progression</button></div>${person.progress.history.length ? `<ol class="history-list">${person.progress.history.slice().reverse().map(entry => {
      const lesson = lessons.find(item => item.id === entry.lessonId);
      const date = new Date(entry.at);
      return `<li class="history-item"><span class="history-dot ${entry.correct ? 'success' : 'retry'}" aria-hidden="true">${entry.correct ? '✓' : '↻'}</span><div><b>${escape(lesson.title)}</b><p>${entry.correct ? 'Bonne réponse' : 'Nouvel essai, nouvel apprentissage'} · ${escape(Number.isNaN(date.getTime()) ? '' : date.toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }))}</p></div></li>`;
    }).join('')}</ol><p class="helper-text">Les 500 dernières tentatives sont conservées ; les totaux et les étapes validées restent sauvegardés.</p>` : '<p class="empty-state">Votre histoire commence avec le premier exercice.</p>'}</section><div class="profile-management"><button class="text-button danger-text" data-action="delete-profile">Supprimer ce profil et sa progression</button></div>`;
  }

  function guidePage() {
    return `<header class="dashboard-heading"><div><span class="eyebrow">LE PETIT GUIDE</span><h1>Apprendre. Enregistrer. Partager.</h1><p class="lead">Tout ce qu’il faut pour avancer en toute simplicité.</p></div></header><section class="guide-content lesson-card"><details open><summary>Comment fonctionne le parcours ?</summary><p>Choisissez un profil, puis commencez la première étape. Chaque étape comprend une micro-leçon, un exemple et un exercice obligatoire. Une erreur affiche un indice : corrigez votre réponse avant de poursuivre. Les étapes et modules se débloquent dans l’ordre.</p><p>Chaque nouvelle étape validée rapporte 10 points. Un module terminé donne un badge. Les erreurs ne retirent aucun point. Le taux de réussite compte toutes les tentatives envoyées ; une réponse vide ou invalide ne compte pas.</p><p>Le bouton Retour reste disponible pour relire la leçon précédente. Vous pouvez réviser les étapes déjà validées. Ce parcours couvre les notions centrales des suites en Terminale spécialité ; complétez-le avec les exercices et démonstrations de votre cours.</p></details><details><summary>Où sont les profils et la progression ?</summary><p>Ils sont enregistrés automatiquement dans le localStorage de ce navigateur, sur cet appareil, sans compte ni base de données. Aucun résultat n’est transmis à un serveur.</p><p>Un téléphone et un PC ont des suivis indépendants, même avec le même prénom. Les profils ne sont pas protégés par un mot de passe. Le mode privé ou l’effacement des données du navigateur peut supprimer la progression. Le passage d’un fichier local à un lien Internet crée aussi un autre espace de sauvegarde.</p><p>Depuis « Mon historique », exportez une copie JSON de votre suivi pour l’archiver. Cette version propose l’export, sans fonction de réimportation ou de synchronisation.</p></details><details><summary>Utiliser l’application sur un PC</summary><ol><li>Placez index.html, styles.css, lessons.js et app.js dans le même dossier.</li><li>Ouvrez index.html par un double-clic dans un navigateur récent.</li><li>Créez un profil et validez un premier exercice. Rechargez la page pour retrouver vos progrès.</li></ol><p>Si votre navigateur limite le stockage des fichiers locaux, servez le dossier avec Python : <code>python3 -m http.server 8000</code>, puis ouvrez l’adresse locale indiquée dans le terminal. Le contenu ne nécessite aucune ressource externe.</p></details><details><summary>Partager avec Netlify Drop</summary><ol><li>Décompressez l’archive de l’application dans un dossier. index.html doit être directement à la racine de ce dossier.</li><li>Ouvrez <a href="https://app.netlify.com/drop" target="_blank" rel="noopener noreferrer">Netlify Drop</a> et connectez-vous ou créez un compte gratuit si le service le demande.</li><li>Glissez le dossier dans la zone de dépôt. Netlify fournit une adresse HTTPS publique.</li><li>Ouvrez cette adresse, vérifiez un exercice, puis envoyez le lien à votre enfant.</li></ol><p>L’hébergement rend les cours publics, mais les profils restent sur chaque appareil. Il faut une connexion pour charger l’application hébergée ; une fois chargée, les exercices fonctionnent sans accès réseau. Aucun mode hors connexion après fermeture de l’onglet n’est garanti pour la version hébergée.</p></details></section><button class="button secondary" data-action="back">${icons.back} Retour à l’application</button>`;
  }

  function completionPage() {
    return `<section class="completion-card"><span class="completion-symbol" aria-hidden="true">✦</span><div class="eyebrow">5 MODULES · 25 ÉTAPES · 250 POINTS</div><h1>Une belle suite de réussites.</h1><p class="lead">Bravo, ${escape(profile().name)} ! Des premiers termes aux limites, vous avez validé chaque étape du parcours.</p><div class="badge-list">${modules.map(module => `<span class="badge earned" aria-label="Module ${module.number} validé">✦<small>${String(module.number).padStart(2, '0')}</small></span>`).join('')}</div><p>Gardez le rythme : reprenez les notions qui vous ont demandé plusieurs essais et entraînez-vous sur les exercices de votre cours.</p><div class="completion-actions"><button class="button primary" data-action="dashboard">Mon parcours ${icons.arrow}</button><button class="button secondary" data-action="history">Voir mon historique</button></div></section>`;
  }

  function modalHTML() {
    if (!modal) return '';
    return `<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><h2 id="modal-title">Supprimer ${escape(profile().name)} ?</h2><p>Ce profil, ses points et son historique seront supprimés de ce navigateur. Cette action est définitive. Vous pouvez exporter votre progression avant de continuer.</p><div class="modal-actions"><button class="button secondary" data-action="cancel-modal" autofocus>Annuler</button><button class="button danger" data-action="confirm-delete">Supprimer le profil</button></div></section></div>`;
  }

  function render(focus = false) {
    if (view !== 'welcome' && view !== 'guide' && !profile()) view = 'welcome';
    let content;
    if (view === 'welcome') content = welcome();
    else if (view === 'guide') content = profile() ? shell(guidePage()) : `<div class="welcome-page"><header class="welcome-header">${brand()}</header><main id="main-content" class="page-content guide-standalone" tabindex="-1">${guidePage()}</main></div>`;
    else content = shell(view === 'dashboard' ? dashboard() : view === 'history' ? historyPage() : view === 'complete' ? completionPage() : lessonPage());
    app.innerHTML = storageNotice() + content + modalHTML();
    document.title = `${view === 'lesson' ? lessons[currentIndex].title : view === 'welcome' ? 'Apprendre les suites' : 'Votre parcours'} · Suites pas à pas`;
    if (view === 'lesson' && solved) {
      document.getElementById('exercise-form')?.insertAdjacentHTML('afterend', '<button class="text-button retry-lesson" data-action="retry-lesson">Refaire cet exercice</button>');
    }
    if (modal) app.querySelector('[autofocus]')?.focus();
    else if (menuOpen && mobileQuery.matches) app.querySelector('.mobile-sidebar-close')?.focus();
    else if (focus) {
      document.getElementById('main-content')?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }

  function goLesson(index) {
    const person = profile();
    if (!person || index < 0 || index >= lessons.length || index > frontier(person)) return;
    if (view === 'lesson' && index > currentIndex && !solved) {
      announce('Validez la réponse de cette étape avant de poursuivre.');
      return;
    }
    currentIndex = index;
    solved = person.progress.completed.includes(lessons[index].id);
    selectedAnswer = '';
    feedback = solved ? { correct: true, message: 'Cette étape est déjà validée. Relisez-la librement, ou répondez de nouveau pour vous entraîner.' } : null;
    // Les exercices validés peuvent être refaits via le bouton de révision dédié.
    person.progress.lastLessonId = lessons[index].id;
    view = 'lesson';
    menuOpen = false;
    save();
    render(true);
  }

  function parseNumber(raw) {
    const text = raw.trim().replace(/\s+/g, '').replace(/,/g, '.').replace(/−/g, '-');
    const atom = '[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:e[+-]?\\d+)?';
    if (new RegExp(`^${atom}$`, 'i').test(text)) return Number(text);
    if (new RegExp(`^${atom}/${atom}$`, 'i').test(text)) {
      const [a, b] = text.split('/').map(Number);
      return b === 0 ? NaN : a / b;
    }
    return NaN;
  }

  function checkAnswer(form) {
    if (view !== 'lesson' || solved) return;
    const lesson = lessons[currentIndex];
    const exercise = lesson.exercise;
    const data = new FormData(form);
    selectedAnswer = String(data.get('answer') ?? '').trim();
    const value = exercise.type === 'number' ? parseNumber(selectedAnswer) : Number(selectedAnswer);
    if (!selectedAnswer || !Number.isFinite(value)) {
      feedback = { correct: false, empty: true, message: exercise.type === 'number' ? 'Entrez un nombre ou une fraction valide, par exemple 0,5 ou 1/2.' : 'Choisissez une réponse avant de vérifier.' };
      render();
      document.querySelector('[name="answer"]')?.focus();
      return;
    }
    const correct = exercise.type === 'choice' ? value === exercise.answer : Math.abs(value - exercise.answer) <= (exercise.tolerance ?? 1e-8);
    const person = profile();
    const stats = person.progress.attempts[lesson.id] || { total: 0, correct: 0 };
    stats.total = (Number(stats.total) || 0) + 1;
    stats.correct = (Number(stats.correct) || 0) + Number(correct);
    person.progress.attempts[lesson.id] = stats;
    person.progress.history.push({ lessonId: lesson.id, correct, at: new Date().toISOString() });
    person.progress.history = person.progress.history.slice(-500);
    const newlyCompleted = correct && !person.progress.completed.includes(lesson.id);
    if (newlyCompleted && currentIndex === frontier(person)) person.progress.completed.push(lesson.id);
    solved = correct;
    feedback = { correct, newlyCompleted, message: correct ? exercise.explanation : `Indice : ${exercise.hint}` };
    save();
    render();
    announce(correct ? 'Bonne réponse. Étape suivante débloquée.' : `Réessayez. ${exercise.hint}`);
    if (correct) document.querySelector('[data-action="next-lesson"]')?.focus({ preventScroll: true });
    else document.querySelector('.feedback')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function createProfile(form) {
    const name = String(new FormData(form).get('profileName') || '').trim().replace(/\s+/g, ' ');
    const error = document.getElementById('profile-error');
    if (!name || name.length > 32) { error.textContent = 'Choisissez un nom entre 1 et 32 caractères.'; return; }
    if (state.profiles.some(person => person.name.toLocaleLowerCase('fr') === name.toLocaleLowerCase('fr'))) {
      error.textContent = 'Ce profil existe déjà. Choisissez-le ci-dessus ou utilisez un autre nom.';
      return;
    }
    const id = typeof globalThis.crypto?.randomUUID === 'function' ? crypto.randomUUID() : `p-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const person = { id, name, color: colors[state.profiles.length % colors.length], createdAt: new Date().toISOString(), progress: { completed: [], attempts: {}, history: [], lastLessonId: lessons[0].id } };
    state.profiles.push(person);
    state.activeProfileId = id;
    save();
    view = 'dashboard';
    render(true);
  }

  function exportProgress() {
    const person = profile();
    const contents = { application: 'Suites · Pas à pas', version: 1, exportedAt: new Date().toISOString(), profile: person };
    const url = URL.createObjectURL(new Blob([JSON.stringify(contents, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `suites-progression-${person.name.replace(/[^a-z0-9à-ÿ_-]/gi, '_')}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce('Une copie de votre progression a été téléchargée.');
  }

  app.addEventListener('submit', event => {
    event.preventDefault();
    if (event.target.id === 'create-profile-form') createProfile(event.target);
    if (event.target.id === 'exercise-form') checkAnswer(event.target);
  });

  app.addEventListener('change', event => {
    if (event.target.matches('input[type="radio"][name="answer"]')) {
      selectedAnswer = event.target.value;
      for (const label of app.querySelectorAll('.choice-option')) label.classList.toggle('selected', label.contains(event.target));
    }
  });

  app.addEventListener('input', event => {
    if (event.target.matches('#answer-number')) selectedAnswer = event.target.value;
  });

  app.addEventListener('click', event => {
    const button = event.target.closest('[data-action]');
    if (!button || button.disabled) return;
    const action = button.dataset.action;
    if (action === 'select-profile') {
      state.activeProfileId = button.dataset.id;
      save(); view = 'dashboard'; render(true);
    } else if (action === 'switch-profile') {
      view = 'welcome'; menuOpen = false; render(true);
    } else if (action === 'dashboard') {
      view = 'dashboard'; menuOpen = false; render(true);
    } else if (action === 'continue') {
      const person = profile();
      const saved = lessons.findIndex(lesson => lesson.id === person.progress.lastLessonId);
      const resume = saved >= 0 && !person.progress.completed.includes(lessons[saved].id) ? saved : frontier(person);
      goLesson(Math.min(resume, frontier(person)));
    } else if (action === 'review') goLesson(0);
    else if (action === 'module') {
      const module = modules.find(item => item.id === button.dataset.id);
      if (!module) return;
      const next = module.lessons.find(item => !profile().progress.completed.includes(item.id)) || module.lessons[0];
      goLesson(lessons.findIndex(item => item.id === next.id));
    } else if (action === 'lesson') goLesson(lessons.findIndex(item => item.id === button.dataset.id));
    else if (action === 'previous-lesson') {
      if (currentIndex > 0) goLesson(currentIndex - 1);
      else { view = 'dashboard'; render(true); }
    } else if (action === 'next-lesson' && solved) {
      if (currentIndex === lessons.length - 1) { view = 'complete'; render(true); }
      else goLesson(currentIndex + 1);
    } else if (action === 'retry-lesson') {
      solved = false; feedback = null; selectedAnswer = ''; render();
      document.querySelector('[name="answer"]')?.focus();
    } else if (action === 'back') {
      if (view === 'guide') view = returnView;
      else if (view === 'lesson' && currentIndex > 0) { goLesson(currentIndex - 1); return; }
      else view = view === 'dashboard' ? 'welcome' : profile() ? 'dashboard' : 'welcome';
      menuOpen = false; render(true);
    } else if (action === 'guide') {
      if (view !== 'guide') returnView = view;
      view = 'guide'; menuOpen = false; render(true);
    } else if (action === 'history') { view = 'history'; menuOpen = false; render(true); }
    else if (action === 'menu') { menuOpen = !menuOpen; render(); }
    else if (action === 'close-menu') { menuOpen = false; render(); app.querySelector('.mobile-menu-toggle')?.focus(); }
    else if (action === 'export') exportProgress();
    else if (action === 'delete-profile') { modal = 'delete'; render(); }
    else if (action === 'cancel-modal') { modal = null; render(); app.querySelector('[data-action="delete-profile"]')?.focus(); }
    else if (action === 'confirm-delete') {
      state.profiles = state.profiles.filter(person => person.id !== state.activeProfileId);
      state.activeProfileId = null; save(); modal = null; view = 'welcome'; render(true);
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && (modal || menuOpen)) {
      const wasModal = Boolean(modal);
      modal = null; menuOpen = false; render();
      app.querySelector(wasModal ? '[data-action="delete-profile"]' : '.mobile-menu-toggle')?.focus();
    }
    if (event.key === 'Tab' && modal) {
      const buttons = [...app.querySelectorAll('.modal button')];
      const first = buttons[0]; const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    if (event.key === 'Tab' && menuOpen && mobileQuery.matches && !modal) {
      const buttons = [...app.querySelectorAll('.sidebar button:not(:disabled), .sidebar a[href]')];
      const first = buttons[0]; const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  mobileQuery.addEventListener('change', () => {
    if (menuOpen) { menuOpen = false; render(); }
  });

  window.addEventListener('storage', event => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    state = loadState();
    view = 'welcome'; modal = null; menuOpen = false;
    render(true);
    announce('Les profils ont été actualisés depuis un autre onglet. Choisissez votre profil pour continuer.');
  });

  render();
})();
