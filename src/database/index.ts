import { createConnection, Connection } from 'typeorm';

export async function connectToDb(): Promise<Connection> {
  const connection = await createConnection();
  console.log('conectou');
  return connection.driver.afterConnect().then();
}
