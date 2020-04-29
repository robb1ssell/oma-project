import axios from 'axios'

/*
Data Structure for Email:
Pass as single object

{
  "Subject": string,
  "Body": {
    "ContentType": "text/plain" | "text/html",
    "Content": text | html string
  },
  "From": valid xom email,
  "ToRecipients": array of valid emails,
  "CcRecipients": array of emails,
  "BccRecipients": array of emails
}
*/

export const sendEmail = emailData => {
  axios({
    method: 'post',
    url: process.env.REACT_APP_EMAIL_CLIENT_ENDPOINT,
    headers: {
      'client_id': process.env.REACT_APP_EMAIL_CLIENT_ID,
      'client_secret': process.env.REACT_APP_EMAIL_CLIENT_SECRET
    },
    data: {
      "Subject": emailData.subject,
      "Body": {
        "ContentType": emailData.body.contentType,
        "Content": emailData.body.content
      },
      "From": emailData.from,
      "ToRecipients": emailData.to,
      "CcRecipients": emailData.cc,
      "BccRecipients": emailData.bcc
    }
  })
}