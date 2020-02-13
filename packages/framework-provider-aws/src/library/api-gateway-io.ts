import { APIGatewayProxyResult } from 'aws-lambda'
import { InvalidParameterError, NotAuthorizedError, NotFoundError } from '@boostercloud/framework-types'
import { toClassTitle } from '@boostercloud/framework-types/dist'

export function httpStatusCodeFor(error: Error): number {
  const errorToHTTPCode: Record<string, number> = {
    [InvalidParameterError.name]: 400,
    [NotAuthorizedError.name]: 401,
    [NotFoundError.name]: 404,
  }

  return errorToHTTPCode[error.constructor.name] ?? 500
}

export async function requestFailed<TError extends Error>(error: InvalidParameterError): Promise<APIGatewayProxyResult> {
  const statusCode = httpStatusCodeFor(error)
  return {
    statusCode,
    body: JSON.stringify({
      statusCode,
      title: toClassTitle(error.constructor),
      reason: error.message,
    }),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function requestSucceeded(body?: any): APIGatewayProxyResult {
  return {
    statusCode: 200,
    body: body ? JSON.stringify(body) : '',
  }
}
