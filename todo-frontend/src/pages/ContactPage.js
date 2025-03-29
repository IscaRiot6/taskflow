import React from 'react'
import Contact from '../components/Contact'

const ContactPage = () => {
  const handleContactFormSubmit = async contactData => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/contact`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(contactData)
        }
      )

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      console.log('Message sent successfully:', data)
      // You can handle any success notification here, such as:
      alert('Message sent successfully!')
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Error sending message. Please try again later.')
    }
  }

  return <Contact onSubmitContactForm={handleContactFormSubmit} />
}

export default ContactPage
