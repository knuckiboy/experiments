// Helper method to wait for a middleware to execute before continuing

import { NextApiRequest, NextApiResponse } from "next"


// And to throw an error when an error happens in a middleware
export default function runMiddleware(req: NextApiRequest & { [key: string]: any }, res: NextApiResponse,   fn: (...args: any[]) => void): Promise<any> {
    return new Promise((resolve, reject) => {
      fn(req, res, (result:any) => {
        if (result instanceof Error) {
          return reject(result)
        }
        return resolve(result)
      })
    })
  }