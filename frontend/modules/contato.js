import validator from 'validator';

export default class Contato {
  constructor(formClass) {
    this.form = document.querySelector(formClass);
  }

  init() {
    this.events();
  }

  events() {
    if (!this.form) return;
    this.form.addEventListener('submit', e => {
      e.preventDefault();
      this.validate(e);
    });
  }

  validate(e) {
    const el = e.target;
    const nomeInput = el.querySelector('input[name="nome"]');
    const sobrenomeInput = el.querySelector('input[name="sobrenome"]');
    const telefoneInput = el.querySelector('input[name="telefone"]');
    const emailInput = el.querySelector('input[name="email"]');
    let error = false;

    this.clearErrors(el);

    if (!nomeInput.value.trim()) {
      this.createError(nomeInput, 'Nome é um campo obrigatório.');
      error = true;
    }

    if (emailInput.value && !validator.isEmail(emailInput.value)) {
      this.createError(emailInput, 'E-mail inválido.');
      error = true;
    }

    if (!emailInput.value && !telefoneInput.value) {
      this.createError(telefoneInput, 'Pelo menos um contato precisa ser enviado: e-mail ou telefone.');
      error = true;
    }

    if (!error) el.submit();
  }

  createError(field, message) {
    const div = document.createElement('div');
    div.innerHTML = message;
    div.classList.add('text-danger', 'error-text', 'small', 'mt-1');
    field.insertAdjacentElement('afterend', div);
  }

  clearErrors(form) {
    const errorElements = form.querySelectorAll('.error-text');
    for (const el of errorElements) {
      el.remove();
    }
  }
}
