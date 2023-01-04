

const sgMail = require('@sendgrid/mail')

// const sendgridAPIKey = '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'

// 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


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// sgMail.send({
//     to : 'shaileshf12@gmail.com',
//     from : 'shaileshf12@gmail.com',
//     subject : 'This is my secret creation',
//     text : 'I hope this one actually get to you'
// })

const sendWelcomeEmail = (email, name) =>{
    sgMail.send({
        to : email,
        from : 'shaileshf12@gmail.com',
        subject : 'Thanks for joining in!',
        text : `Welcome to App, ${name}. Hope you will have fun using it`
    })
}

const sendDeleteAccountEmail = (email, name) =>{
    sgMail.send({
        to : email,
        from : 'shaileshf12@gmail.com',
        subject : 'Account successfully deleted',
        text : `Goodbye, ${name}. Thanks for using our App`
    })
}

module.exports = {sendWelcomeEmail, sendDeleteAccountEmail}