// Simulate API delays
export const simulateDelay = (ms = 1000) => 
  new Promise(resolve => setTimeout(resolve, ms))

// Simulate success/error responses
export const simulateApiCall = async (data, shouldFail = false) => {
  await simulateDelay(800)
  if (shouldFail) {
    throw new Error('Simulated API error')
  }
  return data
}
