import math
from scipy.stats import norm

def calculateImpliedVolatility(optionPrice, underlyingPrice, strikePrice, riskFreeRate, timeToMaturity):
    tolerance = 1e-6  # Desired tolerance for the implied volatility
    maxIterations = 100  # Maximum number of iterations for convergence

    # Define a function to solve for implied volatility using the Black-Scholes formula
    def blackScholesImpliedVolatility(sigma):
        d1 = (math.log(underlyingPrice / strikePrice) + (riskFreeRate + 0.5 * sigma**2) * timeToMaturity) / (sigma * math.sqrt(timeToMaturity))
        d2 = d1 - sigma * math.sqrt(timeToMaturity)

        callOptionPrice = underlyingPrice * norm.cdf(d1) - strikePrice * math.exp(-riskFreeRate * timeToMaturity) * norm.cdf(d2)

        return callOptionPrice - optionPrice

    # Use a numerical method (e.g., Newton's method) to solve for implied volatility
    impliedVolatility = 0.5  # Initial guess for implied volatility

    for _ in range(maxIterations):
        priceDifference = blackScholesImpliedVolatility(impliedVolatility)

        if abs(priceDifference) < tolerance:
            break

        # Update implied volatility using Newton's method
        impliedVolatility -= priceDifference / blackScholesImpliedVolatility(impliedVolatility + 0.01)

    return impliedVolatility
