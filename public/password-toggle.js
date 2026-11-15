const eyeIcon = `<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/><path class="eye-slash" d="m3 3 18 18"/></svg>`;

function initializePasswordToggles(container) {
  for (const input of container.querySelectorAll('#start-code, #recap-code')) {
    if (input.closest('.password-field')) continue;
    const wrapper = document.createElement('div');
    wrapper.className = 'password-field';
    input.before(wrapper);
    wrapper.append(input);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'password-toggle';
    button.setAttribute('aria-controls', input.id);
    button.innerHTML = eyeIcon;
    const label = input.id === 'start-code' ? 'kode mulai UAS' : 'kode rekap dosen';
    function update(visible) {
      input.type = visible ? 'text' : 'password';
      button.setAttribute('aria-pressed', String(visible));
      button.setAttribute('aria-label', `${visible ? 'Sembunyikan' : 'Tampilkan'} ${label}`);
      button.title = button.getAttribute('aria-label');
    }
    update(false);
    button.addEventListener('click', () => update(input.type === 'password'));
    wrapper.append(button);
  }
}
