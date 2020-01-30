class Text {
  constructor(text) {
    this.text = text;
  }
  addText() {
    document.querySelector(".text").innerHTML = this.regExp(this.text);
  }
  regExp(text) {
    const regExp = /'(?=[^A-zА-яЁё]|$)|(?<=^|[^A-zА-яЁё])'/g;

    return text.replace(regExp, `"`);
  }
}

let text = `'Слава богу, – сказала девушка, – насилу вы приехали. Чуть было вы барышню не уморили' (По Пушкину) 
            В этом примере прямая речь состоит из двух предложений, первое из которых разорвано словами автора. 
            Но если бы слова автора оказались между двумя предложениями, из которых состоит прямая речь, то после 
            слов автора нужно было бы поставить точку. Сравните: 'Слава богу, насилу вы приехали, – сказала девушка. 
            – Чуть было вы барышню не уморили'. А вот тут начинается та часть где нужно улучшить шаблон, чтобы одинарная 
            кавычка в словах типа aren't не менялась на двойную. Кил'джеден.`
const newText = new Text(text);

newText.addText();

class Validation {
  constructor() {
    this.nameRegExp = /[A-zА-яЁё]/g;
    this.phoneRegExp = /\+7\(\d{3}\)\d{3}-\d{2}-?\d{2}/g;
    this.mailRegExp = /^.+(\.?|-?).+@[A-Za-z]+\.[A-Za-z]{2,3}$/g;
    this.textRegExp = /^.*/gm;
    this.$inputs = [...document.querySelectorAll(".form__inputfield")];
  }

  initCLick() {
    const $formBtn = document.querySelector(".form__btn");

    $formBtn.addEventListener('click', (event) => {
      event.preventDefault();
      this.validate()
    });
  }

  validate() {
    this.$inputs.map($input => {
      switch($input.getAttribute('id')) {
        case 'form__name':
          this.validateFromDom($input, this.nameRegExp);
          break;
        case 'form__phone':
          this.validateFromDom($input, this.phoneRegExp);
          break;
        case 'form__mail':
          this.validateFromDom($input, this.mailRegExp);
          break;
        case 'form__text':
          this.validateFromDom($input, this.textRegExp);
          break;
      }
    });
  }

  validateFromDom($el, regExp) {
    if($el.value.length === 0 && !regExp.test($el.value)) {
      $el.classList.add('error');

      setTimeout(() => {
        $el.classList.remove('error');
      }, 5000)
    }
  }
}

const formValidate = new Validation();

formValidate.initCLick();