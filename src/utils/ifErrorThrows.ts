export function ifErrorThrows(status: number) {
  if (status !== (200 | 201 | 202 | 204)) {
    console.log('to catch')
    throw new Error(status.toString())
  }
}
