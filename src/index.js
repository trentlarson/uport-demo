// Frameworks
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'


import { Provider } from 'react-redux'
import Store from './store'

// Components
import App from './App'

// Styles
import './index.css'

const StoreInstance = Store()

ReactDOM.render(
  <BrowserRouter>
  <Provider store={StoreInstance}>
    <App />
  </Provider>
  </BrowserRouter>,
 document.getElementById('root')
)
