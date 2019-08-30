import { Component } from 'react'
import util from 'util'

class ErrorHandlingComponent extends Component {

  objectToString(object) {
    return util.inspect(object, { showHidden: true, depth: null })
  }

  alertUnknownError(err) {
    alert("Ack!  Sorry, the system is having problems. \n\n                                 :-(                            \n\n " + this.objectToString(err))
  }

  alertOrReturnJson(location) {
    return response => {
      if (response.status >= 200
          && response.status < 300) {
        return response.json()
      } else {
        location = location || ("unknown with stack " + new Error().stack)
        console.log("Got response status", response.status, "and content", response, "in", location)
        response.json()
          .then(result => {
            console.log("... and that", location, "response parses as:", this.objectToString(result)) // helpful on that DID method error
            if (result.userMessage) {
              alert(result.userMessage)
            } else {
              this.alertUnknownError(result)
            }
          })
          .catch(err => {
            console.log("... and that", location, "response fails to parse as json because:", err)
            this.alertUnknownError(err)
          })
        // This is needed to avoid subsequent "then" chains. It shows in the console, too.
        throw Error("Server error in " + location + " was logged and user was alerted.")
      }
    }
  }

}

export default ErrorHandlingComponent
