// Write GraphQL mutations

export const MUTATION_LOGIN = `
  mutation TokenCreate($email: String!, $password: String!) {
    tokenCreate(email: $email, password: $password) {
      token
      errors { field message }
    }
  }
`;

export const MUTATION_REGISTER = `
  mutation AccountRegister($input: AccountRegisterInput!) {
    accountRegister(input: $input) {
      user { id email }
      requiresConfirmation
      errors { field message }
    }
  }
`;
