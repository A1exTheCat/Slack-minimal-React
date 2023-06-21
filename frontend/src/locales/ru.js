const ru = {
  forms: {
    login: 'Войти',
    signup: 'Регистрация',
    nickName: 'Ваш ник',
    password: 'Пароль',
    isAccountExisted: 'Нет аккаунта?',
    name: 'Имя пользователя',
    ensurePassword: 'Подтвердите пароль',
    signingUp: 'Зарегестрироваться',
    enterMessage: 'Введите сообщение...',
    errors: {
      loginError: 'Неверные имя пользователя или пароль',
      symbolsError: 'От 3 до 20 символов',
      requiredError: 'Обязательное поле',
      minPasswordError: 'Не менее 6 символов',
      MatchingPasswordError: 'Пароли должны совпадать',
      uniqeNameError: 'Такой пользователь уже существует',
      uniqeNameErrorModal: 'Должно быть уникальным',
      networkError: 'Ошибка сети',
      minMessage: 'Минимум 1 буква',
    }
  },
  navBar: {
    exit: 'Выход',
  },
  mainPage: {
    channels: 'Каналы',
    remove: 'Удалить',
    rename: 'Переименовать',
    message_zero: '{{count}} сообщений',
    message_one: '{{count}} сообщение',
    message_few: '{{count}} сообщения',
    message_many: '{{count}} сообщений',
  },
  modals: {
    addChannel: 'Добавить канал',
    send: 'Отправить',
    cancel: 'Отменить',
    removeChannel: 'Удалить канал',
    remove: 'Удалить',
    sure: 'Уверены?',
    renameChannel: 'Переименовать канал',
  },
  toastify: {
    addChannel: 'Канал добавлен',
    removeChannel: 'Канал удален',
    renameChannel: 'Канал переименован',
  }
}

export default ru;