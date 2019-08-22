import { Request, RestBindings, get, ResponseObject } from '@loopback/rest';
import { inject } from '@loopback/context';
import { Tree } from "../lib/tree";
import { TodoRepository } from '../repositories';
import { repository } from '@loopback/repository';
import { authenticate, STRATEGY } from 'loopback4-authentication';


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




export class PingController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request,
    @repository(TodoRepository) public todoRepository: TodoRepository) { }

  // Map to `GET /ping`
  @get('/ping', {
    responses: {
      '200': PING_RESPONSE,
    },
  })
  ping(): object {
    // Reply with a greeting, the current time, the url, and request headers
    return {
      greeting: 'Hello User Habiba',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }

  @authenticate(STRATEGY.BEARER)
  @get('/tree', {
    responses: {
      '200': PING_RESPONSE,
    },
  })
  Tree(): object {
    const tree = new Tree();
    return {
      "status": "My Tree",

    }
  }

  @get('/Todo', {
    responses: {
      '200': PING_RESPONSE,
    },
  })
  async fetchTodos(): Promise<object> {

    let myTodos = await this.todoRepository.find();
    return {
      "status": "My Todos",
      "Todos": myTodos,

    }
  }


}
