import { MongoClient, MongoClientOptions } from 'mongodb';
export async function connectToDb(uri: string, dbName: string) {
    const options: MongoClientOptions = {};
    const client = await connect(uri, options);
    return client.db(dbName);
}
export function connect(uri: string, options: MongoClientOptions): Promise<MongoClient> {
    return new Promise<MongoClient>((resolve, rejects) => {
        MongoClient.connect(uri, options, (err, client?: MongoClient) => {
            if (err) {
                console.log('failed to connect to MongoDB.');
                rejects(err);
            } else {
                console.log('connected successfully to MongoDB.');
                if (client) {
                    resolve(client);
                }
            }
        });
    });
}
