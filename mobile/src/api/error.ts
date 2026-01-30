export const getGraphQLErrorMessage = (err: any): string => {
  const gqlError = err?.graphQLErrors?.[0];
  if (gqlError?.extensions?.code === 'INSUFFICIENT_FUNDS') {
    return 'Saldo insuficiente';
  }
  if (gqlError?.extensions?.code === 'UNAUTHORIZED') {
    return 'No autorizado. Revisa tu token.';
  }
  return gqlError?.message || err?.message || 'Error inesperado';
};
