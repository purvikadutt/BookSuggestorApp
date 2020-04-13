# Using Travis instead of Jenkins for Deployment

## Status
Accepted

## Context
A CI/CD tool choice will have an impact on the development flow of the application. 

## Decision
The final decision was made to use Travis instead of Jenkins as it offers easier integration with GitHub, a easier configuration setup, and does not require a hosted implementation of the service. Additionally, it allows for the design goals for automated testing and deployment of the application to be met easily.

## Consequences
Lost customizability and features of Jenkins, have to rely on build servers run by Travis CI.
