import nats, { Stan } from 'node-nats-streaming';

export class NATSWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error('Cannot Access NATS Client');
    }

    return this._client;
  }
  // This is equivalent to nats.connect()
  connect(clusterID: string, ClientID: string, url: string): Promise<void> {
    this._client = nats.connect(clusterID, ClientID, { url });

    return new Promise((resolve, reject) => {
      // This is equivalent to stan.on('connect',()=>{})
      this.client!.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });
      this.client!.on('error', (err) => {
        console.log('NATS Connection Error');
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NATSWrapper();
