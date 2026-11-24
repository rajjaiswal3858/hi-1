/*
 * Local stand-in for HubSpot's forms embed (js.hsforms.net/forms/embed/v2.js).
 *
 * Implements the subset of `hbspt.forms.create()` the site uses and renders the same
 * markup/classes HubSpot does (hs-form, hs-input, hs-button, hs-error-msgs, submitted-message),
 * so the site's own form styling applies unchanged. Field definitions come from
 * /data/forms/<formId>.json (exported from HubSpot's public form JSON at import time).
 *
 * Submissions are validated and then acknowledged locally with the form's own thank-you
 * message. Nothing is sent to HubSpot — this replica must never post leads to the real CRM.
 *
 * Also auto-renders placeholders:  <div data-hs-form-id="…">  and HubSpot frame embeds
 * <div class="hs-form-frame" data-form-id="…">.
 */
(function () {
  'use strict';
  if (window.hbspt && window.hbspt.forms && window.hbspt.forms.__local) return;

  var cache = {};
  var uid = 0;

  function loadDef(id) {
    if (!cache[id]) {
      cache[id] = fetch('/data/forms/' + id + '.json').then(function (r) {
        if (!r.ok) throw new Error('Form ' + id + ' not found');
        return r.json();
      });
    }
    return cache[id];
  }

  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) if (attrs[k] != null && attrs[k] !== false) n.setAttribute(k, attrs[k] === true ? '' : attrs[k]);
    if (html != null) n.innerHTML = html;
    return n;
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }

  function inputType(f) {
    if (f.name === 'email' || f.type === 'email') return 'email';
    if (f.type === 'phonenumber' || f.name === 'phone' || f.name === 'mobilephone') return 'tel';
    if (f.type === 'number') return 'number';
    if (f.type === 'date') return 'date';
    if (f.type === 'file') return 'file';
    return 'text';
  }

  function renderField(f, formUid) {
    var id = f.name + '-' + formUid;
    var wrap = el('div', { class: 'hs_' + f.name + ' hs-' + f.name + ' hs-fieldtype-' + f.type + ' field hs-form-field' });
    var labelHtml = f.label ? '<span>' + escapeHtml(f.label) + '</span>' + (f.required ? '<span class="hs-form-required">*</span>' : '') : '';
    var isBool = f.type === 'booleancheckbox';
    if (!isBool) wrap.appendChild(el('label', { id: 'label-' + id, class: f.label ? '' : 'hs-label-hidden', for: id }, labelHtml));
    if (f.description) wrap.appendChild(el('legend', { class: 'hs-field-desc' }, escapeHtml(f.description)));
    var box = el('div', { class: 'input' });
    var input;
    if (f.type === 'textarea') {
      input = el('textarea', { id: id, name: f.name, class: 'hs-input', placeholder: f.placeholder || null, required: f.required });
      if (f.defaultValue) input.value = f.defaultValue;
    } else if (f.type === 'select') {
      input = el('select', { id: id, name: f.name, class: 'hs-input', required: f.required });
      input.appendChild(el('option', { value: '', disabled: true, selected: true }, escapeHtml(f.unselectedLabel || f.placeholder || 'Please Select')));
      (f.options || []).forEach(function (o) { input.appendChild(el('option', { value: o.value }, escapeHtml(o.label))); });
    } else if (f.type === 'radio' || f.type === 'checkbox') {
      input = el('ul', { class: 'inputs-list' + (f.type === 'checkbox' ? ' multi-container' : ''), role: f.type === 'radio' ? 'radiogroup' : null });
      (f.options || []).forEach(function (o, i) {
        var li = el('li', { class: 'hs-form-' + f.type });
        var lab = el('label', { for: id + '-' + i, class: 'hs-form-' + f.type + '-display' });
        lab.appendChild(el('input', { id: id + '-' + i, class: 'hs-input', type: f.type, name: f.name, value: o.value }));
        lab.appendChild(el('span', null, escapeHtml(o.label)));
        li.appendChild(lab); input.appendChild(li);
      });
      input.dataset.required = f.required ? '1' : '';
    } else if (isBool) {
      input = el('ul', { class: 'inputs-list' });
      var li = el('li', { class: 'hs-form-booleancheckbox' });
      var lab = el('label', { for: id, class: 'hs-form-booleancheckbox-display' });
      lab.appendChild(el('input', { id: id, class: 'hs-input', type: 'checkbox', name: f.name, value: 'true', required: f.required }));
      lab.appendChild(el('span', null, escapeHtml(f.label) + (f.required ? '<span class="hs-form-required">*</span>' : '')));
      li.appendChild(lab); input.appendChild(li);
    } else {
      input = el('input', {
        id: id, name: f.name, type: inputType(f), class: 'hs-input', placeholder: f.placeholder || null,
        required: f.required, autocomplete: f.name === 'email' ? 'email' : (f.name === 'firstname' ? 'given-name' : (f.name === 'lastname' ? 'family-name' : null)),
        inputmode: f.name === 'email' ? 'email' : null,
      });
      if (f.defaultValue) input.value = f.defaultValue;
    }
    box.appendChild(input);
    wrap.appendChild(box);
    wrap.__field = f;
    return wrap;
  }

  function showError(field, message) {
    clearError(field);
    var list = el('ul', { class: 'no-list hs-error-msgs inputs-list', role: 'alert' });
    list.appendChild(el('li', null, '<label class="hs-error-msg hs-main-font-element">' + escapeHtml(message) + '</label>'));
    field.appendChild(list);
    field.querySelectorAll('.hs-input').forEach(function (i) { i.classList.add('invalid', 'error'); });
  }

  function clearError(field) {
    var e = field.querySelector('.hs-error-msgs');
    if (e) e.remove();
    field.querySelectorAll('.hs-input').forEach(function (i) { i.classList.remove('invalid', 'error'); });
  }

  function validate(field) {
    var f = field.__field;
    var inputs = field.querySelectorAll('.hs-input');
    var value = '';
    if (f.type === 'radio' || f.type === 'checkbox' || f.type === 'booleancheckbox') {
      inputs.forEach(function (i) { if (i.checked) value = 'x'; });
    } else value = (inputs[0] && inputs[0].value || '').trim();
    if (f.required && !value) { showError(field, 'Please complete this required field.'); return false; }
    if (value && inputType(f) === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      showError(field, 'Email must be formatted correctly.'); return false;
    }
    clearError(field);
    return true;
  }

  function build(def, opts, target) {
    var formUid = 'hs' + (++uid);
    var form = el('form', {
      id: 'hsForm_' + def.id + '_' + formUid,
      class: [def.cssClass || 'hs-form stacked', 'hs-form-private', 'hsForm_' + def.id, 'hs-form-' + def.id, opts.cssClass || ''].join(' ').trim(),
      novalidate: true, 'accept-charset': 'UTF-8', action: '#', 'data-form-id': def.id,
    });
    var fields = [];
    def.groups.forEach(function (g) {
      if (!g.fields.length && !g.richText) return;
      var fs = el('fieldset', { class: 'form-columns-' + Math.max(1, g.fields.length) });
      if (g.richText) fs.appendChild(el('div', { class: 'hs-richtext hs-main-font-element' }, g.richText));
      g.fields.forEach(function (f) { var w = renderField(f, formUid); fields.push(w); fs.appendChild(w); });
      form.appendChild(fs);
    });
    if (def.legal) {
      try {
        var legal = JSON.parse(def.legal);
        var txt = legal.communicationConsentText || legal.processingConsentText || legal.privacyPolicyText || '';
        if (txt) form.appendChild(el('div', { class: 'legal-consent-container' }, '<div class="hs-richtext">' + txt + '</div>'));
      } catch (e) { /* malformed legal block: skip */ }
    }
    if (def.captcha) {
      // Keeps the vertical space HubSpot reserves for its (visually hidden) inline reCAPTCHA badge.
      form.appendChild(el('div', { class: 'hs_recaptcha hs-recaptcha field hs-form-field', 'aria-hidden': 'true' },
        '<div class="input"><div class="grecaptcha-badge" style="width:256px;height:60px;visibility:hidden"></div></div>'));
    }
    var submit = el('div', { class: 'hs_submit hs-submit' });
    var actions = el('div', { class: 'actions' });
    actions.appendChild(el('input', { type: 'submit', class: 'hs-button primary large ' + (opts.submitButtonClass || ''), value: opts.submitText || def.submitText || 'Submit' }));
    submit.appendChild(actions);
    form.appendChild(submit);

    fields.forEach(function (w) {
      w.addEventListener('change', function () { if (w.querySelector('.hs-error-msgs')) validate(w); });
      w.addEventListener('focusout', function () { if (w.querySelector('.hs-error-msgs')) validate(w); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = fields.map(validate).every(Boolean);
      if (!ok) {
        var first = form.querySelector('.hs-input.invalid');
        if (first) first.focus();
        return;
      }
      if (typeof opts.onBeforeFormSubmit === 'function') opts.onBeforeFormSubmit(form, []);
      if (typeof opts.onFormSubmit === 'function') opts.onFormSubmit(form);
      var data = Array.from(new FormData(form).entries()).map(function (p) { return { name: p[0], value: p[1] }; });
      var msg = el('div', { class: 'submitted-message hs-main-font-element hs-form-' + def.id, 'data-form-id': def.id, role: 'status' },
        opts.inlineMessage || def.inlineMessage || '<p>Thanks for submitting the form.</p>');
      form.replaceWith(msg);
      if (typeof opts.onFormSubmitted === 'function') opts.onFormSubmitted(msg, { submissionValues: data });
    });

    // Same wrapper HubSpot creates; the site's form styles hang off .hbspt-form.
    var root = el('div', { id: 'hbspt-form-' + formUid, class: 'hbspt-form', 'data-hs-forms-root': 'true' });
    root.appendChild(form);
    target.appendChild(root);
    if (typeof opts.onFormReady === 'function') opts.onFormReady(form);
    return form;
  }

  function resolveTarget(opts) {
    if (opts.target) return typeof opts.target === 'string' ? document.querySelector(opts.target) : opts.target;
    var s = document.currentScript;
    if (s && s.parentNode) { var d = document.createElement('div'); s.parentNode.insertBefore(d, s.nextSibling); return d; }
    return null;
  }

  function create(opts) {
    opts = opts || {};
    var target = resolveTarget(opts);
    if (!target || !opts.formId) return;
    loadDef(opts.formId).then(function (def) { build(def, opts, target); })
      .catch(function (err) { console.warn('[hubspot-forms]', err.message); });
  }

  window.hbspt = window.hbspt || {};
  window.hbspt.forms = { create: create, __local: true };

  function autoRender() {
    document.querySelectorAll('[data-hs-form-id]:not([data-hs-rendered]), .hs-form-frame[data-form-id]:not([data-hs-rendered])').forEach(function (n) {
      n.setAttribute('data-hs-rendered', '');
      create({ formId: n.getAttribute('data-hs-form-id') || n.getAttribute('data-form-id'), target: n });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoRender);
  else autoRender();
})();
