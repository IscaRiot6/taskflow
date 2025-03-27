import React, { useState, useEffect } from 'react'
import '../styles//PasswordValidation.css'

const PasswordValidation = ({ password }) => {
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    number: false
  })

  // Check password validity rules
  useEffect(() => {
    const lengthCheck = password.length >= 9 && password.length <= 19
    const uppercaseCheck = /[A-Z]/.test(password)
    const numberCheck = /\d/.test(password)

    setPasswordValidations({
      length: lengthCheck,
      uppercase: uppercaseCheck,
      number: numberCheck
    })
  }, [password])

  return (
    <div className='password-validation'>
      <ul>
        <li style={{ color: passwordValidations.length ? 'green' : 'red' }}>
          Password should be between 9-19 characters
        </li>
        <li style={{ color: passwordValidations.uppercase ? 'green' : 'red' }}>
          Password must contain at least one uppercase letter
        </li>
        <li style={{ color: passwordValidations.number ? 'green' : 'red' }}>
          Password must include at least one number
        </li>
      </ul>
    </div>
  )
}

export default PasswordValidation
