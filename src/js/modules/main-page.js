export function formValid() {
    const email = document.getElementById('email');
    const name = document.getElementById('name');
    const tel = document.getElementById('tel');
    const checkbox = document.getElementById('confid');
    const form = document.querySelector('form');
    const inputs = document.querySelectorAll('.js-input');

    form.addEventListener('submit', e => {
        e.preventDefault();
        validateInputs(name, tel, email, checkbox);
    });

    const setError = (element, message) => {
        console.log(element)
        console.log(message)
        const inputControl = element.parentElement;
        const errorDisplay = inputControl.querySelector('.error');

        errorDisplay.innerText = message;
        inputControl.classList.add('error');
        inputControl.classList.remove('success');
    }

    const setSuccess = element => {
        const inputControl = element.parentElement;
        const errorDisplay = inputControl.querySelector('.error');

        errorDisplay.innerText = '';
        inputControl.classList.add('success');
        inputControl.classList.remove('error');
    }

    const isValidEmail = email => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    inputs.forEach(input => {
        input.addEventListener('change', () => {

            if (input === name) {
                let nameValue = name.value.trim();
                if (nameValue === '') {
                    setError(name, 'Введите ваше имя');
                } else {
                    setSuccess(name);
                }
            }

            if (input === tel) {
               let telValue = tel.value.trim();

                if (telValue.length < 17) {
                    setError(tel, 'Введите номер телефона');
                } else {
                    setSuccess(tel);
                }
            }

            if (input === email) {
                let emailValue = email.value.trim();
                if (emailValue === '') {
                    setError(email, 'Введите ваш email');
                } else if (!isValidEmail(emailValue)) {
                    setError(email, 'Адрес эл.почты введен некорректно');
                } else {
                    setSuccess(email);
                }
            }
console.log('tetetete')

            if (input === checkbox) {
                if (checkbox.checked) {
                    setSuccess(checkbox.parentElement);
                } else {
                    setError(checkbox.parentElement, 'Отметьте соглашение с политикой конфиденциальности');
                }
            }

        });
    });

    const validateInputs = (name, tel, email, checkbox) => {

        if (name) {
            let nameValue = name.value.trim();
            if (nameValue === '') {
                setError(name, 'Введите ваше имя');
            } else {
                setSuccess(name);
            }
        }

        if (tel) {
            let numberValue = tel.value.trim();
            if (numberValue.length != 17) {
                setError(tel, 'Введите номер телефона');
            } else {
                setSuccess(tel);
            }
        }

        if (email) {
            let emailValue = email.value.trim();
            if (emailValue === '') {
                setError(email, 'Введите ваш email');
            } else if (!isValidEmail(emailValue)) {
                setError(email, 'Адрес эл.почты введен некорректно');
            } else {
                setSuccess(email);
            }
        }


            if (checkbox.checked) {
                setSuccess(checkbox.parentElement);
                console.log("success");
            } else {
                setError(checkbox.parentElement, "Отметьте соглашение с политикой конфиденциальности");
                console.log('error');
            }


    }
}

window.addEventListener("DOMContentLoaded", function() {
    [].forEach.call( document.querySelectorAll('#tel'), function(input) {
        let keyCode;
        function mask(event) {
            event.keyCode && (keyCode = event.keyCode);
            let pos = this.selectionStart;
            if (pos < 3) {
                event.preventDefault();
            }

            let matrix = "+7 (___) ___-____",
                i = 0,
                def = matrix.replace(/\D/g, ""),
                val = this.value.replace(/\D/g, ""),
                new_value = matrix.replace(/[_\d]/g, function(a) {
                    return i < val.length ? val.charAt(i++) : a
                });

            i = new_value.indexOf("_");

            if (i != -1) {
                i < 5 && (i = 3);
                new_value = new_value.slice(0, i)
            }

            let reg = matrix.substr(0, this.value.length).replace(/_+/g,
                function(a) {
                    return "\\d{1," + a.length + "}"
                }).replace(/[+()]/g, "\\$&");
            reg = new RegExp("^" + reg + "$");

            if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) {
                this.value = new_value;
            }

            if (event.type == "blur" && this.value.length < 5) {
                this.value = "";
            }
        }

        input.addEventListener("input", mask, false);
        input.addEventListener("focus", mask, false);
        input.addEventListener("blur", mask, false);
        input.addEventListener("keydown", mask, false);
    });
});