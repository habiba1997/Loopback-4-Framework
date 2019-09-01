import { Request, RestBindings, get, ResponseObject, post, param } from '@loopback/rest';
import { inject } from '@loopback/context';
const nodemailer = require('nodemailer');
const nodemailerMailGun = require('nodemailer-mailgun-transport');

/**
 * OpenAPI response for ping()
 */
const PING_RESPONSE: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          greeting: { type: 'string' },
          date: { type: 'string' },
          url: { type: 'string' },
          headers: {
            type: 'object',
            properties: {
              'Content-Type': { type: 'string' },
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

/**
 * A simple controller to bounce back http requests
 */
export class PingController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) { }

  // Map to `GET /ping`
  @get('/ping', {
    responses: {
      '200': PING_RESPONSE,
    },
  })
  ping(): object {
    // Reply with a greeting, the current time, the url, and request headers
    return {
      greeting: 'Hello from LoopBack',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }



  @post('/sendEmail/{userEmail}', {
    responses: {
      '200': {
        description: 'Email Successfully Sent',
      },
    },
  })
  async sendMail(@param.path.string('userEmail') userEmail: string) {
    const auth = {
      auth: {
        api_key: '41f135d37ab1d57cda971d2098cf6cc2-19f318b0-ace2f0d3',
        domain: 'sandbox73d0a061cbb649398a867d25f43fa3e7.mailgun.org'
      }
    }
    let transporter = nodemailer.createTransport(nodemailerMailGun(auth))

    const mailOptions = {
      from: 'Excited User <me@samples.mailgun.org>',
      to: userEmail,
      subject: "Testmail",
      html: '<p>This is a mail</p>'

    }


    transporter.sendMail(mailOptions, function (err: any, data: any) {
      if (err) {
        console.log('Error: ' + err);
      }
      else {
        console.log('Message Sent!!!!')
      }
    })

  }
}
