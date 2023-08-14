class Api {
  constructor(config) {
    this._url = config.url;
    this._headers = config.headers;
  }

  // метод проверяет есть ли ошибка
  _checkError(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Статус ошибки: ${res.status}`);
  }
  // метод производит загрузкк карточек с сервера
  getInitialCards(token) {
    return fetch(`${this._url}/cards`, {
      method: 'GET',
      headers: {
        ...this._headers,
        Authorization: `Bearer ${token}`
      },
    }).then((res) => this._checkError(res));
  }
  // метод добавляет карточки на страницу
  postNewCard({data,token}) {
    return fetch(`${this._url}/cards`, {
      method: 'POST',
       headers: {
        ...this._headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }).then((res) => this._checkError(res));
  }
  // метод удаления карточек
  deleteCard(cardId, token) {
    return fetch(`${this._url}/cards/${cardId}`, {
      method: 'DELETE',
      headers: {
        ...this._headers,
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => this._checkError(res));
  }
  // метод получения данных с сервера
  getInfo(token) {
    return fetch(`${this._url}/users/me`, {
      method: 'GET',
      headers: {
        ...this._headers,
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => this._checkError(res));
  }
  //метод для изменения данных с сервера
  editUserInfo({data,token}) {
    // console.log(data)
    return fetch(`${this._url}/users/me`, {
      method: 'PATCH',
      headers: {
        ...this._headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: data.name,
        about: data.about,
      }),
    }).then((res) => this._checkError(res));
  }
  // метод изменения данных аватара
  patchAvatarInfo(data, token) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        ...this._headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }).then((res) => this._checkError(res));
  }
  // метод добавления лайка
  getLike(cardId, token) {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: 'PUT',
      headers: {
        ...this._headers,
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => this._checkError(res));
    
  }
  // метод удаления лайка
  deleteLike(cardId, token) {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: 'DELETE',
      headers: {
        ...this._headers,
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => this._checkError(res));
  }

}


// объект класса Api
 
const api = new Api({
  url: 'https://api.oleinikov.nomoreparties.co',
  headers: {
    'Content-Type': 'application/json',
    // authorization: "839f0bcd-454c-4502-9292-a3578896039c",
  },
});

export default api;
// const { NODE_ENV } = process.env;

// export let BASE_URL;
// if (NODE_ENV === 'production') {
//   BASE_URL = 'https://api.oleinikov.nomoreparties.co';
// } else {
//   BASE_URL = 'http://localhost:3001';
// }