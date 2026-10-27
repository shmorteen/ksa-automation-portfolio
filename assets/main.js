(() => {
  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('#mobile-nav');
  const closeMenu = () => { toggle?.setAttribute('aria-expanded', 'false'); if (mobileNav) mobileNav.hidden = true; document.body.classList.remove('menu-open'); };
  toggle?.addEventListener('click', () => {
    const opening = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(opening));
    if (mobileNav) mobileNav.hidden = !opening;
    document.body.classList.toggle('menu-open', opening);
  });
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 800) closeMenu(); });
  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());
  const targets = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach(el => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px 40px 0px' });
    targets.forEach(el => observer.observe(el));
  }
})();

// All workflow demos below are browser-only prototypes using fictitious records.
// They do not make network requests or connect to third-party tools.
(() => {
  const cards = [...document.querySelectorAll('[data-demo-card]')];
  const buttons = [...document.querySelectorAll('.demo-select')];
  const form = document.querySelector('#demo-form');
  const fields = document.querySelector('#demo-fields');
  const title = document.querySelector('#demo-current-title');
  const description = document.querySelector('#demo-current-description');
  const output = document.querySelector('#demo-json');
  const kpis = document.querySelector('#demo-kpis');
  const summary = document.querySelector('#demo-summary');
  const status = document.querySelector('#demo-status');
  const download = document.querySelector('#demo-download');
  const copy = document.querySelector('#demo-copy');
  const reset = document.querySelector('#demo-reset');
  const consoleEl = document.querySelector('#demo-console');
  if (!form || !fields) return;

  const samples = {
    clean: 'name,email,company\n Amina Bello , AMINA@EXAMPLE.COM ,Acme Labs\nSamuel Ade,samuel@example.com,Northstar\nAmina Bello,amina@example.com,Acme Labs\nNo Email,not-an-email,Demo Ltd\nJoy Okoro,joy@example.com,Orbit Co',
    orders: 'order_id,sku,qty,stock\nORD-1001,SKU-A,2,8\nORD-1002,SKU-B,5,3\nORD-1003,SKU-C,1,14\nORD-1001,SKU-A,2,8\nORD-1004,SKU-D,0,4',
  };
  const definitions = {
    lead: {
      title: 'Lead intake & smart routing',
      description: 'Try a sample enquiry. A simple rule engine produces a priority score and a CRM-ready payload preview.',
      fields: `<div class="demo-field"><label for="demo-name">Contact name</label><input id="demo-name" name="name" maxlength="80" required value="Amina Bello" /></div>
        <div class="demo-field"><label for="demo-budget">Project budget</label><select id="demo-budget" name="budget"><option value="300">Under $800</option><option value="1400" selected>$800–$2,000</option><option value="2600">Over $2,000</option></select></div>
        <div class="demo-field full"><label for="demo-service">Service requested</label><select id="demo-service" name="service"><option>Python automation</option><option selected>API integration</option><option>Data cleaning / ETL</option><option>AI workflow prototype</option></select></div>
        <label class="demo-check"><input type="checkbox" name="urgent" checked /> Needs a solution soon</label>`
    },
    clean: {
      title: 'Spreadsheet cleanup pipeline',
      description: 'Edit the sample CSV. The validator normalizes fields, identifies duplicates and rejects malformed email addresses.',
      fields: `<div class="demo-field full"><label for="demo-csv">Sample CSV — name, email, company</label><textarea id="demo-csv" name="csv" spellcheck="false" rows="7" aria-describedby="demo-csv-note"></textarea><small class="demo-help" id="demo-csv-note">Up to 200 rows. No data leaves this page. Use sample data rather than personal information.</small></div>`
    },
    orders: {
      title: 'Order & inventory reconciliation',
      description: 'Check a fictitious batch of orders for duplicate IDs, insufficient stock and invalid quantities.',
      fields: `<div class="demo-field full"><label for="demo-orders">Sample order feed — order_id, sku, qty, stock</label><textarea id="demo-orders" name="csv" spellcheck="false" rows="7" aria-describedby="demo-order-note"></textarea><small class="demo-help" id="demo-order-note">All orders and stock numbers are hypothetical. No online store is connected.</small></div>`
    },
    reports: {
      title: 'Automated sales summary',
      description: 'Choose a sample reporting period. The demo calculates KPIs from fictitious transaction records.',
      fields: `<div class="demo-field full"><label for="demo-period">Reporting period</label><select id="demo-period" name="period"><option value="current">Sample week A</option><option value="previous">Sample week B</option></select></div><div class="demo-field full"><span class="demo-help">In a production project, a scheduler and approved data-source integrations could automate delivery. This example generates a preview only.</span></div>`
    }
  };
  let active = 'lead';
  let lastResult = null;

  function outputState(kind, text) {
    status.classList.toggle('is-success', kind === 'success');
    status.classList.toggle('is-error', kind === 'error');
    status.textContent = text;
  }
  function clearOutput() {
    lastResult = null;
    output.textContent = '// Run a workflow to view its output.';
    kpis.replaceChildren();
    summary.textContent = 'Sample data only. No information is sent or stored.';
    outputState('', 'READY TO RUN');
    download.disabled = true;
    copy.disabled = true;
  }
  function setDemo(next, shouldScroll = false) {
    if (!definitions[next]) return;
    active = next;
    title.textContent = definitions[next].title;
    description.textContent = definitions[next].description;
    // Only controlled, locally defined form markup is injected here.
    fields.innerHTML = definitions[next].fields;
    if (next === 'clean') fields.querySelector('textarea').value = samples.clean;
    if (next === 'orders') fields.querySelector('textarea').value = samples.orders;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.demo === next)));
    cards.forEach(card => card.classList.toggle('is-active', card.dataset.demoCard === next));
    clearOutput();
    if (shouldScroll && consoleEl) consoleEl.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }

  // Quoted cells, escaped quotes, CRLF and newlines are accepted in sample CSV.
  function parseCSV(source) {
    if (!source.trim()) throw new Error('Paste some CSV rows to continue.');
    if (source.length > 50000) throw new Error('Limit this demo to 50,000 characters.');
    const rows = []; let cell = '', row = [], quoted = false;
    for (let i = 0; i < source.length; i++) {
      const ch = source[i];
      if (ch === '"') {
        if (quoted && source[i+1] === '"') { cell += '"'; i++; }
        else if (quoted) quoted = false;
        else if (!cell.trim()) quoted = true;
        else throw new Error('Invalid quote syntax in CSV input.');
      } else if (ch === ',' && !quoted) { row.push(cell.trim()); cell = ''; }
      else if ((ch === '\n' || ch === '\r') && !quoted) {
        if (ch === '\r' && source[i+1] === '\n') i++;
        row.push(cell.trim()); cell = '';
        if (row.some(value => value)) rows.push(row);
        row = [];
      } else cell += ch;
    }
    if (quoted) throw new Error('A quoted CSV value was not closed.');
    row.push(cell.trim());
    if (row.some(value => value)) rows.push(row);
    if (rows.length < 2) throw new Error('Include a header and at least one data row.');
    if (rows.length > 201) throw new Error('This demo supports up to 200 data rows.');
    const header = rows[0].map(v => v.toLowerCase());
    if (new Set(header).size !== header.length) throw new Error('CSV header columns must be unique.');
    return { header, records: rows.slice(1).map((r, i) => {
      if (r.length !== header.length) throw new Error(`Row ${i + 2} has ${r.length} columns; expected ${header.length}.`);
      return Object.fromEntries(header.map((key, idx) => [key, r[idx]]));
    }) };
  }
  function requireColumns(actual, required) {
    const missing = required.filter(item => !actual.includes(item));
    if (missing.length) throw new Error(`Missing required CSV column(s): ${missing.join(', ')}`);
  }
  function summarize(payload, stats, note) { return { payload, stats, note }; }
  function processLead(data) {
    const name = String(data.get('name') || '').trim().replace(/\s+/g, ' ');
    if (!name) throw new Error('Please enter a contact name.');
    const service = String(data.get('service'));
    const budget = Number(data.get('budget'));
    const urgent = data.get('urgent') === 'on';
    const score = Math.min(100, (budget >= 2000 ? 45 : budget >= 800 ? 30 : 15) + 25 + (urgent ? 25 : 0));
    const priority = score >= 70 ? 'high' : score >= 50 ? 'standard' : 'low';
    const payload = { simulation: true, lead: { name, service, budget_usd_example: budget, urgent }, qualification: { score, priority }, crm_payload_preview: { contact_name: name, pipeline: 'new_enquiries', owner_queue: priority === 'high' ? 'priority_review' : 'general_review', service_interest: service, status: 'draft_only_not_sent' } };
    return summarize(payload, [[String(score)+'/100','Lead score'],[priority.toUpperCase(),'Priority'],['1','Draft record']], 'CRM payload generated locally; nothing has been sent.');
  }
  function processClean(data) {
    const {header, records} = parseCSV(String(data.get('csv') || ''));
    requireColumns(header, ['name','email','company']);
    const seen = new Set(), valid = [], rejected = []; let duplicates = 0;
    records.forEach((row, index) => {
      const normalized = { name: row.name.replace(/\s+/g,' ').trim(), email: row.email.trim().toLowerCase(), company: row.company.replace(/\s+/g,' ').trim() };
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized.email)) { rejected.push({ line: index + 2, reason: 'invalid_email' }); return; }
      if (seen.has(normalized.email)) { duplicates++; rejected.push({ line: index + 2, reason: 'duplicate_email' }); return; }
      seen.add(normalized.email); valid.push(normalized);
    });
    return summarize({ simulation: true, input_rows: records.length, valid_contacts: valid, rejected_rows: rejected },[[String(records.length),'Input rows'],[String(valid.length),'Valid rows'],[String(duplicates),'Duplicates']], `${rejected.length} row(s) flagged for review; cleaned contacts are shown in JSON.`);
  }
  function processOrders(data) {
    const {header, records} = parseCSV(String(data.get('csv') || ''));
    requireColumns(header, ['order_id','sku','qty','stock']);
    const seen = new Set(), checks = []; let ready = 0, held = 0;
    records.forEach((row, i) => {
      const id = row.order_id.trim(); const qty = Number(row.qty); const stock = Number(row.stock);
      let reason = null;
      if (!id || !row.sku.trim()) reason = 'missing_identifier';
      else if (seen.has(id)) reason = 'duplicate_order';
      else if (!Number.isInteger(qty) || qty <= 0 || !Number.isInteger(stock) || stock < 0) reason = 'invalid_quantity_or_stock';
      else if (qty > stock) reason = 'insufficient_stock';
      if (id) seen.add(id);
      const state = reason ? 'manual_review' : 'ready_for_fulfillment';
      if (reason) held++; else ready++;
      checks.push({ order_id: id || `row_${i+2}`, sku: row.sku, status: state, ...(reason ? { reason } : {}) });
    });
    return summarize({ simulation: true, checked: records.length, order_checks: checks, fulfillment_synced: false },[[String(records.length),'Checked'],[String(ready),'Ready'],[String(held),'Held']], `${held} exception(s) identified. No stock or orders were changed.`);
  }
  function processReports(data) {
    const period = String(data.get('period'));
    const records = period === 'previous' ? [
      {id:'B01',channel:'Website',value:115}, {id:'B02',channel:'Referral',value:190},
      {id:'B03',channel:'Website',value:75}, {id:'B04',channel:'Marketplace',value:120}
    ] : [
      {id:'A01',channel:'Website',value:110}, {id:'A02',channel:'Referral',value:325},
      {id:'A03',channel:'Website',value:175}, {id:'A04',channel:'Marketplace',value:145},
      {id:'A05',channel:'Referral',value:210}, {id:'A06',channel:'Website',value:95}
    ];
    const revenue = records.reduce((a,r) => a + r.value, 0);
    const byChannel = {};
    records.forEach(({channel,value}) => { if (!byChannel[channel]) byChannel[channel] = {orders:0,revenue_usd:0}; byChannel[channel].orders++; byChannel[channel].revenue_usd += value; });
    return summarize({ simulation: true, period: period === 'previous' ? 'sample_week_b' : 'sample_week_a', kpis: { orders: records.length, revenue_usd: revenue, average_order_value_usd: Number((revenue/records.length).toFixed(2)) }, breakdown_by_channel: byChannel, report_delivery: 'preview_only_not_scheduled' },[[String(records.length),'Orders'],[`$${revenue.toLocaleString('en-US')}`,'Revenue'],[`$${(revenue/records.length).toFixed(0)}`,'Avg. order']], 'Computed from hypothetical sales. No actual scheduling or report delivery.');
  }
  const processors = { lead: processLead, clean: processClean, orders: processOrders, reports: processReports };
  function renderKpis(stats) {
    kpis.replaceChildren();
    stats.forEach(([value,label]) => {
      const el = document.createElement('div'); el.className = 'demo-kpi';
      const b = document.createElement('b'); b.textContent = value;
      const s = document.createElement('span'); s.textContent = label;
      el.append(b,s); kpis.append(el);
    });
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    try {
      const result = processors[active](new FormData(form));
      lastResult = result.payload;
      renderKpis(result.stats);
      output.textContent = JSON.stringify(result.payload, null, 2);
      summary.textContent = result.note;
      outputState('success','COMPLETE · LOCAL');
      download.disabled = false; copy.disabled = false;
    } catch (error) {
      clearOutput();
      output.textContent = `// Input validation\n${error.message}`;
      outputState('error','INPUT NEEDS REVIEW');
      summary.textContent = 'Correct the input above and try again.';
    }
  });
  buttons.forEach(button => button.addEventListener('click', () => setDemo(button.dataset.demo, true)));
  reset.addEventListener('click', () => setDemo(active));
  download.addEventListener('click', () => {
    if (!lastResult) return;
    const blob = new Blob([JSON.stringify(lastResult, null, 2) + '\n'], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `ksa-demo-${active}-sample.json`;
    document.body.append(a); a.click(); a.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  });
  copy.addEventListener('click', async () => {
    if (!lastResult) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(lastResult, null, 2));
      copy.textContent = 'Copied ✓';
    } catch {
      copy.textContent = 'Use selection to copy';
      output.focus();
    }
  });
  setDemo(active);
})();
